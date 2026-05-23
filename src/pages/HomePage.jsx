import { Link } from "react-router-dom";
import FoodSpotlightStrip from "../components/FoodSpotlightStrip";
import KitchenSpotlightCarousel from "../components/KitchenSpotlightCarousel";
import { siteConfig } from "../config/site";
import { foodSpotlightItems, pickleSpotlightItems } from "../data/spotlights";
import { useCart } from "../context/CartContext";
import { buildWhatsAppUrl } from "../utils/whatsapp";

function HomePage() {
  const { addItem } = useCart();

  function handleSpotlightOrder(item) {
    const whatsappUrl = buildWhatsAppUrl({
      outletName: siteConfig.outletName,
      whatsappNumber: siteConfig.whatsappNumber,
      items: [item],
      customerName: "Customer",
      total: item.unitPrice * item.quantity,
      notes: siteConfig.whatsappFooterLines
    });

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="page-stack">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">{siteConfig.heroEyebrow}</p>
          {/* <h1>{siteConfig.heroTitle}</h1> */}
          <p className="hero-text">{siteConfig.heroCopy}</p>
          {/* <p className="hero-support">{siteConfig.heroSupport}</p> */}

          <div className="hero-actions">
            <Link to="/menu" className="button button-primary">
              Explore Menu
            </Link>
            <Link to="/contact" className="button button-secondary">
              Contact Outlet
            </Link>
          </div>
        </div>

        <div className="hero-panel">
          <div className="hero-tile">
            <p className="tile-title">Why customers love it</p>
            {siteConfig.highlights.map((highlight) => (
              <p key={highlight} className="tile-copy">
                {highlight}
              </p>
            ))}
          </div>
          <div className="hero-tile warm-tile">
            <p className="tile-title">Quick order flow</p>
            <p className="tile-copy">Select jar size</p>
            <p className="tile-copy">Add favorites to cart</p>
            <p className="tile-copy">Checkout on WhatsApp</p>
          </div>
        </div>
      </section>

      <KitchenSpotlightCarousel
        items={pickleSpotlightItems}
        onAddToCart={addItem}
        eyebrow="Pickle Spotlight"
        title="The kind of pickle your nani would approve"
      />

      <FoodSpotlightStrip
        items={foodSpotlightItems}
        onAddToCart={addItem}
      />

      <div className="section-header">
        <div>
          <p className="eyebrow">Explore More</p>
          <h2>Browse the full Ozone Kitchen menu</h2>
        </div>
        <Link to="/menu" className="section-link">
          View full menu
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
