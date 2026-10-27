// Legal documents rendered by the D7 template (app/(site)/legal/[slug]).
// Terms & Conditions: draft built from the maib e-commerce template (the sections maib requires for card
// payments), adapted to festival tickets and merchandise. Values in [brackets] are still to be decided.
// TODO: the organizer (or a lawyer) checks the Terms; the other documents still need their texts.
import { COMPANY } from "./company";

export type LegalSection = {
  title: string;
  /** Paragraphs; a section without text shows placeholder lines */
  body?: string[];
};

export type LegalDoc = {
  slug: string;
  title: string;
  sections: LegalSection[];
};

const placeholders = (...titles: string[]): LegalSection[] => titles.map((title) => ({ title }));

const terms: LegalSection[] = [
  {
    title: "General provisions",
    body: [
      `These Terms & Conditions apply to orders of festival tickets and merchandise placed on the Black Out Fest website. The website is owned by ${COMPANY.legalName} (the Seller). By placing an order, the Buyer accepts these Terms.`,
      "Using the website means accepting the Terms in accordance with Law No. 284/2004 on Electronic Commerce. Relations between the Buyer and the Seller are governed by Law No. 105/2003 on Consumer Protection and other laws of the Republic of Moldova.",
      "The Seller may change these Terms. The version published on the website at the time of the order applies to that order.",
    ],
  },
  {
    title: "Personal data protection",
    body: [
      "By using the website, you agree to the collection and processing of the personal data needed to process, confirm and fulfil your order.",
      "Personal data is processed only for legitimate purposes: delivering tickets and products, and — with your consent — newsletters, promotions and analytics (see the Cookie Policy). It is stored only for as long as these purposes require, in accordance with Law No. 133/2011 on Personal Data Protection.",
      "We use commercial security measures to prevent unauthorised access and to keep the data accurate. Data sent over the internet or a wireless network can never be fully protected, so we cannot guarantee the security of the information you send us.",
    ],
  },
  {
    title: "Ordering and payment",
    body: [
      "To order, choose your tickets or products, enter your contact details, accept these Terms and pay online. Orders are paid by bank card (Visa, Mastercard, American Express), Apple Pay or Google Pay. Prices are shown in [MDL] and include all taxes.",
      "Payments are processed by maib (BC “MAIB” S.A.) using 3-D Secure: at checkout you are redirected to a secure maib payment page, where your bank may ask you to confirm the payment with a one-time code. The payment page asks for the card number, the expiry date, the CVV/CVC code and the cardholder’s name. Card data is encrypted and stored only on the payment processor’s secure server; it is never entered on or stored by this website.",
      "If your card currency differs from the transaction currency, the conversion is made under the conditions of the bank that issued your card.",
      "After a successful payment you receive a confirmation by e-mail with the order number, the amount, the currency, the payment date and the list of ordered items. [How the fiscal receipt is issued.]",
      "Refunds are made only to the card used for the purchase.",
    ],
  },
  {
    title: "Delivery",
    body: [
      "E-tickets are sent to the e-mail address given in the order right after a successful payment and are shown on the order confirmation page. Show the QR code from the e-ticket at the entrance.",
      "Merchandise is delivered in the Republic of Moldova within [X] working days of the order confirmation, between [time] and [time]. Delivery costs [PRICE] and is free for orders from [PRICE]; the delivery cost is included in the order total. [Pickup at the festival.]",
      "Delivery may take longer in exceptional cases (bad weather, public holidays, unforeseen technical problems); we will let you know in advance. One delivery address is accepted per order.",
      "When receiving the parcel, please check the packaging and the receipt in the presence of the courier. Later claims about these are not accepted.",
    ],
  },
  {
    title: "Returns and refunds",
    body: [
      "Under Law No. 105/2003 on Consumer Protection, merchandise can be returned within 14 days of payment. The money is refunded to the card used for the purchase.",
      "[Items that cannot be exchanged or returned under Annex 2 of Government Decision No. 1465 of 08.12.2003.]",
      "Tickets: [refund and exchange rules for tickets, including what happens if the event is cancelled or postponed].",
      `Returns contact: ${COMPANY.phone}. Return requests are processed within [X] days. Return conditions: [conditions].`,
    ],
  },
  {
    title: "Privacy policy",
    body: [
      "In accordance with Law No. 133/2011 on Personal Data Protection, the Seller processes personal data in good faith, lawfully, by automated and manual means, under conditions that ensure security and confidentiality.",
      "We collect only the data you give us when ordering: first and last name, phone number, e-mail and, for merchandise, the delivery address. It is used to run the website, deliver orders and contact you about your order.",
      "We do not disclose, sell or exchange your data with third parties without your consent, except where the law requires it (requests from public authorities, law enforcement or courts). We do not collect payment card data: card number, expiry date and similar details are handled by the payment processor.",
      `For questions about your data, write to ${COMPANY.email} or call ${COMPANY.phone}. See also the Privacy Policy and the Personal Data Processing Agreement.`,
    ],
  },
  {
    title: "Contact details",
    body: [
      `Legal name: ${COMPANY.legalName}`,
      `IDNO: ${COMPANY.idno}`,
      `Legal address: ${COMPANY.legalAddress}`,
      `Phone: ${COMPANY.phone}`,
      `E-mail: ${COMPANY.email}`,
    ],
  },
];

export const LEGAL_DOCS: LegalDoc[] = [
  { slug: "terms", title: "Terms & Conditions", sections: terms },
  {
    slug: "privacy",
    title: "Privacy Policy",
    sections: placeholders("Who we are", "What data we collect", "Why we use it", "How long we keep it", "Your rights", "Contact"),
  },
  {
    slug: "cookies",
    title: "Cookie Policy",
    sections: placeholders("What cookies are", "Cookies we use", "Analytics and marketing", "How to change your choice", "Contact"),
  },
  {
    slug: "personal-data",
    title: "Personal Data Processing Agreement",
    sections: placeholders("Parties", "Data we process", "Purpose of processing", "Storage and security", "Your rights", "Contact"),
  },
];

export const LEGAL_UPDATED = "[DATE]";
export const LEGAL_OWNER = COMPANY.legalName;

export const legalHref = (slug: string) => `/legal/${slug}`;

export const sectionId = (index: number, title: string) =>
  `${index + 1}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
