import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CookieSettingsButton } from "@/components/CookieConsent";
import { LegalDocNav } from "@/components/LegalDocNav";
import { Skeleton } from "@/components/Skeleton";
import { COMPANY } from "@/lib/company";
import { LEGAL_DOCS, LEGAL_OWNER, LEGAL_UPDATED, sectionId } from "@/lib/legal";
import { pageMetadata } from "@/lib/site";
import "./legal.css";

// Figma: Desktop / D7 · Legal page (template) 347:1878, Mobile / M8 · Legal + cookie banner 3:11516

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return LEGAL_DOCS.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = LEGAL_DOCS.find((d) => d.slug === slug);
  if (!doc) return {};
  return pageMetadata({
    title: `${doc.title} — Black Out Fest 2027`,
    description: `${doc.title} of Black Out Fest 2027, run by ${COMPANY.legalName}.`,
    path: `/legal/${doc.slug}`,
  });
}

export default async function LegalPage({ params }: Props) {
  const { slug } = await params;
  const doc = LEGAL_DOCS.find((d) => d.slug === slug);
  if (!doc) notFound();

  return (
    <main className="container legal">
      <LegalDocNav current={doc.slug} />

      <article className="legal__article">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Legal" }, { label: doc.title }]} />
        <h1 className="legal__title">{doc.title}</h1>
        <p className="legal__meta">
          Last updated: {LEGAL_UPDATED}
          <span className="only-desktop"> · {LEGAL_OWNER}</span>
        </p>

        <nav className="legal-contents" aria-labelledby="legal-contents-title">
          <p className="legal-contents__title" id="legal-contents-title">
            Contents
          </p>
          <ol>
            {doc.sections.map(({ title }, i) => (
              <li key={title}>
                <a href={`#${sectionId(i, title)}`}>
                  {i + 1}. {title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {doc.sections.map(({ title, body }, i) => (
          <section key={title} className="legal-section" id={sectionId(i, title)}>
            <h2 className="legal-section__title">
              {i + 1}. {title}
            </h2>
            {body ? (
              body.map((paragraph) => (
                <p key={paragraph} className="legal-section__text">
                  {paragraph}
                </p>
              ))
            ) : (
              // TODO: legal text
              <Skeleton size="sm" widths={[undefined, undefined, undefined, "60%"]} />
            )}
          </section>
        ))}

        {doc.slug === "cookies" && <CookieSettingsButton />}
      </article>
    </main>
  );
}
