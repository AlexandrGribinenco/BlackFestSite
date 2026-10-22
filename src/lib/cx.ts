// Joins class names, skipping empty values: cx("btn", isWide && "btn-block")
export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
