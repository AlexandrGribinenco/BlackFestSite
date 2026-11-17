// Apple Pay and Google Pay acceptance marks in public/images/payments: the official files from Apple (Apple Pay Marketing
// Guidelines, Apple-Pay-Mark.zip) and Google (Google Pay Brand Guidelines, Google-Pay-Acceptance.zip; the viewBox is
// cropped to the mark, the clear space comes from the layout). The client asked for the logos instead of the names (17.11.2026).
export type WalletMark = { name: string; file: string; width: number; height: number };

/** Sizes for a 28 px high mark; scale both for other heights */
export const APPLE_PAY_MARK: WalletMark = { name: "Apple Pay", file: "apple-pay.svg", width: 44, height: 28 };
export const GOOGLE_PAY_MARK: WalletMark = { name: "Google Pay", file: "google-pay.svg", width: 53, height: 28 };

export const WALLET_MARKS = [APPLE_PAY_MARK, GOOGLE_PAY_MARK];

export const walletMarkSrc = (mark: WalletMark) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/payments/${mark.file}`;
