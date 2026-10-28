/** Structured data for search engines (lib/structured-data.ts); renders nothing without data */
export function JsonLd({ data }: { data: Record<string, unknown> | null }) {
  if (!data) return null;
  // "<" is escaped so a value can't close the script tag
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
