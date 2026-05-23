import { useState } from "react";
import { siteConfig } from "../config/site";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import QuantityStepper from "./QuantityStepper";

function ProductCard({ item, onAddToCart }) {
  const [variantIndex, setVariantIndex] = useState(0);
  const { getItemQuantity, updateQuantity } = useCart();
  const selectedVariant = item.variants[variantIndex];
  const quantity = getItemQuantity(item.id, selectedVariant.label);
  const isPickle = item.category === "Pickles";
  const initials = item.name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

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
    updateQuantity(item.id, selectedVariant.label, quantity - 1);
  }

  return (
    <article className={`product-card ${isPickle ? "product-card-pickle" : "product-card-food"}`}>
      {isPickle ? (
        // Keep existing pickle layout
        <>
          <div className={`product-visual accent-${item.accent}`}>
            {item.image ? (
              <img src={item.image} alt={item.name} className="product-image" />
            ) : (
              <>
                <span className="product-chip">Fresh Batch</span>
                <span className="product-initials">{initials}</span>
                <span className="product-hindi">{item.hindiName}</span>
              </>
            )}
          </div>

          <div className="product-copy">
            <p className="product-category">{item.category}</p>
            <h3>{item.name}</h3>
            <p className="product-subtitle">{item.hindiName}</p>
            <p className="product-description">{item.description}</p>
          </div>

          <div className="product-controls">
            <label className="field-label" htmlFor={`${item.id}-variant`}>
              Choose size / variant
            </label>
            <select
              id={`${item.id}-variant`}
              value={variantIndex}
              onChange={(event) => setVariantIndex(Number(event.target.value))}
              className="variant-select"
            >
              {item.variants.map((variant, index) => (
                <option key={variant.label} value={index}>
                  {variant.label} - {formatPrice(variant.price)}
                </option>
              ))}
            </select>

            <div className="product-footer">
              <div>
                <p className="price-caption">Selected price</p>
                <p className="product-price">{formatPrice(selectedVariant.price)}</p>
              </div>
              {quantity === 0 ? (
                <button
                  type="button"
                  className="button button-primary"
                  onClick={handleAdd}
                >
                  Add to cart
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

            <p className="product-note">{siteConfig.picklePackagingNote}</p>
          </div>
        </>
      ) : (
        // New compact food card layout
        <div className="food-card-inner">
          <div className="food-card-left">
            <div className="food-card-meta">
              <span className={`veg-icon ${item.isVeg ? 'veg' : 'non-veg'}`} aria-hidden="true"></span>
              <div className="food-card-text">
                <h4 className="food-card-name">{item.name}</h4>
                <div className="food-card-price">{formatPrice(item.variants[0].price)}</div>
                <p className="food-card-desc">{item.description}</p>
              </div>
            </div>
          </div>

          <div className="food-card-right">
            {item.image ? (
              <img src={item.image} alt={item.name} className="food-card-image" />
            ) : (
              <div className="food-card-image food-card-image-fallback" />
            )}

            {quantity === 0 ? (
              <button type="button" className="food-add-button" onClick={handleAdd}>
                Add +
              </button>
            ) : (
              <div className="food-stepper-compact">
                <button type="button" className="stepper-btn" onClick={handleRemove}>-</button>
                <span className="stepper-count">{quantity}</span>
                <button type="button" className="stepper-btn" onClick={handleAdd}>+</button>
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

export default ProductCard;
