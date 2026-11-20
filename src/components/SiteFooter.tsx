import Link from "next/link";
import { COMPANY } from "@/lib/company";
import { footerFestivalNav, footerLegalNav } from "@/lib/navigation";
import { WALLETS_ON, WALLET_MARKS, walletMarkSrc } from "@/lib/wallets";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";
import { Socials } from "./Socials";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// maib requires its own logo and the card scheme logos in the footer: the official files from the maib docs
// (logo.zip), shown on white so their colors stay as given. Sizes are the display sizes: larger since the client asked
// (19.11.2026); the files are 1.4x or more of them (Visa is the smallest file, 80 × 26).
const PAYMENT_LOGOS = [
  { name: "maib", file: "maib.png", width: 78, height: 22 },
  { name: "Visa", file: "visa.png", width: 56, height: 18 },
  { name: "Mastercard", file: "mastercard.png", width: 48, height: 30 },
  { name: "American Express", file: "amex.png", width: 34, height: 34 },
];
// Apple Pay and Google Pay have their own frame, so they go without the white chip (17.11.2026)
const WALLET_SCALE = 40 / 28;

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
              <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
              <br />
              <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          {/* Large logos only: no caption (the client liked neither "Secure payment" nor "We accept", 19.11.2026)
              and no card picture or background behind them (20.11.2026) */}
          <ul className="payments" aria-label="Payment methods">
            {PAYMENT_LOGOS.map((logo) => (
              <li key={logo.name} className="payments__logo">
                <img src={`${BASE_PATH}/images/payments/${logo.file}`} alt={logo.name} width={logo.width} height={logo.height} loading="lazy" decoding="async" />
              </li>
            ))}
            {WALLETS_ON &&
              WALLET_MARKS.map((mark) => (
                <li key={mark.name} className="payments__wallet">
                  <img
                    src={walletMarkSrc(mark)}
                    alt={mark.name}
                    width={Math.round(mark.width * WALLET_SCALE)}
                    height={Math.round(mark.height * WALLET_SCALE)}
                    loading="lazy"
                    decoding="async"
                  />
                </li>
              ))}
          </ul>
          <p className="footer-bottom__copy">© {new Date().getFullYear()} {COMPANY.siteName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
