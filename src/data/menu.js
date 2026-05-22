import excelMenuItems from "./excel-menu.generated.json";

export const pickleMenuItems = [
  {
    id: "aam-achar-keri-ka-achar",
    category: "Pickles",
    name: "Aam Achar (Keri ka Achar)",
    hindiName: "Aam ka Achar",
    badge: "Bestseller",
    tags: ["No Preservatives", "Small Batch", "Homemade"],
    description:
      "Homemade aam pickle prepared with bold masalas for a rich, traditional achar finish.",
    image: "/menu-images/aam-achar-keri-ka-achar-785807831.jpg",
    accent: "sunrise",
    variants: [
      { label: "250g", price: 200 },
      { label: "500g", price: 400 },
      { label: "1kg", price: 800 }
    ]
  },
  {
    id: "green-chilli-pickle",
    category: "Pickles",
    name: "Green Chilli Pickle",
    hindiName: "Hari Mirch ka Achar",
    badge: "Fresh Batch",
    tags: ["No Preservatives", "Spicy", "Homemade"],
    description:
      "Tasty and delicious homemade green chilli pickle with a bright, fiery household flavor.",
    image: "/menu-images/green-chilli-pickle-785610401.jpg",
    accent: "leaf",
    variants: [
      { label: "250g", price: 150 },
      { label: "500g", price: 300 },
      { label: "1kg", price: 600 }
    ]
  },
  {
    id: "lasode-gunde-ka-achar",
    category: "Pickles",
    name: "Lasode (Gunde) ka Achar",
    hindiName: "Gunde ka Achar",
    badge: "Kitchen Favorite",
    tags: ["Rajasthani", "Handcrafted", "Homemade"],
    description:
      "Rajasthani-style lasode achar with a rich masala profile and old-school homely tang.",
    image: "/menu-images/lasode-gunde-ka-achar-785683203.jpg",
    accent: "earth",
    variants: [
      { label: "250g", price: 200 },
      { label: "500g", price: 400 },
      { label: "1kg", price: 800 }
    ]
  }
];

const accentByCategory = {
  Pickles: "spice",
  Beverages: "citrus",
  "Biryani and Rice": "earth",
  "Breakfast Combo": "sunrise",
  "French Fries": "ruby",
  "Jain Special": "leaf",
  "Maggi and pasta": "sunrise",
  "Main Course": "earth",
  Meals: "spice",
  Parathas: "sunrise",
  Pizza: "ruby",
  Sandwiches: "citrus",
  Snacks: "spice",
  "Special Thali": "earth",
  Sweets: "citrus",
  "Vrat Special / Navaratri Specials": "leaf"
};

function createMenuItem(item) {
  return {
    id: `menu-${item.catalogueId}`,
    category: item.category,
    name: item.name,
    hindiName: item.name,
    description: item.description,
    image: item.localImage,
    accent: accentByCategory[item.category] || "sunrise",
    variants: [
      {
        label: item.variantName || "Standard",
        price: item.currentPrice
      }
    ]
  };
}

export const menuItems = [
  ...pickleMenuItems,
  ...excelMenuItems
    .filter((item) => item.category !== "Pickles")
    .map(createMenuItem)
];

export const featuredItems = pickleMenuItems;
