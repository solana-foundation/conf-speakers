import { SiteHeader } from "@/components/header";

export default function ScheduleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
