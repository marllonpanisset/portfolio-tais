"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { contactFieldLimits, contactServices } from "@/lib/contact";

type FormStatus = "idle" | "submitting" | "success" | "error";
type FieldName =
  | "name"
  | "company"
  | "email"
  | "phone"
  | "service"
  | "message"
  | "consent";
type FieldErrors = Partial<Record<FieldName, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneErrorMessage = "Informe um telefone com DDD válido.";
const submitErrorFallback =
  "Não foi possível enviar sua mensagem. Seus dados continuam preenchidos. Tente novamente.";
const fieldClassName =
  "h-11 min-w-0 w-full rounded-[10px] border border-border bg-surface px-4 text-[0.9375rem] text-text-primary outline-none focus-visible:border-signal";

function normalizePhone(value: string): string {
  return value.replace(/\D/g, "").slice(0, 11);
}

function formatBrazilianPhone(value: string): string {
  const digits = normalizePhone(value);

  if (digits.length <= 2) {
    return digits ? `(${digits}` : "";
  }

  const areaCode = digits.slice(0, 2);
  const localNumber = digits.slice(2);
  const prefixLength = digits.length <= 10 ? 4 : 5;
  const prefix = localNumber.slice(0, prefixLength);
  const suffix = localNumber.slice(prefixLength);

  return `(${areaCode}) ${prefix}${suffix ? `-${suffix}` : ""}`;
}

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="mt-2 text-[0.9375rem] leading-[1.5] text-warning">
      {message}
    </p>
  );
}

function getApiErrorMessage(value: unknown): string {
  if (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof value.error === "string" &&
    value.error.trim()
  ) {
    return value.error;
  }

  return submitErrorFallback;
}

