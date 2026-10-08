import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Login — Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();

  if (data?.claims) {
    redirect("/admin");
  }

  return (
    <main className="min-h-svh bg-[#f3f2ee] px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100svh-3rem)] w-full max-w-6xl items-center sm:min-h-[calc(100svh-5rem)]">
        <div className="grid w-full overflow-hidden border border-black/10 bg-white shadow-[0_24px_80px_rgba(17,17,17,0.08)] md:min-h-[660px] md:grid-cols-[0.92fr_1.08fr]">
          <aside className="relative flex min-h-[245px] flex-col justify-between overflow-hidden bg-[#111111] px-7 py-7 text-white sm:min-h-[285px] sm:px-10 sm:py-9 md:min-h-[660px] md:px-12 md:py-11">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-28 -top-32 h-80 w-80 rounded-full border border-white/10"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full border border-white/10"
            />

            <div className="relative z-10 flex items-center gap-3">
              <Image
                src="/android-chrome-512x512.png"
                alt=""
                aria-hidden="true"
                width={512}
                height={512}
                className="h-11 w-11 rounded-sm object-cover"
                priority
              />
              <div>
                <p className="font-display text-base font-bold tracking-[0.16em]">
                  CONJUGA
                </p>
                <p className="mt-1 text-[0.62rem] uppercase tracking-[0.17em] text-white/55">
                  Administração de sites
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-12 md:mt-auto md:pb-12 md:pt-20">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/55">
                CMS / TAÍS
              </p>
              <h2 className="mt-5 max-w-sm font-display text-3xl font-medium leading-[1.12] tracking-[-0.045em] sm:text-4xl lg:text-[2.75rem]">
                Um espaço para cuidar do seu site.
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">
                Entre para gerenciar páginas, projetos e mídias do portfólio.
              </p>
            </div>

            <p className="relative z-10 mt-8 hidden font-mono text-[0.6rem] uppercase tracking-[0.16em] text-white/40 md:block">
              CONJUGA · PAINEL ADMINISTRATIVO
            </p>
          </aside>

          <section
            aria-labelledby="login-title"
            className="flex items-center px-7 py-10 sm:px-12 sm:py-14 lg:px-20"
          >
            <div className="mx-auto w-full max-w-md">
              <div className="mb-9 border-l-2 border-black pl-4 sm:mb-11">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-text-muted">
                  Acesso restrito
                </p>
                <h1
                  id="login-title"
                  className="mt-3 font-display text-3xl font-medium tracking-[-0.045em] text-text-primary sm:text-4xl"
                >
                  Entrar no painel
                </h1>
                <p className="mt-3 text-sm leading-6 text-text-secondary">
                  Informe seu email e senha para continuar.
                </p>
              </div>

              <LoginForm />

              <p className="mt-8 border-t border-black/10 pt-5 text-xs leading-5 text-text-muted">
                Acesso administrativo do site Taís.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
