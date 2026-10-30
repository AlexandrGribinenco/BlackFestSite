// Legal documents rendered by the D7 template (app/(site)/legal/[slug]).
// Terms & Conditions: draft built from the maib e-commerce template (the sections maib requires for card
// payments), adapted to festival tickets and merchandise. Values in [brackets] are still to be decided.
// Privacy, Cookie Policy and the Personal Data Processing Agreement follow Law No. 195/2024 on Personal Data
// Protection (in force since 23.08.2026, it replaced Law No. 133/2011) and describe what the site really collects:
// the checkout forms, the data sent to maib (lib/payments, server/maib) and the browser storage (cart, cookie choice).
// TODO: the organizer (or a lawyer) checks the documents; when analytics or marketing scripts are added
// (CookieConsent), the Cookie Policy must list exactly those services.
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

const contactLines = [
  `Legal name: ${COMPANY.legalName}`,
  `IDNO: ${COMPANY.idno}`,
  `Legal address: ${COMPANY.legalAddress}`,
  `Phone: ${COMPANY.phone}`,
  `E-mail: ${COMPANY.email}`,
];

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
      "Personal data is processed only for legitimate purposes: delivering tickets and products, and — with your consent — newsletters, promotions and analytics (see the Cookie Policy). It is stored only for as long as these purposes require, in accordance with Law No. 195/2024 on Personal Data Protection.",
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
      "In accordance with Law No. 195/2024 on Personal Data Protection, the Seller processes personal data in good faith, lawfully, by automated and manual means, under conditions that ensure security and confidentiality.",
      "We collect only the data you give us when ordering: first and last name, phone number, e-mail and, for merchandise, the delivery address. It is used to run the website, deliver orders and contact you about your order.",
      "We do not disclose, sell or exchange your data with third parties without your consent, except where the law requires it (requests from public authorities, law enforcement or courts). We do not collect payment card data: card number, expiry date and similar details are handled by the payment processor.",
      `For questions about your data, write to ${COMPANY.email} or call ${COMPANY.phone}. See also the Privacy Policy and the Personal Data Processing Agreement.`,
    ],
  },
  { title: "Contact details", body: contactLines },
];

const privacy: LegalSection[] = [
  {
    title: "Who we are",
    body: [
      `The Black Out Fest website is run by ${COMPANY.legalName} (IDNO ${COMPANY.idno}, ${COMPANY.legalAddress}), the controller of your personal data ("we"). This policy explains what data we collect, why, who receives it, how long we keep it and what your rights are under Law No. 195/2024 on Personal Data Protection.`,
    ],
  },
  {
    title: "What data we collect",
    body: [
      "Tickets: your first and last name, e-mail and phone number, the tickets and seats you choose, the order number and the payment status.",
      "Merchandise: the same contact details and, for delivery, your address, city and postal code.",
      "Payment: you enter your card details only on the secure maib payment page; we never see or store them. From maib we receive the payment result, the masked card number (for example 4111 11** **** 1111) and the transaction details. When you start a payment, we send maib your name, e-mail, phone number, IP address and browser type, which maib uses to process the payment and prevent fraud.",
      "Newsletter and the contact form: your e-mail and, for messages, your name, the topic and your message.",
      "Technical data: the server of the website records IP addresses, browser types and the pages requested, to keep the website secure. Your browser keeps your cart and your cookie choice (see the Cookie Policy).",
    ],
  },
  {
    title: "Why we use it",
    body: [
      "To process your order, send the e-tickets and the payment confirmation, deliver the products and check the tickets at the entrance — this is needed to perform the contract with you.",
      "To take the payment and prevent fraud — to perform the contract and in our legitimate interest.",
      "To keep the accounting records and handle returns, refunds and claims — because the law requires it.",
      "To answer your messages — at your request.",
      "To send the newsletter and to use analytics and marketing cookies — only with your consent, which you can withdraw at any time.",
      "We do not make decisions about you by automated means only and do not build profiles that have legal effects for you.",
    ],
  },
  {
    title: "Who receives it",
    body: [
      "maib (BC “MAIB” S.A.) — to process card payments and refunds.",
      "The hosting and e-mail providers of the website — to store the website data and send e-mails.",
      "The courier — your name, phone number and address, only for merchandise delivery.",
      "Google and the social networks — only if you allow analytics or marketing cookies (see the Cookie Policy).",
      "Public authorities, law enforcement or courts — only where the law requires it.",
      "We do not sell your data. Some of these providers may process data outside the Republic of Moldova (for example, a courier delivering abroad or Google). We use only providers that protect the data under safeguards recognised by Law No. 195/2024, such as standard contractual clauses.",
    ],
  },
  {
    title: "How long we keep it",
    body: [
      "Order and payment data: for the period required by the accounting and tax laws.",
      "Ticket data: until the end of the festival and the period for returns, refunds and claims.",
      "Messages from the contact form: as long as needed to answer, and no longer than 12 months.",
      "Newsletter: until you unsubscribe.",
      "When the period ends, the data is deleted or anonymised.",
    ],
  },
  {
    title: "Your rights",
    body: [
      "You have the right to be informed, to access your data, to have it corrected or deleted, to restrict its processing, to object to it (including to direct marketing at any time), to receive your data in a portable format and to withdraw your consent at any time. Withdrawing consent does not affect the processing done before.",
      "To use these rights, write to us (see Contact). We answer free of charge within one month; in complex cases this can be extended by two more months, and we will tell you within the first month.",
      "If you think we process your data unlawfully, you can complain to the National Center for Personal Data Protection of the Republic of Moldova (datepersonale.md) or go to court.",
      "We do not knowingly collect data of children under 14 without the consent of their parent or legal guardian.",
    ],
  },
  {
    title: "Contact",
    body: [
      "For any question about your personal data, contact us:",
      ...contactLines,
      "We may update this policy; the date of the last update is shown at the top of the page.",
    ],
  },
];

