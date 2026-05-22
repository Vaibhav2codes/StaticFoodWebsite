import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function CartBadge() {
  const { itemCount } = useCart();

  return (
    <Link
      to="/cart"
      className="cart-badge"
      aria-label={`Cart with ${itemCount} item${itemCount === 1 ? "" : "s"}`}
    >
      <span className="cart-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        {itemCount > 0 ? <span className="cart-badge-count">{itemCount}</span> : null}
      </span>
      <span className="cart-badge-label">Cart</span>
    </Link>
  );
}

export default CartBadge;
