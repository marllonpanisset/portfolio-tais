export const contactServices = [
  {
    value: "sistemas-web",
    label: "Sistemas Web Personalizados",
  },
  {
    value: "automacoes",
    label: "Automação de Processos",
  },
  {
    value: "presenca-digital",
    label: "Presença Digital",
  },
  {
    value: "nao-sei",
    label: "Ainda não sei qual solução preciso",
  },
] as const;

export const contactFieldLimits = {
  name: 120,
  company: 160,
  email: 254,
  phone: 30,
  service: 32,
  message: 5_000,
} as const;

export type ContactService = (typeof contactServices)[number]["value"];
