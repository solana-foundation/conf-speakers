import { SiteHeader } from "@/components/header";
import { Suspense } from "react";

export default function ScheduleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <SiteHeader />
      </Suspense>
      {children}
    </>
  );
}
