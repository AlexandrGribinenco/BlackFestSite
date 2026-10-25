"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";

// Figma: D8 "Cookie banner" and "Cookie preferences", M8 cookie banner

const STORAGE_KEY = "bof-cookie-consent";
const OPEN_EVENT = "bof:open-cookie-preferences";

type Choice = { analytics: boolean; marketing: boolean };

const NONE: Choice = { analytics: false, marketing: false };
const ALL: Choice = { analytics: true, marketing: true };

function readChoice(): Choice | null {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    return saved ? { analytics: Boolean(saved.analytics), marketing: Boolean(saved.marketing) } : null;
  } catch {
    return null;
  }
}

function writeChoice(choice: Choice) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ essential: true, ...choice, savedAt: new Date().toISOString() }));
  } catch {
    // Storage blocked: the banner will simply show again next time
  }
}

export function CookieConsent() {
  const [bannerOpen, setBannerOpen] = useState(false);
  const [choice, setChoice] = useState<Choice>(NONE);
  const [draft, setDraft] = useState<Choice>(NONE);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const saved = readChoice();
    if (saved) setChoice(saved);
    else setBannerOpen(true);

    const open = () => {
      setDraft(readChoice() ?? NONE);
      dialogRef.current?.showModal();
    };
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  function openPreferences() {
    setDraft(choice);
    dialogRef.current?.showModal();
  }

  function save(next: Choice) {
    writeChoice(next);
    setChoice(next);
    setBannerOpen(false);
    dialogRef.current?.close();
    // TODO: load analytics / marketing scripts only when the matching choice is on
  }

  function closeOnBackdrop(e: MouseEvent<HTMLDialogElement>) {
    if (e.target === e.currentTarget) e.currentTarget.close();
  }

  return (
    <>
      {bannerOpen && (
        <section className="cookie-banner" aria-labelledby="cookie-banner-title">
          <div className="cookie-banner__text">
            <h2 className="cookie-banner__title" id="cookie-banner-title">
              We use cookies
            </h2>
            <p>
              We use cookies to run the site, analyse traffic and personalise content. Read our{" "}
              <Link href="/legal/cookies">Cookie Policy</Link>.
            </p>
          </div>
          <div className="cookie-banner__actions">
            <button className="btn btn-outline" type="button" onClick={openPreferences}>
              Preferences
            </button>
            <button className="btn btn-outline" type="button" onClick={() => save(NONE)}>
              Reject all
            </button>
            <button className="btn btn-primary cookie-banner__accept" type="button" onClick={() => save(ALL)}>
              Accept all
            </button>
          </div>
        </section>
      )}

      <dialog ref={dialogRef} className="cookie-dialog" aria-labelledby="cookie-dialog-title" onClick={closeOnBackdrop}>
        <h2 className="cookie-dialog__title" id="cookie-dialog-title">
          Cookie preferences
        </h2>
        <ul className="cookie-options">
          <li>
            <div>
              <p className="cookie-option__name">Essential</p>
              <p className="cookie-option__text">Needed for tickets and payment. Always on.</p>
            </div>
            <Toggle label="Essential cookies" checked disabled />
          </li>
          <li>
            <div>
              <p className="cookie-option__name">Analytics</p>
              <p className="cookie-option__text">Helps us improve the site.</p>
            </div>
            <Toggle label="Analytics cookies" checked={draft.analytics} onChange={(analytics) => setDraft({ ...draft, analytics })} />
          </li>
          <li>
            <div>
              <p className="cookie-option__name">Marketing</p>
              <p className="cookie-option__text">Ads on social networks.</p>
            </div>
            <Toggle label="Marketing cookies" checked={draft.marketing} onChange={(marketing) => setDraft({ ...draft, marketing })} />
          </li>
        </ul>
        <div className="cookie-dialog__actions">
          <button className="btn btn-outline" type="button" onClick={() => save(draft)}>
            Save selection
          </button>
          <button className="btn btn-primary" type="button" onClick={() => save(ALL)}>
            Accept all
          </button>
        </div>
      </dialog>
    </>
  );
}

type ToggleProps = {
  label: string;
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
};

function Toggle({ label, checked, onChange, disabled = false }: ToggleProps) {
  return (
    <button
      className="toggle"
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
    >
      <span className="toggle__knob" />
    </button>
  );
}

/** Reopens the preferences dialog, e.g. from the Cookie Policy page */
export function CookieSettingsButton() {
  return (
    <button className="btn btn-outline" type="button" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      Cookie settings
    </button>
  );
}
