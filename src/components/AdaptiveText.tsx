type AdaptiveTextProps = {
  full: string;
  /** Shorter wording used on mobile in the wireframes */
  short?: string;
};

export function AdaptiveText({ full, short }: AdaptiveTextProps) {
  if (!short) return full;

  return (
    <>
      <span className="only-desktop">{full}</span>
      <span className="only-mobile">{short}</span>
    </>
  );
}
