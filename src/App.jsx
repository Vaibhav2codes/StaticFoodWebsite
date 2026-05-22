import { NavLink, Route, Routes } from "react-router-dom";
import BrandMark from "./components/BrandMark";
import CartBadge from "./components/CartBadge";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import ContactPage from "./pages/ContactPage";
import { siteConfig } from "./config/site";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/contact", label: "Contact" }
];

function App() {
  return (
    <div className="app-shell">
      <div className="bg-orb orb-one" />
      <div className="bg-orb orb-two" />
      <header className="topbar">
        <div className="container topbar-inner">
          <NavLink to="/" className="brand-link" aria-label="Ozone Kitchen home">
            <BrandMark />
          </NavLink>
          <nav className="nav">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? "nav-link nav-link-active" : "nav-link"
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <CartBadge />
        </div>
      </header>

      <main className="container page-frame">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <p className="footer-title">{siteConfig.outletName}</p>
            <p className="footer-copy">{siteConfig.footerNote}</p>
          </div>
          <p className="footer-copy">
            WhatsApp orders with a placeholder number for now. Swap it anytime in
            the site config.
          </p>
        </div>
      </footer> */}
    </div>
  );
}

export default App;
