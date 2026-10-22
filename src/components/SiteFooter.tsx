import Link from "next/link";
import { footerFestivalNav, footerLegalNav } from "@/lib/navigation";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";
import { Socials } from "./Socials";

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
            <p>
              Organizer: Î.I. CIOBANU ALEXANDRU
              <br />
              IDNO [IDNO]
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
            <span className="payments__card">VISA</span>
            <span className="payments__card">MC</span>
            <span className="payments__card">AMEX</span>
          </div>
          <p className="footer-bottom__copy">© 2027 Black Out Fest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
