import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ComingSoonImage } from "@/components/ComingSoonImage";
import { ContactForm } from "@/components/ContactForm";
import { Socials } from "@/components/Socials";
import { COMPANY } from "@/lib/company";
import { EVENT } from "@/lib/event";
import "./contacts.css";

// Figma: Desktop / D6 · Contacts 347:2154, Mobile / M7 · Contacts 3:11262

export const metadata: Metadata = {
  title: "Contacts — Black Out Fest 2027",
  description: "Contact the Black Out Fest team: general questions, tickets and orders, partners and advertising.",
};

// TODO: real addresses and phone
const contacts = [
  { label: "General questions", short: "General", value: "info@[domain]", href: "mailto:info@[domain]" },
  { label: "Tickets & orders", short: "Tickets", value: "tickets@[domain]", href: "mailto:tickets@[domain]" },
  { label: "Partners & advertising", short: "Partners", value: "partners@[domain]", href: "mailto:partners@[domain]" },
  { label: "Phone", value: "+373 [PHONE]", href: "tel:+373" },
  { label: "Address", value: "[ADDRESS], Moldova" },
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
                <dt>
                  {item.short ? (
                    <>
                      <span className="only-desktop">{item.label}</span>
                      <span className="only-mobile">{item.short}</span>
                    </>
                  ) : (
                    item.label
                  )}
                </dt>
                <dd>{item.href ? <a href={item.href}>{item.value}</a> : <strong>{item.value}</strong>}</dd>
              </div>
            ))}
          </dl>
          <Socials />
        </div>

        <ContactForm />
      </div>

      <div className="container contacts__map-wrap">
        <div className="placeholder contacts__map">
          <ComingSoonImage alt={`Map — ${EVENT.venueName} location, coming soon`} />
        </div>
      </div>
    </main>
  );
}
