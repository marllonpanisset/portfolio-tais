import {
  LeadRepository,
  LeadRepositoryError,
} from "@/lib/leads/repository";
import type { CreateLeadRecord, LeadInput } from "@/lib/leads/types";

export type LeadServiceErrorCode =
  | "PERSISTENCE_ERROR"
  | "UNKNOWN_ERROR";

const serviceErrorMessages: Record<LeadServiceErrorCode, string> = {
  PERSISTENCE_ERROR: "Não foi possível enviar sua mensagem.",
  UNKNOWN_ERROR: "Não foi possível enviar sua mensagem.",
};

type LeadRepositoryContract = Pick<LeadRepository, "create">;

export class LeadServiceError extends Error {
  readonly code: LeadServiceErrorCode;

  constructor(code: LeadServiceErrorCode) {
    super(serviceErrorMessages[code]);
    this.name = "LeadServiceError";
    this.code = code;
  }
}

// Aplica as regras de negócio necessárias para criar um lead.
export class LeadService {
  constructor(
    private readonly repository: LeadRepositoryContract = new LeadRepository(),
  ) {}

  async create(input: LeadInput): Promise<{ id: string }> {
    const record: CreateLeadRecord = {
      ...input,
      company: input.company ?? null,
      phone: input.phone ?? null,
      source: "website",
    };

    try {
      const { id } = await this.repository.create(record);
      return { id };
    } catch (error) {
      // Regras de negócio ficam no Service; o Repository cuida apenas da persistência.
      if (error instanceof LeadRepositoryError) {
        throw new LeadServiceError("PERSISTENCE_ERROR");
      }

      throw new LeadServiceError("UNKNOWN_ERROR");
    }
  }
}
