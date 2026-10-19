"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { CircleUserIcon } from "@/components/ui/icons";
import { HOME_SCHEDULE_ENABLED, SITE_LOGO_HEIGHT, SITE_LOGO_PATH, SITE_LOGO_WIDTH, SITE_NAME } from "@/lib/site";

export function SiteHeader() {
  const searchParams = useSearchParams();
  const key = searchParams.get("key");
  const qs = key ? `?key=${encodeURIComponent(key)}` : "";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/20 bg-black/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6">
        <Link
          href={qs && !HOME_SCHEDULE_ENABLED ? `/s${qs}` : `/${qs}`}
          className="group flex min-w-0 items-center gap-4 transition-opacity hover:opacity-80"
        >
          <Image
            src={SITE_LOGO_PATH}
            alt={SITE_NAME}
            width={SITE_LOGO_WIDTH}
            height={SITE_LOGO_HEIGHT}
            className="h-7 w-auto sm:h-8"
          />
          <span className="breakpoint-eyebrow hidden border-l border-white/30 pl-4 text-white/55 sm:block">
            Speaker portal
          </span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          {!qs && (
            <Link href={`/email-link`} className="breakpoint-eyebrow text-white transition-colors hover:text-[#14f195]">
              Speaker access
            </Link>
          )}
          {qs && (
            <>
              {HOME_SCHEDULE_ENABLED && (
                <Link
                  href={`/${qs}`}
                  className="breakpoint-eyebrow text-white/70 transition-colors hover:text-[#14f195]"
                >
                  Schedule
                </Link>
              )}
              <Link
                href={`/s${qs}`}
                className="inline-flex items-center gap-2 text-white/70 transition-colors hover:text-[#14f195]"
                aria-label="Speaker portal"
              >
                <CircleUserIcon className="h-5 w-5" />
                <span className="breakpoint-eyebrow hidden sm:inline">My portal</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
