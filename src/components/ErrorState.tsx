"use client";

import Link from "next/link";
import { useEffect } from "react";
import { StatePanel } from "./StatePanel";

type ErrorStateProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

// Shared body of the error.tsx boundaries; styled like the D8 404 page
export function ErrorState({ error, reset }: ErrorStateProps) {
  useEffect(() => {
    // TODO: report to an error tracker
    console.error(error);
  }, [error]);

  return (
    <main className="container state-page">
      <StatePanel
        code="Oops"
        title="Something went wrong"
        text="Please try again. If it keeps happening, let us know via the contacts page."
        actions={
          <>
            <button className="btn btn-primary" type="button" onClick={reset}>
              Try again
            </button>
            <Link className="btn btn-outline" href="/">
              Go home
            </Link>
          </>
        }
      />
    </main>
  );
}
