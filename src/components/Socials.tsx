import { socialLinks } from "@/lib/navigation";

export function Socials() {
  return (
    <ul className="socials" aria-label="Social media">
      {socialLinks.map((link) => (
        <li key={link.short}>
          <a href={link.href} aria-label={link.label}>
            {link.short}
          </a>
        </li>
      ))}
    </ul>
  );
}