const cookies: LegalSection[] = [
  {
    title: "What cookies are",
    body: [
      "Cookies are small text files that a website saves in your browser. Similar technologies, such as the browser’s local storage, keep information on your device in the same way. In this policy, “cookies” means all of them.",
      "Under Law No. 284/2004 on Electronic Commerce, we use cookies that are not essential for the website only with your consent.",
    ],
  },
  {
    title: "Cookies we use",
    body: [
      "Essential — always on, because the website cannot work without them. Your cart (bof-cart) keeps the products you chose until you order them or remove them. Your cookie choice (bof-cookie-consent) remembers what you allowed, so we do not ask you again on every page.",
      "This information stays in your browser until you change your choice, empty the cart or clear the browser data. It is not used to identify you.",
      "The secure maib payment page uses its own cookies to process the payment and prevent fraud. They are governed by maib’s policies.",
    ],
  },
  {
    title: "Analytics and marketing",
    body: [
      "Analytics — only if you allow them. Google Analytics shows us how visitors use the website (pages visited, time on the website, the type of device), so we can improve it.",
      "Marketing — only if you allow them. Google Ads and the social networks measure which ads bring visitors and buyers and show you festival ads on other websites.",
      "These services are run by Google and the social networks, which may process the data outside the Republic of Moldova under their own privacy policies. If you do not allow these cookies, the website works just the same.",
    ],
  },
  {
    title: "How to change your choice",
    body: [
      "You can change your choice at any time with the Cookie settings button below — withdrawing consent is as easy as giving it.",
      "You can also delete cookies or block them in your browser settings. If you block the essential ones, the cart may stop working.",
    ],
  },
  {
    title: "Contact",
    body: ["For questions about cookies, contact us:", ...contactLines],
  },
];

const personalData: LegalSection[] = [
  {
    title: "Parties",
    body: [
      `This Agreement is between ${COMPANY.legalName} (IDNO ${COMPANY.idno}, ${COMPANY.legalAddress}), the controller of personal data ("we"), and you, the person who orders on the Black Out Fest website or writes to us ("you").`,
      "By ticking the box in the order or contact form, you confirm that you have read this Agreement and the Privacy Policy and agree that your data is processed as described below.",
    ],
  },
  {
    title: "Data we process",
    body: [
      "Your first and last name, e-mail and phone number; for merchandise delivery, your address, city and postal code; the tickets, seats and products you order; the order number, the payment status and the masked card number from maib; the IP address and browser type sent to maib with the payment; your messages from the contact form.",
      "We do not process your card details: you enter them only on the secure maib payment page.",
    ],
  },
  {
    title: "Purpose of processing",
    body: [
      "We process your data to take and confirm your order, take the payment through maib, send the e-tickets and the confirmation e-mail, deliver the products, check the tickets at the entrance, handle returns, refunds and claims, answer your messages and keep the records the law requires.",
      "This processing is needed to perform the contract with you: without these details we cannot complete the order.",
      "The newsletter and analytics or marketing cookies are separate: we use them only if you choose them with their own box or in the cookie settings. You can order without them.",
    ],
  },
  {
    title: "Storage and security",
    body: [
      "Your data is kept for the periods listed in the Privacy Policy and then deleted or anonymised.",
      "The website works only over a secure HTTPS connection, payments go through maib with 3-D Secure, and only the people who handle orders have access to your data.",
      "We pass your data only to the recipients listed in the Privacy Policy (maib, the hosting and e-mail providers, the courier) and only as far as each of them needs it. If a security incident puts your data at risk, we will notify the National Center for Personal Data Protection and, where the risk is high, you.",
    ],
  },
  {
    title: "Your rights",
    body: [
      "You can ask to see, correct or delete your data, restrict or object to its processing, receive it in a portable format, and withdraw any consent at any time. We answer free of charge within one month.",
      "You can complain to the National Center for Personal Data Protection of the Republic of Moldova (datepersonale.md) or go to court.",
    ],
  },
  {
    title: "Contact",
    body: ["To use your rights or ask about your data, contact us:", ...contactLines],
  },
];

export const LEGAL_DOCS: LegalDoc[] = [
  { slug: "terms", title: "Terms & Conditions", sections: terms },
  { slug: "privacy", title: "Privacy Policy", sections: privacy },
  { slug: "cookies", title: "Cookie Policy", sections: cookies },
  { slug: "personal-data", title: "Personal Data Processing Agreement", sections: personalData },
];

export const LEGAL_UPDATED = "30 October 2026";
export const LEGAL_OWNER = COMPANY.legalName;

export const legalHref = (slug: string) => `/legal/${slug}`;

export const sectionId = (index: number, title: string) =>
  `${index + 1}-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
