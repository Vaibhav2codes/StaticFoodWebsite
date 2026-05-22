import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "ozone-kitchen-cart";
const CartContext = createContext(null);

function readInitialCart() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(readInitialCart);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  function addItem(item) {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (cartItem) =>
          cartItem.productId === item.productId &&
          cartItem.variantLabel === item.variantLabel
      );

      if (!existingItem) {
        return [...currentItems, item];
      }

      return currentItems.map((cartItem) =>
        cartItem.productId === item.productId &&
        cartItem.variantLabel === item.variantLabel
          ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
          : cartItem
      );
    });
  }

  function updateQuantity(productId, variantLabel, quantity) {
    if (quantity <= 0) {
      removeItem(productId, variantLabel);
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((cartItem) =>
        cartItem.productId === productId && cartItem.variantLabel === variantLabel
          ? { ...cartItem, quantity }
          : cartItem
      )
    );
  }

  function removeItem(productId, variantLabel) {
    setCartItems((currentItems) =>
      currentItems.filter(
        (cartItem) =>
          !(
            cartItem.productId === productId &&
            cartItem.variantLabel === variantLabel
          )
      )
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  function getItemQuantity(productId, variantLabel) {
    const cartItem = cartItems.find(
      (item) =>
        item.productId === productId && item.variantLabel === variantLabel
    );

    return cartItem?.quantity || 0;
  }

  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        itemCount,
        subtotal,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        getItemQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const value = useContext(CartContext);

  if (!value) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return value;
}
