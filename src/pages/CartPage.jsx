import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeliveryAddressModal from "../components/DeliveryAddressModal";
import { siteConfig } from "../config/site";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import { getGoogleMapsApiKey } from "../utils/googleMaps";
import { buildWhatsAppUrl } from "../utils/whatsapp";

const CUSTOMER_STORAGE_KEY = "ozone-kitchen-customer-name";
const DELIVERY_STORAGE_KEY = "ozone-kitchen-delivery-details";

function readStoredName() {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(CUSTOMER_STORAGE_KEY) || "";
}

function readStoredDeliveryDetails() {
  const fallback = {
    buildingName: "",
    roomNumber: "",
    selectedAddress: "",
    latitude: null,
    longitude: null,
    locationConfirmed: false
  };

  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const stored = window.localStorage.getItem(DELIVERY_STORAGE_KEY);
    return stored ? { ...fallback, ...JSON.parse(stored) } : fallback;
  } catch {
    return fallback;
  }
}

function CartPage() {
  const { cartItems, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const [customerName, setCustomerName] = useState(readStoredName);
  const [deliveryDetails, setDeliveryDetails] = useState(readStoredDeliveryDetails);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const hasMapsKey = Boolean(getGoogleMapsApiKey());

  useEffect(() => {
    window.localStorage.setItem(CUSTOMER_STORAGE_KEY, customerName);
  }, [customerName]);

  useEffect(() => {
    window.localStorage.setItem(
      DELIVERY_STORAGE_KEY,
      JSON.stringify(deliveryDetails)
    );
  }, [deliveryDetails]);

  const canCheckout =
    cartItems.length > 0 &&
    customerName.trim() &&
    deliveryDetails.selectedAddress.trim() &&
    deliveryDetails.buildingName.trim() &&
    deliveryDetails.roomNumber.trim() &&
    deliveryDetails.locationConfirmed;

  const whatsappUrl = canCheckout
    ? buildWhatsAppUrl({
        outletName: siteConfig.outletName,
        whatsappNumber: siteConfig.whatsappNumber,
        items: cartItems,
        customerName,
        total: subtotal,
        notes: siteConfig.whatsappFooterLines,
        deliveryDetails
      })
    : "";

  function updateDeliveryField(field, value) {
    setDeliveryDetails((current) => ({
      ...current,
      [field]: value
    }));
  }

  function handleAddressConfirm(address) {
    setDeliveryDetails((current) => ({
      ...current,
      selectedAddress: address.selectedAddress,
      latitude: address.latitude,
      longitude: address.longitude,
      locationConfirmed: false
    }));
  }

  function handleCheckout() {
    if (!canCheckout) {
      return;
    }

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  if (cartItems.length === 0) {
    return (
      <section className="empty-cart card-panel">
        <p className="eyebrow">Your Cart | Aapka Cart</p>
        <h1>No items added yet.</h1>
        <p>
          Browse the menu, choose your preferred size or variant, and start
          building the WhatsApp order.
        </p>
        <Link to="/menu" className="button button-primary">
          Go to menu
        </Link>
      </section>
    );
  }

  return (
    <div className="cart-layout">
      <section className="card-panel">
        <div className="section-header">
          <div>
            <p className="eyebrow">Order Basket</p>
            <h1>Review your order</h1>
          </div>
          <button type="button" className="text-button" onClick={clearCart}>
            Clear cart
          </button>
        </div>

        <div className="cart-list">
          {cartItems.map((item) => (
            <article
              key={`${item.productId}-${item.variantLabel}`}
              className="cart-item-compact"
            >
              <div className="cart-item-compact-left">
                <h4 className="cart-item-name">{item.productName}</h4>
                <div className="cart-item-price-inline">{formatPrice(item.quantity * item.unitPrice)}</div>
              </div>

              <div className="cart-item-compact-right">
                <div className="quantity-box">
                  <button
                    type="button"
                    className="quantity-button"
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.variantLabel,
                        item.quantity - 1
                      )
                    }
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    className="quantity-button"
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.variantLabel,
                        item.quantity + 1
                      )
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="card-panel checkout-panel">
        <p className="eyebrow">WhatsApp Checkout</p>
        <h2>Send order in one tap</h2>

        <label className="field-label" htmlFor="customerName">
          Your Name
        </label>
        <input
          id="customerName"
          type="text"
          className="text-input"
          placeholder="Enter your name"
          value={customerName}
          onChange={(event) => setCustomerName(event.target.value)}
        />

        <label className="field-label" htmlFor="deliveryAddressButton">
          Delivery Address
        </label>
        <div className="address-picker">
          <button
            id="deliveryAddressButton"
            type="button"
            className="button button-secondary address-picker-button"
            onClick={() => setIsAddressModalOpen(true)}
            disabled={!hasMapsKey}
          >
            {deliveryDetails.selectedAddress
              ? "Change delivery address"
              : "Select delivery address"}
          </button>

          {!hasMapsKey ? (
            <p className="address-helper address-helper-error">
              Add <code>VITE_GOOGLE_MAPS_API_KEY</code> in your <code>.env</code> file to enable the map picker.
            </p>
          ) : null}

          {deliveryDetails.selectedAddress ? (
            <div className="selected-address-card">
              <p className="selected-address-label">Selected address</p>
              <p className="selected-address-value">{deliveryDetails.selectedAddress}</p>
            </div>
          ) : (
            <p className="address-helper">
              Pick the exact location on the map, then we will save that as the main delivery address.
            </p>
          )}

          {deliveryDetails.latitude && deliveryDetails.longitude ? (
            <p className="address-helper">
              Pin location: {deliveryDetails.latitude.toFixed(5)}, {deliveryDetails.longitude.toFixed(5)}
            </p>
          ) : null}
        </div>

        <label className="field-label" htmlFor="buildingName">
          Building Name
        </label>
        <input
          id="buildingName"
          type="text"
          className="text-input"
          placeholder="Example: Shyam Residency"
          value={deliveryDetails.buildingName}
          onChange={(event) =>
            updateDeliveryField("buildingName", event.target.value)
          }
        />

        <label className="field-label" htmlFor="roomNumber">
          Room / Flat Number
        </label>
        <input
          id="roomNumber"
          type="text"
          className="text-input"
          placeholder="Example: Flat 302"
          value={deliveryDetails.roomNumber}
          onChange={(event) =>
            updateDeliveryField("roomNumber", event.target.value)
          }
        />

        <label className="confirmation-check">
          <input
            type="checkbox"
            checked={deliveryDetails.locationConfirmed}
            onChange={(event) =>
              updateDeliveryField("locationConfirmed", event.target.checked)
            }
          />
          <span>I confirm this delivery address, building name, and room number are correct.</span>
        </label>

        <div className="summary-box">
          <div className="summary-row">
            <span>Items total</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <div className="summary-row summary-row-muted">
            <span>Packaging charges</span>
            <strong>Applicable</strong>
          </div>
          <div className="summary-row summary-row-muted">
            <span>Delivery charges</span>
            <strong>Applicable</strong>
          </div>
          <div className="summary-notes">
            <ul>
              <li>Delivery charges depend on distance</li>
              <li>Packaging charges may apply</li>
              <li>Orders confirmed on WhatsApp</li>
              <li>Cash payment on delivery</li>
            </ul>
          </div>
        </div>
      </aside>

      {/* Sticky bottom checkout */}
      <div className="cart-sticky-checkout">
        <button
          type="button"
          className="button button-primary cart-checkout-wide"
          disabled={!canCheckout}
          onClick={handleCheckout}
        >
          Checkout on WhatsApp
        </button>
      </div>

      <DeliveryAddressModal
        isOpen={isAddressModalOpen}
        initialValue={deliveryDetails}
        onClose={() => setIsAddressModalOpen(false)}
        onConfirm={handleAddressConfirm}
      />
    </div>
  );
}

export default CartPage;
