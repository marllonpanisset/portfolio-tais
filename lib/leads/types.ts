import type { ContactService } from "@/lib/contact";

export interface LeadInput {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  service: ContactService;
  message: string;
  consent: true;
}

export interface CreateLeadRecord {
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  service: ContactService;
  message: string;
  consent: true;
  source: string;
}
