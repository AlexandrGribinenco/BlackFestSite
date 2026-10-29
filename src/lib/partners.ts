// Festival sponsors (Figma: Desktop / D14 · Partners 347:6222 and the Home "Partners & sponsors" block). The wireframe
// shows a general partner, partners and media partners; on 29.10.2026 the client asked to keep only two sponsors,
// Red Bull and Absolut Vodka, so the page and the Home block show just these two.
// Logos: public/images/partners, the brands' word marks from Wikimedia Commons (public domain as simple text logos;
// the trademarks belong to their owners). Red Bull in its red, Absolut in white: its blue is lost on the dark background.
// TODO: the sponsors' own links, if they want other pages than their main sites.

export type PartnerLogo = {
  /** File in public/images/partners */
  file: string;
  /** Width / height of the drawing */
  ratio: number;
};

export type Partner = {
  name: string;
  /** Card heading when it differs from the name */
  title?: string;
  category?: string;
  /** One or two lines about the partner */
  description?: string;
  url: string;
  logo?: PartnerLogo;
};

export const SPONSORS: Partner[] = [
  { name: "Red Bull", category: "Sponsor", url: "https://www.redbull.com", logo: { file: "red-bull.svg", ratio: 4.21 } },
  { name: "Absolut Vodka", category: "Sponsor", url: "https://www.absolut.com/en/", logo: { file: "absolut.svg", ratio: 4.8 } },
];
