import Image from "next/image";
import { EVENT_DATES_LABEL, EVENT_LOCATION, EVENT_NAME } from "@/lib/site";

export function BreakpointHero({ title, id }: { title: string; id: string }) {
  return (
    <section className="relative h-[480px] overflow-hidden bg-black lg:h-[467px]" aria-labelledby={id}>
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[360px] overflow-hidden">
        <Image
          src="/breakpoint/speakers-hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center contrast-125 grayscale"
        />
        <div className="absolute inset-0 bg-[#14f195] mix-blend-multiply" />
      </div>
      <Image
        src="/breakpoint/pixel-edge.svg"
        alt=""
        aria-hidden="true"
        width={1440}
        height={146}
        className="pointer-events-none absolute top-[160px] right-0 h-[200px] w-[1078px] max-w-none object-cover lg:right-auto lg:left-0 lg:w-full lg:min-w-[840px]"
      />
      <div className="absolute top-[252px] left-1/2 flex w-full max-w-[1728px] -translate-x-1/2 flex-col items-start gap-5 px-4 text-white lg:gap-8 lg:px-8">
        <p className="breakpoint-eyebrow text-white">{EVENT_NAME}</p>
        <h1 id={id} className="breakpoint-page-title max-w-[1026px] text-white">
          {title}
        </h1>
      </div>
    </section>
  );
}

export function EventMeta() {
  if (!EVENT_DATES_LABEL && !EVENT_LOCATION) return null;

  return (
    <div className="breakpoint-eyebrow flex flex-wrap gap-x-8 gap-y-2 border-b border-[#353535] py-6 text-[#a2a2a2]">
      {EVENT_DATES_LABEL && <span>{EVENT_DATES_LABEL}</span>}
      {EVENT_LOCATION && <span>{EVENT_LOCATION}</span>}
    </div>
  );
}
