"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { CircleUserIcon } from "lucide-react";
import { SITE_LOGO_HEIGHT, SITE_LOGO_PATH, SITE_LOGO_WIDTH, SITE_NAME } from "@/lib/site";

export function SiteHeader() {
  const searchParams = useSearchParams();
  const key = searchParams.get("key");
  const qs = key ? `?key=${encodeURIComponent(key)}` : "";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/80 backdrop-blur-xl">
      {/* Gradient accent line at top */}
      <div
        className="h-[2px] w-full"
        style={{
          background: "linear-gradient(to right, #9945ff, #19fb9b, #00d4ff)",
        }}
      />
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 sm:h-16 xl:px-0">
        <Link href={`/${qs}`} className="group flex items-center gap-3 transition-opacity hover:opacity-80">
          <Image src={SITE_LOGO_PATH} alt={SITE_NAME} width={SITE_LOGO_WIDTH} height={SITE_LOGO_HEIGHT} className="h-10 w-auto sm:h-12" />
        </Link>
        <nav className="flex items-center gap-6">
          {!qs && (
            <Link
              href={`/email-link`}
              className="font-space-grotesk text-sm font-semibold uppercase tracking-[0.05em] text-white transition-colors hover:text-white/80"
            >
              Speakers
            </Link>
          )}
          {qs && (
            <>
              <Link
                href={`/${qs}`}
                className="font-space-grotesk text-sm font-semibold uppercase tracking-[0.05em] text-white/60 transition-colors hover:text-white"
              >
                Schedule
              </Link>
              <Link
                href={`/s${qs}`}
                className="text-white/60 transition-colors hover:text-white"
              >
                <CircleUserIcon className="h-5 w-5" />
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
