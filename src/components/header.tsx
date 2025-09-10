"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export function SiteHeader() {
  const searchParams = useSearchParams();
  const key = searchParams.get("key");
  const qs = key ? `?key=${encodeURIComponent(key)}` : "";

  return (
    <header className="bg-background/80 border-stroke-primary sticky top-0 z-40 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 sm:h-16 xl:px-0">
        <Image src="/icon.svg" alt="BP25" width={60} height={14} />
        {qs && (
          <nav className="flex items-center gap-6 text-sm">
            <Link href={`/schedule${qs}`} className="hover:underline">
              Schedule
            </Link>
            <Link href={`/s${qs}`} className="hover:underline">
              Speaker Info
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
