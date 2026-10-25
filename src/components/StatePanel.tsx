import type { ReactNode } from "react";

type StatePanelProps = {
  code: string;
  title: string;
  text: string;
  actions: ReactNode;
};

// Full-page message for 404 and error states (Figma: D8 "404 page")
export function StatePanel({ code, title, text, actions }: StatePanelProps) {
  return (
    <div className="state-panel">
      <p className="state-panel__code">{code}</p>
      <h1 className="state-panel__title">{title}</h1>
      <p className="state-panel__text">{text}</p>
      <div className="state-panel__actions">{actions}</div>
    </div>
  );
}
