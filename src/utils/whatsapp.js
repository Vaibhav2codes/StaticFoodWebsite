import { formatPrice } from "./format";

export function buildWhatsAppUrl({
  outletName,
  whatsappNumber,
  items,
  customerName,
  total,
  notes = [],
  deliveryDetails
}) {
  const lines = [
    `*${outletName} Order*`,
    `Name: ${customerName.trim()}`,
    "",
    "Items:"
  ];

  items.forEach((item, index) => {
    const lineTotal = item.unitPrice * item.quantity;
    lines.push(
      `${index + 1}. ${item.productName} (${item.variantLabel}) x ${item.quantity} - ${formatPrice(lineTotal)}`
    );
  });

  lines.push("");
  lines.push(`Total: ${formatPrice(total)}`);
  if (deliveryDetails) {
    lines.push("");
    lines.push("*Delivery Details:*");
    lines.push(`Main Address: ${deliveryDetails.selectedAddress}`);
    lines.push(`Building Name: ${deliveryDetails.buildingName}`);
    lines.push(`Room / Flat Number: ${deliveryDetails.roomNumber}`);
    if (deliveryDetails.latitude && deliveryDetails.longitude) {
      lines.push(
        `Pin: https://www.google.com/maps?q=${deliveryDetails.latitude},${deliveryDetails.longitude}`
      );
    }
    lines.push(
      `Location Confirmed: ${deliveryDetails.locationConfirmed ? "Yes" : "No"}`
    );
  }
  if (notes.length > 0) {
    lines.push("");
    notes.forEach((note) => {
      lines.push(note);
    });
  }
  lines.push("Please confirm this order. Kripya order confirm karein.");

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}
