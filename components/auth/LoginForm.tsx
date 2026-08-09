"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../ui/Input copy";
import Button from "../ui/Button copy";

interface LoginFormProps {
  // Nhan truc tiep server action (loginAdminAction / loginSuperAdminAction) tu page cha.
  loginAction: (email: string, password: string) => Promise<unknown>;
  redirectTo: string;
}

export default function LoginForm({ loginAction, redirectTo }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginAction(email, password);
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Email hoặc mật khẩu không đúng",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div>
        <label className="mb-1 block text-sm text-zinc-400">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="username"
          required
          autoFocus
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-zinc-400">Mật khẩu</label>
        <Input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button
        type="submit"
        disabled={loading}
        className="w-full cursor-pointer"
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>
    </form>
  );
}
