import excelMenuItems from "./excel-menu.generated.json";
import { pickleMenuItems as pickleSpotlightItems } from "./menu";

const foodSpotlightIds = [
  "757184580",
  "778538905",
  "758698168",
  "761280602",
  "757184585",
  "757765089",
  "763647997",
  "778189440",
  "764802872",
  "778982410"
];

const foodTagsByCategory = {
  Snacks: ["Freshly Made", "Street-Style", "Homemade"],
  Beverages: ["Chilled", "Creamy", "Homemade"],
  "Special Thali": ["Wholesome", "Family Meal", "Homemade"],
  "Biryani and Rice": ["Chef Special", "Comfort Food", "Homemade"],
  "Maggi and pasta": ["Quick Bite", "Creamy", "Kitchen Favorite"],
  Meals: ["Complete Meal", "Freshly Prepared", "Homestyle"],
  "Main Course": ["Rich Gravy", "Classic Taste", "Homemade"],
  "French Fries": ["Crispy", "Snack Time", "Fresh Batch"]
};

function createHindiSubtitle(item) {
  const hindiMap = {
    Poha: "Poha",
    "Malai Milk Rose (200ml)": "Malai Milk Rose",
    "Veg Home Style Complete Meal": "Ghar Jaisa Meal",
    "Paneer Bhurji Biryani (Chef's Special)": "Paneer Bhurji Biryani",
    "Classic Maggi": "Classic Maggi",
    "Maggi Macroni Cheese Pasta": "Cheese Pasta",
    "Dry Aloo Methi Meal": "Aloo Methi Meal",
    "Malai Lassi": "Malai Lassi",
    "Gatte ki Sabzi [250 g]": "Gatte ki Sabzi",
    "Peri Peri French Fries": "Peri Peri Fries"
  };

  return hindiMap[item.name] || item.name;
}

export const foodSpotlightItems = foodSpotlightIds
  .map((id) => excelMenuItems.find((item) => item.catalogueId === id))
  .filter(Boolean)
  .map((item) => ({
    id: `food-${item.catalogueId}`,
    category: item.category,
    name: item.name,
    hindiName: createHindiSubtitle(item),
    description: item.description,
    image: item.localImage,
    price: item.currentPrice,
    variantLabel: item.variantName,
    tags: foodTagsByCategory[item.category] || ["Fresh Batch", "Kitchen Made", "Homestyle"]
  }));

export { pickleSpotlightItems };
