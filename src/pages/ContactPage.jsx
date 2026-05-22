import { siteConfig } from "../config/site";

function ContactPage() {
  return (
    <div className="page-stack">
      <section className="page-banner">
        <p className="eyebrow">Contact | Sampark</p>
        <h1>Placeholder outlet details, ready for your real updates.</h1>
        <p>
          Replace the sample contact information and WhatsApp number whenever the
          real business details are ready.
        </p>
      </section>

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

      {/* <section className="card-panel">
        <p className="eyebrow">Bulk Orders Later</p>
        <h2>This setup is ready to expand.</h2>
        <p>
          The menu lives in one data file, so adding more categories, product
          photos, or future bulk-order items will stay straightforward.
        </p>
      </section> */}
    </div>
  );
}

export default ContactPage;
