export type NavLink = {
  href: string;
  label: string;
};

export const mainNav: NavLink[] = [
  { href: "/tickets", label: "Tickets" },
  { href: "/shop", label: "Shop" },
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
  { href: "/shop", label: "Shop" },
];

export const footerLegalNav: NavLink[] = [
  { href: "/legal/terms", label: "Terms & Conditions" },
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/cookies", label: "Cookie Policy" },
  { href: "/legal/personal-data", label: "Personal Data Processing Agreement" },
];

// TODO: replace "#" with the real social profiles
export const socialLinks = [
  { href: "#", short: "FB", label: "Facebook" },
  { href: "#", short: "IG", label: "Instagram" },
  { href: "#", short: "VK", label: "VK" },
  { href: "#", short: "YT", label: "YouTube" },
];
