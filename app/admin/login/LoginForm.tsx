"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError("Email ou senha inválidos");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {error && (
        <div className="border border-red-800/15 bg-red-50 px-4 py-3 text-sm leading-5 text-red-800">
          {error}
        </div>
      )}

      <div className="space-y-2.5">
        <label
          htmlFor="email"
          className="block text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-text-secondary"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 w-full rounded-none border border-black/15 bg-white px-4 text-sm text-text-primary placeholder:text-text-secondary/45 transition-colors focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          placeholder="admin@exemplo.com"
        />
      </div>

      <div className="space-y-2.5">
        <label
          htmlFor="password"
          className="block text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-text-secondary"
        >
          Senha
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-12 w-full rounded-none border border-black/15 bg-white px-4 text-sm text-text-primary placeholder:text-text-secondary/45 transition-colors focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 flex h-12 w-full items-center justify-center bg-[#111111] px-5 text-sm font-medium tracking-[0.01em] text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
