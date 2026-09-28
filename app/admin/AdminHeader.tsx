import { LogoutButton } from "./logout/LogoutButton";

interface AdminHeaderProps {
  userEmail: string;
}

export function AdminHeader({ userEmail }: AdminHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Admin</h1>
        <p className="mt-1 text-sm text-text-secondary">{userEmail}</p>
      </div>
      <LogoutButton />
    </div>
  );
}
