"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { cartCount, useCart } from "@/lib/cart";
import { EVENT } from "@/lib/event";
import { mainNav } from "@/lib/navigation";
import { Logo } from "./Logo";
import { Socials } from "./Socials";

// Figma: Components / Header · desktop 1:481, Header · mobile 1:813, Mobile / M2 · Menu open 2:8622
export function SiteHeader() {
  const pathname = usePathname();
  const cartItems = cartCount(useCart());
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  function closeMenu() {
    setMenuOpen(false);
    toggleRef.current?.focus();
  }

  function handleMenuClick(e: MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest("a")) closeMenu();
  }

  useEffect(() => {
    if (!menuOpen) return;

    document.body.classList.add("is-locked");
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.classList.remove("is-locked");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      <header className="site-header">
        <div className="container site-header__inner">
          <Logo />

          <nav className="main-nav" aria-label="Main">
            {mainNav.map((link) => (
              <Link key={link.href} href={link.href} aria-current={isCurrent(pathname, link.href) ? "page" : undefined}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="site-header__actions">
            <Link className="cart-link" href="/cart" aria-label={cartItems > 0 ? `Cart, ${cartItems} ${cartItems === 1 ? "item" : "items"}` : "Cart"}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 7h12l-1 13H7L6 7z" />
                <path d="M9 7a3 3 0 0 1 6 0" />
              </svg>
              {cartItems > 0 && <span className="cart-link__badge">{cartItems}</span>}
            </Link>
            <Link className="btn btn-primary" href="/tickets">
              <span className="only-desktop">Buy tickets</span>
              <span className="only-mobile">Tickets</span>
            </Link>
            <button
              ref={toggleRef}
              className="menu-toggle"
              type="button"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="mobile-menu" id="mobile-menu" hidden={!menuOpen} onClick={handleMenuClick}>
        <div className="mobile-menu__head">
          <Logo />
          <button ref={closeRef} className="menu-close" type="button" aria-label="Close menu" onClick={closeMenu}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <nav className="mobile-menu__nav" aria-label="Mobile">
          {mainNav.map((link) => (
            <Link key={link.href} href={link.href} aria-current={isCurrent(pathname, link.href) ? "page" : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="mobile-menu__meta">
          {EVENT.date} · {EVENT.venue}
        </p>
        <Link className="btn btn-primary btn-block" href="/tickets">
          Buy tickets
        </Link>
        <Socials />
      </div>
    </>
  );
}

/** A section's own pages count too, e.g. a product page under Shop */
function isCurrent(pathname: string, href: string): boolean {
  return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
}
