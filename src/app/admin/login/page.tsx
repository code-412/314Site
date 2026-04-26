"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogoIcon } from "@/shared/icons/LogoIcon";
import s from "../AdminPages.module.scss";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError("Неверный email или пароль.");
        return;
      }

      const next = new URLSearchParams(window.location.search).get("next");
      router.replace(next || "/admin");
      router.refresh();
    } finally {
      setPending(false);
    }
  };

  return (
    <div className={s.loginPage}>
      <section className={s.loginCard}>
        <LogoIcon />
        <h1 className={s.loginTitle}>Admin access</h1>
        <p className={s.heroText}>
          В dev-режиме по умолчанию: admin@code412.local / admin. На VPS задай
          ADMIN_EMAIL, ADMIN_PASSWORD и ADMIN_SESSION_SECRET.
        </p>
        <form className={s.form} onSubmit={onSubmit}>
          <input
            className={s.input}
            placeholder="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="username"
          />
          <input
            className={s.input}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
          {error && <p className={s.loginError}>{error}</p>}
          <button className={s.buttonDark} type="submit" disabled={pending}>
            {pending ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </div>
  );
}
