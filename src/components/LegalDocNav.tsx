"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LEGAL_DOCS, legalHref } from "@/lib/legal";

// Desktop: card with the list of documents. Mobile: a "Document" select (Figma: M8).
export function LegalDocNav({ current }: { current: string }) {
  const router = useRouter();

  return (
    <>
      <nav className="legal-nav" aria-label="Legal documents">
        <ul>
          {LEGAL_DOCS.map((doc) => (
            <li key={doc.slug}>
              <Link href={legalHref(doc.slug)} aria-current={doc.slug === current ? "page" : undefined}>
                {doc.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="legal-select field">
        <label className="field-label" htmlFor="legal-document">
          Document
        </label>
        <select className="input" id="legal-document" value={current} onChange={(e) => router.push(legalHref(e.target.value))}>
          {LEGAL_DOCS.map((doc) => (
            <option key={doc.slug} value={doc.slug}>
              {doc.title}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
