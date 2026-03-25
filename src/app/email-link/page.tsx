"use client";

import { LockKeyhole } from "lucide-react";
import { EmailForm } from "@/components/email-form";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@ui/alert";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-5rem)] items-center bg-black">
      <div className="w-full">
        <div className="mx-auto max-w-md px-6">
          <h1 className="font-space-grotesk mb-3 flex items-center gap-3 text-3xl font-light text-white">
            <LockKeyhole className="h-5 w-5 text-[#9945ff]" />
            <span>Get speakers access link</span>
          </h1>
          <p className="text-p2 mb-6 text-white/50">Enter your email to receive your secure access link</p>

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
    <Alert className="border-[#9945ff]/30 bg-[#9945ff]/10">
      <AlertTitle>Link expired</AlertTitle>
      <AlertDescription>Your access link has expired. Enter your email to get a new one.</AlertDescription>
    </Alert>
  ) : null;
}
