"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { CircleUserIcon } from "lucide-react";

export function SiteHeader() {
  const searchParams = useSearchParams();
  const key = searchParams.get("key");
  const qs = key ? `?key=${encodeURIComponent(key)}` : "";

  return (
    <header className="bg-background/80 border-stroke-primary sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 sm:h-16 xl:px-0">
        <Link href={`/${qs}`} className="hover:opacity-80">
          <Image src="/icon.svg" alt="BP25" width={60} height={14} />
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {!qs && (
            <Link href={`/email-link`} className="hover:underline">
              Speakers
            </Link>
          )}
          {qs && (
            <Link href={`/s${qs}`} className="hover:underline">
              <CircleUserIcon />
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
