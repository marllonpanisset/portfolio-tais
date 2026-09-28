import type { Metadata } from "next";
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
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary">Admin</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Acesse o painel administrativo
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
