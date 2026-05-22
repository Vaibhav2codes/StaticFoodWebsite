function BrandMark() {
  return (
    <div className="brand-mark">
      <div className="brand-icon" aria-hidden="true">
        <svg viewBox="0 0 120 120" role="presentation">
          <defs>
            <linearGradient id="brandGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff5ab" />
              <stop offset="100%" stopColor="#f28d21" />
            </linearGradient>
          </defs>
          <circle cx="60" cy="60" r="52" fill="url(#brandGlow)" />
          <path
            d="M60 26c12 0 21 6 27 16l-10 4c-4-6-9-8-17-8-14 0-22 9-22 22s8 22 22 22c8 0 13-3 17-9l10 4c-6 10-15 17-27 17-22 0-37-15-37-34s15-34 37-34Z"
            fill="#8c3b00"
          />
          <path
            d="M59 52c11 0 18 7 18 17s-7 17-18 17-18-7-18-17 7-17 18-17Zm0 10c-5 0-8 3-8 7s3 7 8 7 8-3 8-7-3-7-8-7Z"
            fill="#fff6db"
          />
          <path
            d="M69 18c12 1 20 8 24 19-9 0-17-4-24-11-3-4-4-7 0-8Z"
            fill="#5f8a1f"
          />
        </svg>
      </div>
      <div>
        <p className="brand-title">Ozone Kitchen</p>
        <p className="brand-tag">Sunshine jars, ghar jaisa swaad</p>
      </div>
    </div>
  );
}

export default BrandMark;
