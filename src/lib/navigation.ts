export type NavLink = {
  href: string;
  label: string;
};

export const mainNav: NavLink[] = [
  { href: "/tickets", label: "Tickets" },
  { href: "/shop", label: "Store" },
  { href: "/gallery", label: "Gallery" },
  { href: "/bar-restaurant", label: "Bar & Restaurant" },
  { href: "/hotels", label: "Hotels" },
  { href: "/info", label: "Info" },
  { href: "/contacts", label: "Contacts" },
];

export const footerFestivalNav: NavLink[] = [
  { href: "/tickets", label: "Tickets" },
  { href: "/gallery", label: "Gallery" },
  { href: "/bar-restaurant", label: "Bar & Restaurant" },
  { href: "/hotels", label: "Hotels" },
  { href: "/partners", label: "Partners" },
  { href: "/info", label: "Info & FAQ" },
  { href: "/contacts", label: "Contacts" },
  { href: "/shop", label: "Store" },
];

export const footerLegalNav: NavLink[] = [
  { href: "/legal/terms", label: "Terms & Conditions" },
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/cookies", label: "Cookie Policy" },
  { href: "/legal/personal-data", label: "Personal Data Processing Agreement" },
];

// TODO: replace "#" with the real social profiles. Facebook, Instagram, X and YouTube, shown by their logos (20.11.2026);
// the icons are in components/Socials.tsx
export const socialLinks = [
  { href: "#", id: "facebook", label: "Facebook" },
  { href: "#", id: "instagram", label: "Instagram" },
  { href: "#", id: "x", label: "X" },
  { href: "#", id: "youtube", label: "YouTube" },
] as const;

export type SocialId = (typeof socialLinks)[number]["id"];
