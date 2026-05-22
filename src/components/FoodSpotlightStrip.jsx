import { Link } from "react-router-dom";
import { useRef } from "react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import QuantityStepper from "./QuantityStepper";

function FoodSpotlightStrip({ items, onAddToCart }) {
  const trackRef = useRef(null);
  const { getItemQuantity, updateQuantity } = useCart();

  function scrollTrack(direction) {
    if (!trackRef.current) {
      return;
    }

    trackRef.current.scrollBy({
      left: direction * 320,
      behavior: "smooth"
    });
  }

  return (
    <section className="food-spotlight-shell" aria-labelledby="food-spotlight-title">
      <div className="food-spotlight-header">
        <div>
          <p className="eyebrow">Food Spotlight</p>
          <h2 id="food-spotlight-title">Kitchen favorites to swipe through</h2>
        </div>

        <div className="food-spotlight-controls">
          <button
            type="button"
            className="food-spotlight-arrow"
            aria-label="Scroll food spotlight left"
            onClick={() => scrollTrack(-1)}
          >
            &lt;
          </button>
          <button
            type="button"
            className="food-spotlight-arrow"
            aria-label="Scroll food spotlight right"
            onClick={() => scrollTrack(1)}
          >
            &gt;
          </button>
        </div>
      </div>

      <div className="food-spotlight-track" ref={trackRef}>
        {items.map((item) => {
          const quantity = getItemQuantity(item.id, item.variantLabel);

          return (
            <article key={item.id} className="food-spotlight-card">
              <div className="food-spotlight-image-wrap">
                <img src={item.image} alt={item.name} className="food-spotlight-image" />
              </div>

              <div className="food-spotlight-copy">
                <p className="product-category">{item.category}</p>
                <h3>{item.name}</h3>
                <p className="food-spotlight-subtitle">{item.hindiName}</p>
                <p className="food-spotlight-description">{item.description}</p>

                <div className="food-spotlight-tags">
                  {item.tags.map((tag) => (
                    <span key={tag} className="food-spotlight-tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="food-spotlight-footer">
                  <p className="food-spotlight-price">{formatPrice(item.price)}</p>
                  <div className="food-spotlight-actions">
                    {quantity === 0 ? (
                      <button
                        type="button"
                        className="button button-primary"
                        onClick={() =>
                          onAddToCart({
                            productId: item.id,
                            productName: item.name,
                            variantLabel: item.variantLabel,
                            unitPrice: item.price,
                            quantity: 1
                          })
                        }
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <QuantityStepper
                        className="food-spotlight-stepper"
                        quantity={quantity}
                        itemName={`${item.name} ${item.variantLabel}`}
                        onDecrement={() =>
                          updateQuantity(item.id, item.variantLabel, quantity - 1)
                        }
                        onIncrement={() =>
                          onAddToCart({
                            productId: item.id,
                            productName: item.name,
                            variantLabel: item.variantLabel,
                            unitPrice: item.price,
                            quantity: 1
                          })
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        <Link to="/menu" className="food-spotlight-viewall">
          <span className="food-spotlight-viewall-eyebrow">10 Items</span>
          <strong>View all</strong>
          <p>See the full Ozone Kitchen menu and explore more categories.</p>
        </Link>
      </div>
    </section>
  );
}

export default FoodSpotlightStrip;
