"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-md border border-border/70 bg-surface-elevated/75 px-4 py-2 text-sm font-medium text-text-primary transition-all hover:bg-surface-elevated"
    >
      Sair
    </button>
  );
}
