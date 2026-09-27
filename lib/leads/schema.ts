import {
  contactFieldLimits,
  contactServices,
  type ContactService,
} from "@/lib/contact";
import type { LeadInput } from "@/lib/leads/types";

export type LeadValidationErrorCode =
  | "INVALID_BODY"
  | "INVALID_NAME"
  | "INVALID_COMPANY"
  | "INVALID_EMAIL"
  | "INVALID_PHONE"
  | "INVALID_SERVICE"
  | "INVALID_MESSAGE"
  | "CONSENT_REQUIRED";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const serviceValues = new Set<string>(
  contactServices.map((service) => service.value),
);

const validationMessages: Record<LeadValidationErrorCode, string> = {
  INVALID_BODY: "Dados de contato inválidos.",
  INVALID_NAME: "Revise os campos obrigatórios e tente novamente.",
  INVALID_COMPANY: "Dados de contato inválidos.",
  INVALID_EMAIL: "Informe um e-mail válido.",
  INVALID_PHONE: "Dados de contato inválidos.",
  INVALID_SERVICE: "O serviço selecionado é inválido.",
  INVALID_MESSAGE: "Revise a mensagem e tente novamente.",
  CONSENT_REQUIRED: "Confirme que você leu a Política de Privacidade.",
};

export class LeadValidationError extends Error {
  readonly code: LeadValidationErrorCode;

  constructor(code: LeadValidationErrorCode) {
    super(validationMessages[code]);
    this.name = "LeadValidationError";
    this.code = code;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeSingleLine(value: string): string {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeMessage(value: string): string {
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}

function requiredSingleLine(
  value: unknown,
  field: "name" | "email" | "service",
  code: "INVALID_NAME" | "INVALID_EMAIL" | "INVALID_SERVICE",
): string {
  if (typeof value !== "string") {
    throw new LeadValidationError(code);
  }

  const sanitized = sanitizeSingleLine(value);
  if (!sanitized || sanitized.length > contactFieldLimits[field]) {
    throw new LeadValidationError(code);
  }

  return sanitized;
}

function optionalSingleLine(
  value: unknown,
  field: "company" | "phone",
  code: "INVALID_COMPANY" | "INVALID_PHONE",
): string | undefined {
  if (value === undefined || value === "") return undefined;
  if (typeof value !== "string") {
    throw new LeadValidationError(code);
  }

  const sanitized = sanitizeSingleLine(value);
  if (sanitized.length > contactFieldLimits[field]) {
    throw new LeadValidationError(code);
  }

  return sanitized || undefined;
}

function parseMessage(value: unknown): string {
  if (typeof value !== "string") {
    throw new LeadValidationError("INVALID_MESSAGE");
  }

  const message = sanitizeMessage(value);
  if (
    message.length < 10 ||
    message.length > contactFieldLimits.message
  ) {
    throw new LeadValidationError("INVALID_MESSAGE");
  }

  return message;
}

export function parseLeadInput(value: unknown): LeadInput {
  if (!isRecord(value)) {
    throw new LeadValidationError("INVALID_BODY");
  }

  const name = requiredSingleLine(value.name, "name", "INVALID_NAME");
  const company = optionalSingleLine(
    value.company,
    "company",
    "INVALID_COMPANY",
  );
  const email = requiredSingleLine(
    value.email,
    "email",
    "INVALID_EMAIL",
  ).toLowerCase();
  const phone = optionalSingleLine(value.phone, "phone", "INVALID_PHONE");
  const service = requiredSingleLine(
    value.service,
    "service",
    "INVALID_SERVICE",
  );
  const message = parseMessage(value.message);

  if (!emailPattern.test(email)) {
    throw new LeadValidationError("INVALID_EMAIL");
  }

  if (!serviceValues.has(service)) {
    throw new LeadValidationError("INVALID_SERVICE");
  }

  if (value.consent !== true) {
    throw new LeadValidationError("CONSENT_REQUIRED");
  }

  return {
    name,
    company,
    email,
    phone,
    service: service as ContactService,
    message,
    consent: true,
  };
}
