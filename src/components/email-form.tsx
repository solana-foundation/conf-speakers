"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Alert, AlertDescription, AlertTitle } from "@ui/alert";

type ActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: { email?: string };
  cooldownMs?: number;
};

const initialState: ActionState = { ok: false, message: "" };

function EmailFieldError({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p className="text-sm text-red-600" role="alert">
      {error}
    </p>
  );
}

function SubmitButton({ pending, cooldownMs }: { pending: boolean; cooldownMs?: number }) {
  const [cooldown, setCooldown] = useState<number>(cooldownMs ?? 0);

  useEffect(() => {
    setCooldown(cooldownMs ?? 0);
  }, [cooldownMs]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => (c > 1000 ? c - 1000 : 0)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const label = useMemo(() => {
    if (pending) return "Sending…";
    if (cooldown > 0) return `Wait ${Math.ceil(cooldown / 1000)}s`;
    return "Email me a link";
  }, [pending, cooldown]);

  return (
    <Button type="submit" disabled={pending || cooldown > 0}>
      {label}
    </Button>
  );
}

export function EmailForm() {
  const [state, setState] = useState<ActionState>(initialState);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setState(initialState);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/auth/request-link", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json()) as ActionState;
      setState(data);
    } catch {
      setState({ ok: false, message: "Something went wrong. Please try again." });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-4 p-6">
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        defaultValue=""
        tabIndex={-1}
        aria-hidden="true"
        className="hidden"
        autoComplete="off"
      />
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">
          Email address
        </label>
        <Input id="email" name="email" type="email" placeholder="you@example.com" required />
        <p className="text-muted-foreground text-xs">
          You&apos;ll receive a magic link from the Breakpoint Events Team.
        </p>
        <EmailFieldError error={state.fieldErrors?.email} />
      </div>
      <SubmitButton pending={pending} cooldownMs={state.cooldownMs} />
      {state.message && (
        <Alert>
          <AlertTitle>{state.ok ? "Check your email" : "There was a problem"}</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
    </form>
  );
}
