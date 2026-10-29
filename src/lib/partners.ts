// Festival partners (Figma: Desktop / D14 · Partners 347:6222 and the Home "Partners & sponsors" block, with logos
// since 29.10.2026; Mobile / M13 still has placeholders and uses the same data).
// Logos: public/images/partners, from Simple Icons (CC0 drawings; the trademarks belong to their owners), white as in
// the wireframe, Coca-Cola in its red.
// TODO: Heineken's logo (not in Simple Icons; its name stands in for it until the partner sends the file) and the
// partners' own links — the cards point to the brands' main sites for now.

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
  /** One or two lines about the partner (general partner only) */
  description?: string;
  url: string;
  logo?: PartnerLogo;
};

export const GENERAL_PARTNER: Partner = {
  name: "Coca-Cola",
  title: "Coca-Cola — Official Sponsor",
  description: "Official sponsor of Black Out Fest — refreshments in every festival zone.",
  url: "https://www.coca-cola.com",
  logo: { file: "coca-cola.svg", ratio: 3.188 },
};

export const PARTNERS: Partner[] = [
  { name: "Heineken", category: "Bar partner", url: "https://www.heineken.com" },
  { name: "JBL", category: "Sound partner", url: "https://www.jbl.com", logo: { file: "jbl.svg", ratio: 1.782 } },
  { name: "Sony", category: "Light & video partner", url: "https://www.sony.com", logo: { file: "sony.svg", ratio: 5.682 } },
  { name: "PUMA", category: "Merch partner", url: "https://www.puma.com", logo: { file: "puma.svg", ratio: 1.297 } },
];

export const MEDIA_PARTNERS: Partner[] = [
  { name: "Spotify", category: "Streaming", url: "https://www.spotify.com", logo: { file: "spotify.svg", ratio: 1 } },
  { name: "YouTube", category: "Video", url: "https://www.youtube.com", logo: { file: "youtube.svg", ratio: 1.419 } },
  { name: "TikTok", category: "Social", url: "https://www.tiktok.com", logo: { file: "tiktok.svg", ratio: 0.869 } },
  { name: "Twitch", category: "Live stream", url: "https://www.twitch.tv", logo: { file: "twitch.svg", ratio: 0.857 } },
  { name: "SoundCloud", category: "Audio", url: "https://soundcloud.com", logo: { file: "soundcloud.svg", ratio: 2.233 } },
  { name: "Bandcamp", category: "Music", url: "https://bandcamp.com", logo: { file: "bandcamp.svg", ratio: 1.778 } },
];

/** The six logos in the Home "Partners & sponsors" block, in the wireframe's order */
export const HOME_PARTNERS: Partner[] = [GENERAL_PARTNER, ...PARTNERS, MEDIA_PARTNERS[0]];
