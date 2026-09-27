create table public.leads (
  id uuid default gen_random_uuid() not null,
  name text not null,
  company text,
  email text not null,
  phone text,
  service text not null,
  message text not null,
  consent boolean not null,
  source text default 'website' not null,
  consented_at timestamptz default now() not null,
  created_at timestamptz default now() not null,

  constraint leads_pkey primary key (id),
  constraint leads_name_not_blank_check
    check (char_length(trim(name)) > 0),
  constraint leads_name_length_check
    check (char_length(name) <= 120),
  constraint leads_company_length_check
    check (company is null or char_length(company) <= 160),
  constraint leads_email_not_blank_check
    check (char_length(trim(email)) > 0),
  constraint leads_email_length_check
    check (char_length(email) <= 254),
  constraint leads_phone_length_check
    check (phone is null or char_length(phone) <= 30),
  constraint leads_service_check
    check (
      service in (
        'presenca-digital',
        'sistemas-web',
        'automacoes'
      )
    ),
  constraint leads_message_length_check
    check (char_length(message) between 10 and 5000),
  constraint leads_consent_true_check
    check (consent is true),
  constraint leads_source_not_blank_check
    check (char_length(trim(source)) > 0),
  constraint leads_source_length_check
    check (char_length(source) <= 64)
);

create index leads_email_idx
  on public.leads (email);

create index leads_created_at_desc_idx
  on public.leads (created_at desc);

alter table public.leads enable row level security;
