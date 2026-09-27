import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import {
  LeadValidationError,
  parseLeadInput,
} from "@/lib/leads/schema";
import { LeadService, LeadServiceError } from "@/lib/leads/service";
import {
  contactDelivery,
  ContactDeliveryNotConfiguredError,
  type ContactSubmission,
} from "./contact-delivery";

export const runtime = "nodejs";

const leadService = new LeadService();

const MAX_REQUEST_BODY_SIZE = 16_000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;
const MAX_TRACKED_CLIENTS = 10_000;
const DUPLICATE_WINDOW_MS = 60_000;

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const deliveredSubmissions = new Map<string, number>();
const inFlightSubmissions = new Set<string>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getClientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const forwardedAddress = forwardedFor?.split(",")[0]?.trim();

  return forwardedAddress || request.headers.get("x-real-ip") || "unknown";
}

function takeRateLimitToken(clientIdentifier: string): number | null {
  const now = Date.now();

  for (const [key, entry] of rateLimitStore) {
    if (entry.resetAt <= now) rateLimitStore.delete(key);
  }

  const current = rateLimitStore.get(clientIdentifier);
  if (!current) {
    if (rateLimitStore.size >= MAX_TRACKED_CLIENTS) {
      const oldestClient = rateLimitStore.keys().next().value;
      if (oldestClient) rateLimitStore.delete(oldestClient);
    }

    rateLimitStore.set(clientIdentifier, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return null;
  }

  if (current.count >= MAX_REQUESTS_PER_WINDOW) {
    return Math.ceil((current.resetAt - now) / 1_000);
  }

  current.count += 1;
  return null;
}

function createSubmissionFingerprint(
  clientIdentifier: string,
  submission: ContactSubmission,
) {
  return createHash("sha256")
    .update(clientIdentifier)
    .update(JSON.stringify(submission))
    .digest("hex");
}

function isDuplicateSubmission(fingerprint: string) {
  const now = Date.now();

  for (const [key, deliveredAt] of deliveredSubmissions) {
    if (now - deliveredAt >= DUPLICATE_WINDOW_MS) {
      deliveredSubmissions.delete(key);
    }
  }

  return (
    inFlightSubmissions.has(fingerprint) ||
    deliveredSubmissions.has(fingerprint)
  );
}

export async function POST(request: Request) {
  const clientIdentifier = getClientIdentifier(request);
  const retryAfter = takeRateLimitToken(clientIdentifier);
  if (retryAfter !== null) {
    return NextResponse.json(
      { error: "Muitas tentativas. Aguarde alguns instantes e tente novamente." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Formato de solicitação inválido." }, { status: 415 });
  }

  let body: unknown;
  try {
    const rawBody = await request.text();
    if (rawBody.length > MAX_REQUEST_BODY_SIZE) {
      return NextResponse.json({ error: "A mensagem excede o tamanho permitido." }, { status: 413 });
    }
    body = JSON.parse(rawBody) as unknown;
  } catch {
    return NextResponse.json({ error: "Envie dados JSON válidos." }, { status: 400 });
  }

  if (isRecord(body) && typeof body.website === "string" && body.website.trim()) {
    // Honeypots devem parecer uma resposta bem-sucedida para não orientar bots.
    return NextResponse.json({ success: true });
  }

  try {
    const leadInput = parseLeadInput(body);
    const fingerprint = createSubmissionFingerprint(clientIdentifier, leadInput);

    if (isDuplicateSubmission(fingerprint)) {
      return NextResponse.json(
        { error: "Esta mensagem já foi recebida. Evite enviá-la novamente." },
        { status: 409 },
      );
    }

    inFlightSubmissions.add(fingerprint);

    try {
      const { id } = await leadService.create(leadInput);
      deliveredSubmissions.set(fingerprint, Date.now());

      try {
        await contactDelivery.deliver(leadInput);
      } catch (error) {
        if (!(error instanceof ContactDeliveryNotConfiguredError)) {
          console.error(
            "Falha ao enviar notificação de contato pelo webhook.",
            error instanceof Error ? error.name : "UnknownError",
          );
        }
      }

      return NextResponse.json({ success: true, id });
    } finally {
      inFlightSubmissions.delete(fingerprint);
    }
  } catch (error) {
    if (error instanceof LeadValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof LeadServiceError) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "Não foi possível enviar sua mensagem. Tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
