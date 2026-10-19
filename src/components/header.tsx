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
    <header className="fixed top-3 left-1/2 z-40 w-[calc(100%-32px)] max-w-[466px] -translate-x-1/2 bg-black">
      <div className="flex h-12 items-center justify-between gap-3 px-3 sm:px-4">
        <Link
          href={qs && !HOME_SCHEDULE_ENABLED ? `/s${qs}` : `/${qs}`}
          className="group flex shrink-0 items-center gap-[6px] transition-opacity hover:opacity-80"
          aria-label={SITE_NAME}
        >
          <Image
            src="/breakpoint/nav-solana.svg"
            alt=""
            aria-hidden="true"
            width={23}
            height={20}
            className="h-4 w-auto sm:h-5"
          />
          <Image
            src={SITE_LOGO_PATH}
            alt=""
            aria-hidden="true"
            width={SITE_LOGO_WIDTH}
            height={SITE_LOGO_HEIGHT}
            className="h-4 w-auto sm:h-5"
          />
        </Link>
        <nav className="flex shrink-0 items-center gap-2 sm:gap-3" aria-label="Speaker portal">
          {!qs && (
            <Link
              href="/email-link"
              className="inline-flex h-8 items-center bg-white px-3 font-mono text-[11px] font-bold tracking-[0.07em] text-black uppercase transition-colors hover:bg-[#c0c0c0] sm:text-xs"
            >
              Speaker access
            </Link>
          )}
          {qs && (
            <>
              {HOME_SCHEDULE_ENABLED && (
                <Link
                  href={`/${qs}`}
                  className="font-mono text-[11px] font-bold tracking-[0.07em] text-white uppercase transition-colors hover:text-[#aa67fb] sm:text-xs"
                >
                  Schedule
                </Link>
              )}
              <Link
                href={`/s${qs}`}
                className="inline-flex h-8 items-center gap-2 bg-white px-3 font-mono text-[11px] font-bold tracking-[0.07em] text-black uppercase transition-colors hover:bg-[#c0c0c0] sm:text-xs"
                aria-label="Speaker portal"
              >
                <CircleUserIcon className="h-4 w-4" />
                <span>My portal</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
