// A bank card for the payment block in the footer: the client asked for "a picture of a card", something modern,
// with the neon waves from their examples (19.11.2026). Our own drawing in the site palette, not any bank's or card
// scheme's design, so it carries no logos and no real-looking number. Decorative: the logos next to it name the methods.

// Thin wave lines across the card, each a little shifted, as in the client's examples
const WAVES = Array.from({ length: 11 }, (_, i) => {
  const t = i / 10;
  const y = 26 + i * 5.5;
  return {
    d: `M-12 ${y + 10} C 30 ${y - 36 + t * 18}, 92 ${y + 44 - t * 34}, 174 ${y - 22 + t * 30}`,
    opacity: 0.3 + t * 0.6,
  };
});

export function PaymentCardArt() {
  return (
    <svg className="pay-card" viewBox="0 0 160 100" width="128" height="80" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="pay-card-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1b0b3f" />
          <stop offset="0.6" stopColor="#3a1584" />
          <stop offset="1" stopColor="#7a2ff0" />
        </linearGradient>
        <linearGradient id="pay-card-wave" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4f8cff" />
          <stop offset="0.5" stopColor="#b56bff" />
          <stop offset="1" stopColor="#ff2e93" />
        </linearGradient>
        <linearGradient id="pay-card-chip" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6dc8a" />
          <stop offset="1" stopColor="#c99a3a" />
        </linearGradient>
        <radialGradient id="pay-card-glow" cx="0.85" cy="0.9" r="0.6">
          <stop offset="0" stopColor="#ff2e93" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ff2e93" stopOpacity="0" />
        </radialGradient>
        <clipPath id="pay-card-shape">
          <rect width="160" height="100" rx="10" />
        </clipPath>
      </defs>

      <g clipPath="url(#pay-card-shape)">
        <rect width="160" height="100" fill="url(#pay-card-bg)" />
        <rect width="160" height="100" fill="url(#pay-card-glow)" />
        <g fill="none" stroke="url(#pay-card-wave)" strokeWidth="1">
          {WAVES.map((wave) => (
            <path key={wave.d} d={wave.d} strokeOpacity={wave.opacity} />
          ))}
        </g>
      </g>
      <rect x="0.5" y="0.5" width="159" height="99" rx="9.5" fill="none" stroke="#fff" strokeOpacity="0.22" />

      <text x="14" y="20" fill="#fff" fontSize="7.5" fontWeight="800" letterSpacing="1.6">
        BLACK OUT FEST
      </text>

      {/* Chip */}
      <rect x="14" y="34" width="22" height="16" rx="3" fill="url(#pay-card-chip)" />
      <path d="M14 42h22M25 34v16M19 34v16M31 34v16" stroke="#9c7420" strokeOpacity="0.55" strokeWidth="0.7" />

      {/* Contactless */}
      <g fill="none" stroke="#fff" strokeOpacity="0.85" strokeWidth="1.4" strokeLinecap="round">
        <path d="M134 37a7 7 0 0 1 0 10" />
        <path d="M138.5 33.5a12 12 0 0 1 0 17" />
        <path d="M143 30a17 17 0 0 1 0 24" />
      </g>

      <text x="14" y="82" fill="#fff" fillOpacity="0.9" fontSize="9" fontWeight="600" letterSpacing="1.5">
        •••• •••• •••• 2028
      </text>
    </svg>
  );
}
