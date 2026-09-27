import type { SupabaseClient } from "@supabase/supabase-js";

import { supabaseServer } from "@/lib/supabase/server";
import type { CreateLeadRecord } from "@/lib/leads/types";

export type LeadRepositoryErrorCode =
  | "INSERT_FAILED"
  | "CONNECTION_ERROR"
  | "UNKNOWN_ERROR";

type CreatedLeadRow = {
  id: string;
};

export class LeadRepositoryError extends Error {
  readonly code: LeadRepositoryErrorCode;

  constructor(code: LeadRepositoryErrorCode) {
    super("Não foi possível salvar o lead.");
    this.name = "LeadRepositoryError";
    this.code = code;
  }
}

// Centraliza exclusivamente a persistência de leads.
// Assim, o restante da aplicação não depende diretamente da API do Supabase.
export class LeadRepository {
  constructor(private readonly client: SupabaseClient = supabaseServer) {}

  async create(record: CreateLeadRecord): Promise<{ id: string }> {
    try {
      const { data, error } = await this.client
        .from("leads")
        .insert(record)
        .select("id")
        .single<CreatedLeadRow>();

      if (error || !data || typeof data.id !== "string") {
        throw new LeadRepositoryError("INSERT_FAILED");
      }

      return { id: data.id };
    } catch (error) {
      if (error instanceof LeadRepositoryError) {
        throw error;
      }

      if (error instanceof TypeError) {
        throw new LeadRepositoryError("CONNECTION_ERROR");
      }

      throw new LeadRepositoryError("UNKNOWN_ERROR");
    }
  }
}
