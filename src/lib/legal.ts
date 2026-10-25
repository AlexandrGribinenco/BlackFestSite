// Legal documents rendered by the D7 template (app/(site)/legal/[slug]).
// TODO: real texts from the organizer's lawyer. Privacy Policy headings come from the wireframe,
// the other headings are placeholders.

export type LegalDoc = {
  slug: string;
  title: string;
  sections: string[];
};

export const LEGAL_DOCS: LegalDoc[] = [
  {
    slug: "terms",
    title: "Terms & Conditions",
    sections: ["Who we are", "Tickets and prices", "Refunds and exchanges", "Entry and conduct", "Liability", "Contact"],
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    sections: ["Who we are", "What data we collect", "Why we use it", "How long we keep it", "Your rights", "Contact"],
  },
  {
    slug: "cookies",
    title: "Cookie Policy",
    sections: ["What cookies are", "Cookies we use", "Analytics and marketing", "How to change your choice", "Contact"],
  },
  {
    slug: "personal-data",
    title: "Personal Data Processing Agreement",
    sections: ["Parties", "Data we process", "Purpose of processing", "Storage and security", "Your rights", "Contact"],
  },
];

export const LEGAL_UPDATED = "[DATE]";
export const LEGAL_OWNER = "Î.I. CIOBANU ALEXANDRU";

export const legalHref = (slug: string) => `/legal/${slug}`;

export const sectionId = (index: number, title: string) =>
  `${index + 1}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
