import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ComingSoonImage } from "@/components/ComingSoonImage";
import { ContactForm } from "@/components/ContactForm";
import { Socials } from "@/components/Socials";
import { COMPANY } from "@/lib/company";
import { EVENT } from "@/lib/event";
import { pageMetadata } from "@/lib/site";
import "./contacts.css";

// Figma: Desktop / D6 · Contacts 347:2154, Mobile / M7 · Contacts 3:11262

export const metadata: Metadata = pageMetadata({
  title: "Contacts — Black Out Fest 2027",
  description: "Contact the Black Out Fest team by e-mail or phone: tickets and orders, partners and advertising.",
  path: "/contacts",
});

// The client gave one e-mail and one phone for everything (30.10.2026), instead of the wireframe's separate
// mailboxes; the address is the organizer's legal address above.
const contacts = [
  { label: "E-mail", value: COMPANY.email, href: `mailto:${COMPANY.email}` },
  { label: "Phone", value: COMPANY.phone, href: COMPANY.phoneHref },
];

export default function ContactsPage() {
  return (
    <main>
      <div className="container page-head">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contacts" }]} />
        <h1 className="page-head__title">Contacts</h1>
      </div>

      <div className="container contacts">
        <div className="contacts__list">
          <dl>
            <div className="contact-item">
              <dt>Organizer</dt>
              <dd>
                <strong>{COMPANY.legalName}</strong>
                <span className="contact-item__note">
                  IDNO {COMPANY.idno} · {COMPANY.brand}
                </span>
                <span className="contact-item__note">Legal address: {COMPANY.legalAddress}</span>
              </dd>
            </div>
            {contacts.map((item) => (
              <div key={item.label} className="contact-item">
                <dt>{item.label}</dt>
                <dd>
                  <a href={item.href}>{item.value}</a>
                </dd>
              </div>
            ))}
          </dl>
          <Socials />
        </div>

        <ContactForm />
      </div>

      <div className="container contacts__map-wrap">
        <div className="placeholder contacts__map">
          <ComingSoonImage alt={`Map — ${EVENT.venue}, coming soon`} />
        </div>
      </div>
    </main>
  );
}
