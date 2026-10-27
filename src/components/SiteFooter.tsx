import Link from "next/link";
import { COMPANY } from "@/lib/company";
import { footerFestivalNav, footerLegalNav } from "@/lib/navigation";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";
import { Socials } from "./Socials";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// maib requires its own logo and the card scheme logos in the footer: the official files from the maib docs
// (logo.zip), shown on white so their colors stay as given. Sizes are the display sizes, the files are 2x or more.
const PAYMENT_LOGOS = [
  { name: "maib", file: "maib.png", width: 57, height: 16 },
  { name: "Visa", file: "visa.png", width: 37, height: 12 },
  { name: "Mastercard", file: "mastercard.png", width: 32, height: 20 },
  { name: "American Express", file: "amex.png", width: 24, height: 24 },
];
// No official files for these in the maib archive, so they stay as text, in full names as the client asked
const PAYMENT_WALLETS = ["Apple Pay", "Google Pay"];

// Figma: Components / Footer · desktop 1:633, Footer · mobile 1:838
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="newsletter">
          <div className="newsletter__intro">
            <h2 className="newsletter__title">Stay in the loop</h2>
            <p className="newsletter__text">Ticket releases, line-up and news. No spam.</p>
          </div>
          <NewsletterForm />
        </div>

        <div className="footer-cols">
          <div className="footer-brand">
            <Logo />
            <p>Music, art &amp; culture festival by View Bar.</p>
            {/* Legal details are required on the site by maib */}
            <p>
              Organizer: {COMPANY.legalName}
              <br />
              IDNO {COMPANY.idno}
              <br />
              {COMPANY.legalAddress}
            </p>
          </div>

          <nav className="footer-col footer-col--festival" aria-labelledby="footer-festival">
            <h3 id="footer-festival">Festival</h3>
            <ul>
              {footerFestivalNav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer-col footer-col--legal" aria-labelledby="footer-legal">
            <h3 id="footer-legal">Legal</h3>
            <ul>
              {footerLegalNav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-col footer-col--social">
            <h3>Follow us</h3>
            <Socials />
            <p>
              info@[domain]
              <br />
              +373 [PHONE]
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="payments">
            <span>Secure payment:</span>
            {PAYMENT_LOGOS.map((logo) => (
              <span key={logo.name} className="payments__card payments__card--logo">
                <img src={`${BASE_PATH}/images/payments/${logo.file}`} alt={logo.name} width={logo.width} height={logo.height} loading="lazy" decoding="async" />
              </span>
            ))}
            {PAYMENT_WALLETS.map((wallet) => (
              <span key={wallet} className="payments__card">
                {wallet}
              </span>
            ))}
          </div>
          <p className="footer-bottom__copy">© 2027 Black Out Fest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
