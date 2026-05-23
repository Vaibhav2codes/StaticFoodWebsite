import { useEffect, useRef, useState } from "react";
import { siteConfig } from "../config/site";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import QuantityStepper from "./QuantityStepper";

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 48;

function KitchenSpotlightCarousel({
  items,
  onAddToCart,
  eyebrow = "Pickle Spotlight",
  title = siteConfig.heroTitle
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  const { getItemQuantity, updateQuantity } = useCart();

  const trackRef = useRef(null);
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

  function handlePointerDown(event) {
    pointerStartX.current = event.clientX;
    pointerDeltaX.current = 0;
    setIsInteracting(true);
  }

  function handlePointerMove(event) {
    if (pointerStartX.current === null) {
      return;
    }

    pointerDeltaX.current =
      event.clientX - pointerStartX.current;
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

  function scrollTrack(direction) {
    if (!trackRef.current) {
      return;
    }

    trackRef.current.scrollBy({
      left: direction * 320,
      behavior: "smooth"
    });
  }

  if (total === 0) {
    return null;
  }

  return (
    <section
      className="food-spotlight-shell"
      aria-label={title}
    >
      <div className="food-spotlight-header">
        <div>
          <p className="eyebrow">{eyebrow}</p>

          <h2 id="food-spotlight-title">
            {title}
          </h2>
        </div>

        <div className="food-spotlight-controls">
          <button
            type="button"
            className="food-spotlight-arrow"
            aria-label="Scroll spotlight left"
            onClick={() => scrollTrack(-1)}
          >
            &lt;
          </button>

          <button
            type="button"
            className="food-spotlight-arrow"
            aria-label="Scroll spotlight right"
            onClick={() => scrollTrack(1)}
          >
            &gt;
          </button>
        </div>
      </div>

      <div
        className="food-spotlight-track"
        ref={trackRef}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={clearPointer}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {items.map((item) => {

          const selectedIndex =
            selectedVariants[item.id] ?? 0;

          const selectedVariant =
            item.variants[selectedIndex] ||
            item.variants[0];

          const quantity = getItemQuantity(
            item.id,
            selectedVariant.label
          );

          function handleAdd() {
            onAddToCart({
              productId: item.id,
              productName: item.name,
              variantLabel: selectedVariant.label,
              unitPrice: selectedVariant.price,
              quantity: 1
            });
          }

          function handleRemove() {
            updateQuantity(
              item.id,
              selectedVariant.label,
              quantity - 1
            );
          }

          return (
            <article
              key={item.id}
              className="food-spotlight-card"
            >
              <div
                className={`food-spotlight-image-wrap accent-${item.accent}`}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="food-spotlight-image"
                  />
                ) : (
                  <div
                    className="spotlight-image-fallback"
                    aria-hidden="true"
                  >
                    <span className="spotlight-fallback-label">
                      Ozone Kitchen
                    </span>

                    <span className="spotlight-fallback-initials">
                      {item.name
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="food-spotlight-copy">

                <p className="product-category">
                  {item.category}
                </p>

                <h3>{item.name}</h3>

                <p className="food-spotlight-subtitle">
                  {item.hindiName}
                </p>

                <p className="food-spotlight-description">
                  {item.description}
                </p>

                <div className="food-spotlight-tags">
                  {item.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="food-spotlight-tag"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="spotlight-variant-row">

                  <label
                    className="field-label"
                    htmlFor={`${item.id}-spotlight-variant`}
                  >
                    Choose jar size
                  </label>

                  <div className="spotlight-variant-actions">

                    <select
                      id={`${item.id}-spotlight-variant`}
                      className="variant-select spotlight-variant-select"
                      value={selectedIndex}
                      onChange={(event) =>
                        setSelectedVariants((current) => ({
                          ...current,
                          [item.id]: Number(event.target.value)
                        }))
                      }
                    >
                      {item.variants.map((variant, index) => (
                        <option
                          key={variant.label}
                          value={index}
                        >
                          {variant.label} - {formatPrice(variant.price)}
                        </option>
                      ))}
                    </select>

                    {quantity === 0 ? (
                      <button
                        type="button"
                        className="button button-primary spotlight-inline-add"
                        onClick={handleAdd}
                      >
                        Add
                      </button>
                    ) : (
                      <QuantityStepper
                        className="product-stepper"
                        quantity={quantity}
                        itemName={`${item.name} ${selectedVariant.label}`}
                        onDecrement={handleRemove}
                        onIncrement={handleAdd}
                      />
                    )}

                  </div>

                  <p className="spotlight-note">
                    Glass jar packaging charges extra.
                  </p>

                </div>

              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default KitchenSpotlightCarousel;