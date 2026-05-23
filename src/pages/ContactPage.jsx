import {
  FaFacebookF,
  FaInstagram,
  FaYoutube
} from "react-icons/fa";

import { siteConfig } from "../config/site";

function ContactPage() {
  return (
    <div className="page-stack">

      <section className="info-grid">

        <article className="info-card">
          <p className="info-card-title">Phone / WhatsApp</p>
          <p>{siteConfig.contact.phone}</p>
        </article>

        <article className="info-card">
          <p className="info-card-title">Email</p>
          <p>{siteConfig.contact.email}</p>
        </article>

        <article className="info-card">
          <p className="info-card-title">Hours</p>
          <p>{siteConfig.contact.hours}</p>
        </article>

      </section>

      <section className="card-panel">

        <p className="eyebrow">Follow Us</p>

        <div className="social-links">

          <a
            href={siteConfig.socialLinks.facebook}
            target="_blank"
            rel="noreferrer"
            className="social-link-card"
          >
            <FaFacebookF size={22} />
            <span>Facebook</span>
          </a>

          <a
            href={siteConfig.socialLinks.instagram}
            target="_blank"
            rel="noreferrer"
            className="social-link-card"
          >
            <FaInstagram size={22} />
            <span>Instagram</span>
          </a>

          <a
            href={siteConfig.socialLinks.youtubeMain}
            target="_blank"
            rel="noreferrer"
            className="social-link-card"
          >
            <FaYoutube size={22} />
            <span>Ozone Kitchen</span>
          </a>

          <a
            href={siteConfig.socialLinks.youtubeRecipes}
            target="_blank"
            rel="noreferrer"
            className="social-link-card"
          >
            <FaYoutube size={22} />
            <span>Ozone Vibes</span>
          </a>

        </div>

      </section>

    </div>
  );
}

export default ContactPage;