"use client";

import { LockKeyhole } from "lucide-react";
import { EmailForm } from "@/components/email-form";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@ui/alert";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="flex min-h-dvh items-center">
      <div className="w-full">
        <div className="mx-auto max-w-md px-6">
          <h1 className="items-middle mb-2 flex gap-2 text-2xl">
            <LockKeyhole className="h-5 w-5" />
            Get speakers access link
          </h1>
          <p className="text-p2 mb-6">Enter your email to receive your secure access link</p>

          <Suspense fallback={null}>
            <ExpiredAlert />
          </Suspense>
        </div>
        <EmailForm />
      </div>
    </main>
  );
}

function ExpiredAlert() {
  const searchParams = useSearchParams();
  const expired = searchParams.get("expired") === "1";

  return expired ? (
    <Alert>
      <AlertTitle>Link expired</AlertTitle>
      <AlertDescription>Your access link has expired. Enter your email to get a new one.</AlertDescription>
    </Alert>
  ) : null;
}
