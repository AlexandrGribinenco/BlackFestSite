import Link from "next/link";

// The festival name in text: the client has no logo yet and asked not to use one for now (04.11.2026)
export function Logo() {
  return (
    <Link className="logo" href="/" aria-label="Black Out Fest — home">
      Black Out Fest
    </Link>
  );
}
