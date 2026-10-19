"use client";

import { LockKeyhole } from "@/components/ui/icons";
import { EmailForm } from "@/components/email-form";
import { useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@ui/alert";
import { Suspense } from "react";
import Image from "next/image";
import { EVENT_DATES_LABEL, EVENT_LOCATION, EVENT_NAME } from "@/lib/site";

export default function Home() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl bg-black lg:grid-cols-[1.1fr_0.9fr]">
      <div className="relative isolate flex min-h-72 flex-col justify-between overflow-hidden border-b border-white/20 p-6 sm:p-10 lg:min-h-full lg:border-r lg:border-b-0">
        <Image
          src="/breakpoint/speakers-hero.webp"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 640px, 100vw"
          className="object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        <div className="breakpoint-eyebrow relative text-[#14f195]">{EVENT_NAME} / Speakers</div>
        <div className="relative">
          <h1 className="breakpoint-display max-w-lg text-4xl leading-[1.08] text-white sm:text-6xl">
            Your speaker portal
          </h1>
          <p className="breakpoint-eyebrow mt-5 flex flex-wrap gap-x-6 gap-y-2 text-white/70">
            {EVENT_DATES_LABEL && <span>{EVENT_DATES_LABEL}</span>}
            {EVENT_LOCATION && <span>{EVENT_LOCATION}</span>}
          </p>
        </div>
      </div>
      <div className="flex items-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md space-y-6">
          <div>
            <LockKeyhole className="mb-5 h-7 w-7 text-[#14f195]" aria-hidden="true" />
            <h2 className="breakpoint-display text-2xl text-white sm:text-3xl">Get your access link</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Enter the email address the speaker team has for you. We&apos;ll send a secure link to your portal.
            </p>
          </div>
          <Suspense fallback={null}>
            <ExpiredAlert />
          </Suspense>
          <EmailForm />
        </div>
      </div>
    </main>
  );
}

function ExpiredAlert() {
  const searchParams = useSearchParams();
  const expired = searchParams.get("expired") === "1";

  return expired ? (
    <Alert className="border-[#aa67fb]/30 bg-[#aa67fb]/10">
      <AlertTitle>Link expired</AlertTitle>
      <AlertDescription>Your access link has expired. Enter your email to get a new one.</AlertDescription>
    </Alert>
  ) : null;
}