function validateForm(formData: FormData): FieldErrors {
  const errors: FieldErrors = {};
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = normalizePhone(String(formData.get("phone") ?? ""));
  const service = String(formData.get("service") ?? "");
  const message = String(formData.get("message") ?? "").trim();

  if (!name) errors.name = "Informe seu nome.";
  if (!email) {
    errors.email = "Informe seu e-mail.";
  } else if (!emailPattern.test(email)) {
    errors.email = "Informe um e-mail válido.";
  }
  if (phone && phone.length !== 10 && phone.length !== 11) {
    errors.phone = phoneErrorMessage;
  }
  if (!service) errors.service = "Selecione um serviço de interesse.";
  if (!message) {
    errors.message = "Escreva uma mensagem.";
  } else if (message.length < 10) {
    errors.message = "A mensagem deve ter pelo menos 10 caracteres.";
  }
  if (formData.get("consent") !== "on") {
    errors.consent = "Confirme que você leu a Política de Privacidade.";
  }

  return errors;
}

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const successTitleRef = useRef<HTMLHeadingElement>(null);
  const submittingRef = useRef(false);
  const shouldRestoreFormFocusRef = useRef(false);

  useEffect(() => {
    if (status === "success") {
      successTitleRef.current?.focus();
      const animationFrame = requestAnimationFrame(() => {
        setIsSuccessVisible(true);
      });

      return () => cancelAnimationFrame(animationFrame);
    } else if (status === "error") {
      errorRef.current?.focus();
    } else if (status === "idle" && shouldRestoreFormFocusRef.current) {
      shouldRestoreFormFocusRef.current = false;
      firstFieldRef.current?.focus();
    }
  }, [status]);

  function clearFieldError(
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const field = event.currentTarget.name as FieldName;
    setFieldErrors((current) => {
      if (!current[field]) return current;

      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function handlePhoneChange(event: ChangeEvent<HTMLInputElement>) {
    event.currentTarget.value = formatBrazilianPhone(event.currentTarget.value);
    clearFieldError(event);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setErrorMessage("Revise os campos indicados antes de enviar.");
      setStatus("error");
      return;
    }

    submittingRef.current = true;
    setFieldErrors({});
    setStatus("submitting");
    setErrorMessage("");

    const payload = {
      name: formData.get("name"),
      company: formData.get("company"),
      email: formData.get("email"),
      phone: normalizePhone(String(formData.get("phone") ?? "")),
      service: formData.get("service"),
      message: formData.get("message"),
      consent: formData.get("consent") === "on",
      website: formData.get("website"),
    };

    try {
      const response = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let message = submitErrorFallback;

        try {
          message = getApiErrorMessage(await response.json());
        } catch {
          // The safe fallback already covers an invalid or empty response body.
        }

        setErrorMessage(message);
        setStatus("error");
        return;
      }

      setIsSuccessVisible(false);
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage(submitErrorFallback);
    } finally {
      submittingRef.current = false;
    }
  }

  function handleSendAnotherMessage() {
    formRef.current?.reset();
    setFieldErrors({});
    setErrorMessage("");
    setIsSuccessVisible(false);
    shouldRestoreFormFocusRef.current = true;
    setStatus("idle");
  }

  return (
    <>
      {status === "success" && (
        <div
          role="status"
          aria-live="polite"
          className={`flex flex-col items-center rounded-[16px] border border-border bg-surface p-6 text-center shadow-sm transition-opacity duration-200 ease-out motion-reduce:transition-none sm:p-8 ${
            isSuccessVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            aria-hidden="true"
            className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-signal/25 bg-signal/10 text-signal-strong"
          >
            <Check size={24} strokeWidth={2.25} />
          </div>
          <h2
            ref={successTitleRef}
            tabIndex={-1}
            className="text-xl font-semibold text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-signal/30"
          >
            Recebemos sua mensagem.
          </h2>
          <Text className="mt-3 max-w-md">
            Recebemos sua mensagem. Em breve entraremos em contato para entender
            melhor o contexto da sua empresa.
          </Text>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={handleSendAnotherMessage}
            className="mt-6 w-full sm:w-auto"
          >
            Enviar outra mensagem
          </Button>
        </div>
      )}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        hidden={status === "success"}
        aria-busy={status === "submitting"}
        className="flex min-w-0 flex-col gap-5"
      >
        <div
          className="absolute h-px w-px overflow-hidden whitespace-nowrap opacity-0"
          aria-hidden="true"
        >
          <label htmlFor="website">Não preencha este campo</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-[0.875rem] text-text-secondary"
            >
              Nome
            </label>
            <input
              ref={firstFieldRef}
              id="name"
              name="name"
              required
              maxLength={contactFieldLimits.name}
              autoComplete="name"
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? "name-error" : undefined}
              onChange={clearFieldError}
              className={fieldClassName}
            />
            {fieldErrors.name && (
              <FieldError id="name-error" message={fieldErrors.name} />
            )}
          </div>

          <div>
            <label
              htmlFor="company"
              className="mb-2 block text-[0.875rem] text-text-secondary"
            >
              Empresa <span className="text-text-muted">(opcional)</span>
            </label>
            <input
              id="company"
              name="company"
              maxLength={contactFieldLimits.company}
              autoComplete="organization"
              onChange={clearFieldError}
              className={fieldClassName}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-[0.875rem] text-text-secondary"
            >
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              maxLength={contactFieldLimits.email}
              autoComplete="email"
              inputMode="email"
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              onChange={clearFieldError}
              className={fieldClassName}
            />
            {fieldErrors.email && (
              <FieldError id="email-error" message={fieldErrors.email} />
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-[0.875rem] text-text-secondary"
            >
              Telefone ou WhatsApp{" "}
              <span className="text-text-muted">(opcional)</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              maxLength={contactFieldLimits.phone}
              autoComplete="tel-national"
              inputMode="numeric"
              placeholder="(21) 98765-4321"
              aria-invalid={Boolean(fieldErrors.phone)}
              aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
              onChange={handlePhoneChange}
              className={fieldClassName}
            />
            {fieldErrors.phone && (
              <FieldError id="phone-error" message={fieldErrors.phone} />
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="service"
            className="mb-2 block text-[0.875rem] text-text-secondary"
          >
            O que você procura?
          </label>
          <select
            id="service"
            name="service"
            required
            aria-invalid={Boolean(fieldErrors.service)}
            aria-describedby={fieldErrors.service ? "service-error" : undefined}
            onChange={clearFieldError}
            className={fieldClassName}
            defaultValue=""
          >
            <option value="" disabled>
              Selecione uma opção
            </option>
            {contactServices.map((service) => (
              <option key={service.value} value={service.value}>
                {service.label}
              </option>
            ))}
          </select>
          {fieldErrors.service && (
            <FieldError id="service-error" message={fieldErrors.service} />
          )}
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-[0.875rem] text-text-secondary"
          >
            Descreva seu desafio
          </label>
          <textarea
            placeholder="Conte brevemente como sua empresa funciona hoje, qual problema deseja resolver ou qual objetivo pretende alcançar."
            id="message"
            name="message"
            required
            rows={5}
            minLength={10}
            maxLength={contactFieldLimits.message}
            aria-invalid={Boolean(fieldErrors.message)}
            aria-describedby={fieldErrors.message ? "message-error" : undefined}
            onChange={clearFieldError}
            className="min-w-0 w-full resize-y rounded-[10px] border border-border bg-surface px-4 py-3 text-[0.9375rem] text-text-primary outline-none focus-visible:border-signal"
          />
          {fieldErrors.message && (
            <FieldError id="message-error" message={fieldErrors.message} />
          )}
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-3 text-[0.875rem] leading-relaxed text-text-secondary">
            <input
              name="consent"
              type="checkbox"
              required
              aria-invalid={Boolean(fieldErrors.consent)}
              aria-describedby={
                fieldErrors.consent ? "consent-error" : undefined
              }
              onChange={clearFieldError}
              className="mt-1 h-4 w-4 shrink-0 accent-signal"
            />
            <span>
              Li e concordo com o tratamento dos dados conforme a{" "}
              <Link
                href="/politica-de-privacidade"
                className="link-underline text-signal-strong"
              >
                Política de Privacidade
              </Link>
              .
            </span>
          </label>
          {fieldErrors.consent && (
            <FieldError id="consent-error" message={fieldErrors.consent} />
          )}
        </div>

        {status === "error" && (
          <div
            ref={errorRef}
            role="alert"
            tabIndex={-1}
            className="rounded-[10px] border border-warning/30 bg-warning/5 px-4 py-3 outline-none"
          >
            <Text className="break-words text-warning">{errorMessage}</Text>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={status === "submitting"}
          className="w-full sm:w-fit"
        >
          {status === "submitting" ? "Enviando..." : "Enviar mensagem"}
        </Button>
      </form>
    </>
  );
}
