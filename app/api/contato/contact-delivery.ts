export interface ContactSubmission {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  service?: string;
  message: string;
  consent: true;
}

export interface ContactDelivery {
  deliver(submission: ContactSubmission): Promise<void>;
}

export class ContactDeliveryNotConfiguredError extends Error {
  constructor() {
    super("A entrega de contatos ainda não foi configurada.");
    this.name = "ContactDeliveryNotConfiguredError";
  }
}

class ContactDeliveryError extends Error {
  constructor() {
    super("O destino de contatos rejeitou a solicitação.");
    this.name = "ContactDeliveryError";
  }
}

function getWebhookConfiguration() {
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new ContactDeliveryNotConfiguredError();
  }

  let url: URL;
  try {
    url = new URL(webhookUrl);
  } catch {
    throw new ContactDeliveryNotConfiguredError();
  }

  const isLocalUrl =
    url.protocol === "http:" &&
    (url.hostname === "localhost" || url.hostname === "127.0.0.1");

  if (url.protocol !== "https:" && !isLocalUrl) {
    throw new ContactDeliveryNotConfiguredError();
  }

  return {
    url,
    token: process.env.CONTACT_WEBHOOK_TOKEN,
  };
}

// Esta porta mantém a rota independente do provedor de automação, e-mail ou
// CRM. Sem um destino real configurado, a API falha explicitamente.
export const contactDelivery: ContactDelivery = {
  async deliver(submission) {
    const { url, token } = getWebhookConfiguration();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(submission),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      throw new ContactDeliveryError();
    }
  },
};
