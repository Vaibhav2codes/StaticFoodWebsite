import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { menuItems } from "../data/menu";
import { useCart } from "../context/CartContext";

function MenuPage() {
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [menuVisible, setMenuVisible] = useState(false);

  const groupedItems = useMemo(
    () =>
      menuItems.reduce((groups, item) => {
        groups[item.category] = groups[item.category] || [];
        groups[item.category].push(item);
        return groups;
      }, {}),
    []
  );

  const categoryOrder = [
    "Pickles",
    "Meals",
    "Main Course",
    "Breakfast Combo",
    "Snacks",
    "Sandwiches",
    "Beverages",
    "Parathas",
    "Biryani and Rice",
    "Special Thali",
    "Maggi and pasta",
    "French Fries",
    "Jain Special",
    "Pizza",
    "Sweets",
    "Vrat Special / Navaratri Specials"
  ];

  const orderedCategories = useMemo(
    () =>
      Object.keys(groupedItems).sort((left, right) => {
        const leftIndex = categoryOrder.indexOf(left);
        const rightIndex = categoryOrder.indexOf(right);

        if (leftIndex === -1 && rightIndex === -1) {
          return left.localeCompare(right);
        }

        if (leftIndex === -1) {
          return 1;
        }

        if (rightIndex === -1) {
          return -1;
        }

        return leftIndex - rightIndex;
      }),
    [groupedItems]
  );

  const filteredCategories =
    selectedCategory === "All"
      ? orderedCategories
      : orderedCategories.filter((category) => category === selectedCategory);

  function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function handleCategoryClick(category) {
    setSelectedCategory(category);
    setMenuVisible(false);
    const section = document.getElementById(slugify(category));
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <div className="page-stack menu-page">
      <section className="menu-page-header">
        <div>
          <p className="eyebrow">Menu</p>
          <h1>Choose from fresh food categories</h1>
        </div>
        <div className="category-filter" aria-label="Filter categories">
          <button
            type="button"
            className={`category-chip ${selectedCategory === "All" ? "active" : ""}`}
            onClick={() => setSelectedCategory("All")}
          >
            All
          </button>
          {orderedCategories.map((category) => (
            <button
              key={category}
              type="button"
              className={`category-chip ${selectedCategory === category ? "active" : ""}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {filteredCategories.map((category) => (
        <section key={category} id={slugify(category)} className="category-block">
          <div className="section-header">
            <div>
              <p className="eyebrow">Category</p>
              <h2>{category}</h2>
            </div>
          </div>
          <div className="product-grid">
            {groupedItems[category].map((item) => (
              <ProductCard key={item.id} item={item} onAddToCart={addItem} />
            ))}
          </div>
        </section>
      ))}

      <div className={`category-nav-shell ${menuVisible ? "is-open" : ""}`}>
        <div className="category-backdrop" onClick={() => setMenuVisible(false)} />

        <button
          type="button"
          className="menu-floating-button"
          onClick={() => setMenuVisible((value) => !value)}
          aria-expanded={menuVisible}
          aria-controls="category-nav-panel"
          aria-label="Open category menu"
        >
          Menu
        </button>

        <aside id="category-nav-panel" className="category-nav-panel" aria-hidden={!menuVisible}>
          <div className="category-nav-header">
            <div>
              <p className="eyebrow">Jump to</p>
              <h3>Food categories</h3>
            </div>
            <button
              type="button"
              className="nav-close-button"
              onClick={() => setMenuVisible(false)}
              aria-label="Close category menu"
            >
              ×
            </button>
          </div>
          <div className="category-nav-list">
            {orderedCategories.map((category) => (
              <button
                key={category}
                type="button"
                className={`category-nav-item ${selectedCategory === category ? "active" : ""}`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default MenuPage;
