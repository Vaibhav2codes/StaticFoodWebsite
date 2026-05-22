function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  className = "",
  itemName = "item"
}) {
  const classes = ["quantity-box", className].filter(Boolean).join(" ");

  return (
    <div className={classes} aria-label={`${itemName} quantity controls`}>
      <button
        type="button"
        className="quantity-button"
        aria-label={`Decrease ${itemName} quantity`}
        onClick={onDecrement}
      >
        -
      </button>
      <span className="quantity-value" aria-live="polite" aria-atomic="true">
        {quantity}
      </span>
      <button
        type="button"
        className="quantity-button"
        aria-label={`Increase ${itemName} quantity`}
        onClick={onIncrement}
      >
        +
      </button>
    </div>
  );
}

export default QuantityStepper;
