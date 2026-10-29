// GET /api/health — service check for the hosting, where there is no SSH: are the settings in place, and does this
// server reach maib and the mail server. Shows no secrets, only whether each setting is filled in. No payment is
// created and no e-mail is sent. The answer is kept for a minute, so reloading the page doesn't hammer maib or the mail.
import { verifySmtp } from "@/server/email";
import { pingMaib } from "@/server/maib";

export const dynamic = "force-dynamic";

const SETTINGS = [
  "SITE_URL",
  "MAIB_API_URL",
  "MAIB_CLIENT_ID",
  "MAIB_CLIENT_SECRET",
  "MAIB_SIGNATURE_KEY",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "EMAIL_FROM",
  "ADMIN_TOKEN",
];

type Check = { ok: boolean; ms: number; detail: string };

async function check(run: () => Promise<string>): Promise<Check> {
  const start = Date.now();
  try {
    const detail = await run();
    return { ok: true, ms: Date.now() - start, detail };
  } catch (error) {
    return { ok: false, ms: Date.now() - start, detail: error instanceof Error ? error.message : String(error) };
  }
}

let cached: { at: number; body: unknown } | null = null;
const KEEP_MS = 60_000;

export async function GET() {
  if (!cached || Date.now() - cached.at > KEEP_MS) {
    const [maib, smtp, outgoingIp] = await Promise.all([
      // Any HTTP status means the connection works; credentials are checked in the payment test
      check(async () => `${process.env.MAIB_API_URL ?? "https://api.maibmerchants.md"} answered HTTP ${await pingMaib()}`),
      check(async () => {
        await verifySmtp();
        return `${process.env.SMTP_HOST}: connected and logged in`;
      }),
      // The address maib sees our requests coming from; the Merchant Portal asks for the server IP
      check(async () => {
        const response = await fetch("https://api.ipify.org", { cache: "no-store", signal: AbortSignal.timeout(10_000) });
        return (await response.text()).trim();
      }),
    ]);

    cached = {
      at: Date.now(),
      body: {
        checkedAt: new Date().toISOString(),
        node: process.version,
        // Set at build time by the "payments" checkbox of the Build for hosting workflow
        paymentsInBuild: process.env.NEXT_PUBLIC_PAYMENTS_API_URL !== undefined,
        settings: Object.fromEntries(SETTINGS.map((name) => [name, Boolean(process.env[name])])),
        maib,
        smtp,
        outgoingIp,
      },
    };
  }

  return Response.json(cached.body, { headers: { "Cache-Control": "no-store" } });
}
