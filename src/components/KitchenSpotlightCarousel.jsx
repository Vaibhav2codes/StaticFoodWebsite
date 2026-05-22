import { useEffect, useRef, useState } from "react";
import { siteConfig } from "../config/site";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import QuantityStepper from "./QuantityStepper";

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 48;

function normalizeOffset(index, activeIndex, total) {
  const rawOffset = index - activeIndex;
  const wrapOffset = ((rawOffset + total + Math.floor(total / 2)) % total) - Math.floor(total / 2);

  if (total % 2 === 0 && wrapOffset === -Math.floor(total / 2)) {
    return Math.floor(total / 2);
  }

  return wrapOffset;
}

function KitchenSpotlightCarousel({
  items,
  onAddToCart,
  onOrderWhatsApp,
  title = "Today's Kitchen Spotlight",
  eyebrow = "Signature Carousel",
  description = "Handcrafted jars with a warm homemade soul, styled like a premium D2C kitchen shelf."
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const { getItemQuantity, updateQuantity } = useCart();
  const pointerStartX = useRef(null);
  const pointerDeltaX = useRef(0);
  const total = items.length;

  useEffect(() => {
    if (total <= 1 || isHovered || isInteracting) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % total);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timerId);
  }, [isHovered, isInteracting, total]);

  function goToSlide(index) {
    setActiveIndex((index + total) % total);
  }

  function goToNext() {
    goToSlide(activeIndex + 1);
  }

  function goToPrevious() {
    goToSlide(activeIndex - 1);
  }

  function handleKeyDown(event) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToNext();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPrevious();
    }
  }

  function handlePointerDown(event) {
    pointerStartX.current = event.clientX;
    pointerDeltaX.current = 0;
    setIsInteracting(true);
  }

  function handlePointerMove(event) {
    if (pointerStartX.current === null) {
      return;
    }

    pointerDeltaX.current = event.clientX - pointerStartX.current;
  }

  function clearPointer() {
    pointerStartX.current = null;
    pointerDeltaX.current = 0;
    setIsInteracting(false);
  }

  function handlePointerUp() {
    if (pointerStartX.current === null) {
      return;
    }

    if (pointerDeltaX.current <= -SWIPE_THRESHOLD) {
      goToNext();
    } else if (pointerDeltaX.current >= SWIPE_THRESHOLD) {
      goToPrevious();
    }

    clearPointer();
  }

  function getSelectedVariant(item) {
    const selectedIndex = selectedVariants[item.id] ?? 0;
    return item.variants[selectedIndex] || item.variants[0];
  }

  if (total === 0) {
    return null;
  }

  return (
    <section
      className="spotlight-shell"
      aria-label={title}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="spotlight-spice spice-one" aria-hidden="true" />
      <div className="spotlight-spice spice-two" aria-hidden="true" />
      <div className="spotlight-header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <p className="spotlight-header-copy">{description}</p>
      </div>

      <div
        className="spotlight-viewport"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={clearPointer}
        onPointerLeave={clearPointer}
      >
        <button
          type="button"
          className="spotlight-arrow spotlight-arrow-left"
          aria-label="Previous spotlight item"
          onClick={goToPrevious}
        >
          <span aria-hidden="true">&lt;</span>
        </button>

        <div className="spotlight-stage">
          {items.map((item, index) => {
            const offset = normalizeOffset(index, activeIndex, total);
            const isActive = offset === 0;
            const distance = Math.abs(offset);
            const isVisible = distance <= 1;
            const selectedVariant = getSelectedVariant(item);
            const quantity = getItemQuantity(item.id, selectedVariant.label);
            const positionClass = isActive
              ? "spotlight-card-active"
              : distance === 1
                ? "spotlight-card-preview"
                : "spotlight-card-hidden";
            const initials = item.name
              .split(" ")
              .map((word) => word[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();

            return (
              <article
                key={item.id}
                className={`spotlight-card ${positionClass}`}
                style={{
                  "--offset": offset,
                  "--distance": distance,
                  "--direction": Math.sign(offset) || 1
                }}
                aria-hidden={!isActive}
              >
                <div className="spotlight-card-inner">
                  <div className={`spotlight-visual accent-${item.accent}`}>
                    <span className="spotlight-badge">{item.badge || "Fresh Batch"}</span>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="spotlight-image"
                      />
                    ) : (
                      <div className="spotlight-image-fallback" aria-hidden="true">
                        <span className="spotlight-fallback-label">Ozone Kitchen</span>
                        <span className="spotlight-fallback-initials">{initials}</span>
                        <span className="spotlight-fallback-hindi">{item.hindiName}</span>
                      </div>
                    )}
                  </div>

                  <div className="spotlight-copy">
                    <p className="spotlight-category">{item.category}</p>
                    <h3>{item.name}</h3>
                    <p className="spotlight-subtitle">{item.hindiName}</p>
                    <p className="spotlight-description">{item.description}</p>

                    <div className="spotlight-tags" aria-label="Product qualities">
                      {item.tags?.map((tag) => (
                        <span key={tag} className="spotlight-tag">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="spotlight-variant-row">
                      <label className="field-label" htmlFor={`${item.id}-spotlight-variant`}>
                        Pickle size
                      </label>
                      <select
                        id={`${item.id}-spotlight-variant`}
                        className="variant-select spotlight-variant-select"
                        value={selectedVariants[item.id] ?? 0}
                        onChange={(event) =>
                          setSelectedVariants((current) => ({
                            ...current,
                            [item.id]: Number(event.target.value)
                          }))
                        }
                      >
                        {item.variants.map((variant, variantIndex) => (
                          <option key={variant.label} value={variantIndex}>
                            {variant.label} - {formatPrice(variant.price)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="spotlight-footer">
                      <div>
                        <p className="price-caption">From</p>
                        <p className="spotlight-price">
                          {formatPrice(selectedVariant.price)}
                        </p>
                      </div>

                      <div className="spotlight-actions">
                        {quantity === 0 ? (
                          <button
                            type="button"
                            className="button button-primary"
                            onClick={() =>
                              onAddToCart({
                                productId: item.id,
                                productName: item.name,
                                variantLabel: selectedVariant.label,
                                unitPrice: selectedVariant.price,
                                quantity: 1
                              })
                            }
                          >
                            Add to Cart
                          </button>
                        ) : (
                          <QuantityStepper
                            className="spotlight-stepper"
                            quantity={quantity}
                            itemName={`${item.name} ${selectedVariant.label}`}
                            onDecrement={() =>
                              updateQuantity(item.id, selectedVariant.label, quantity - 1)
                            }
                            onIncrement={() =>
                              onAddToCart({
                                productId: item.id,
                                productName: item.name,
                                variantLabel: selectedVariant.label,
                                unitPrice: selectedVariant.price,
                                quantity: 1
                              })
                            }
                          />
                        )}
                        <button
                          type="button"
                          className="button button-secondary"
                          onClick={() =>
                            onOrderWhatsApp({
                              productId: item.id,
                              productName: item.name,
                              variantLabel: selectedVariant.label,
                              unitPrice: selectedVariant.price,
                              quantity: 1
                            })
                          }
                        >
                          Order on WhatsApp
                        </button>
                      </div>
                    </div>
                    <p className="spotlight-note">{siteConfig.picklePackagingNote}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <button
          type="button"
          className="spotlight-arrow spotlight-arrow-right"
          aria-label="Next spotlight item"
          onClick={goToNext}
        >
          <span aria-hidden="true">&gt;</span>
        </button>
      </div>

      <div className="spotlight-dots" role="tablist" aria-label="Kitchen spotlight slides">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Show ${item.name}`}
            className={index === activeIndex ? "spotlight-dot spotlight-dot-active" : "spotlight-dot"}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </section>
  );
}

export default KitchenSpotlightCarousel;
