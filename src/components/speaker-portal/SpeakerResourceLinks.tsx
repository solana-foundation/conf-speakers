import Image from "next/image";
import { ArrowUpRight, Images, PlayCircle } from "lucide-react";

const RESOURCE_LINKS = [
  {
    title: "Solana Accelerate 2026",
    label: "Watch video",
    href: "https://vimeo.com/1189785623?share=copy&fl=sv&fe=ci",
    image: "/speaker-links/solana-accelerate-2026-video.webp",
    alt: "Solana Accelerate 2026 announcement video thumbnail",
    icon: PlayCircle,
  },
  {
    title: "Miami Vibes",
    label: "View gallery",
    href: "https://gallery.xollective.co/solanaacceleratemiamivibes/",
    image: "/speaker-links/solana-accelerate-miami-vibes.webp",
    alt: "Solana Accelerate Miami vibes gallery preview",
    icon: Images,
  },
  {
    title: "Miami Sponsors",
    label: "View gallery",
    href: "https://gallery.xollective.co/solanaacceleratemiamisponsors/",
    image: "/speaker-links/solana-accelerate-miami-sponsors.webp",
    alt: "Solana Accelerate Miami sponsors gallery preview",
    icon: Images,
  },
  {
    title: "Miami Speakers",
    label: "View gallery",
    href: "https://gallery.xollective.co/solanaacceleratemiamispeakers/",
    image: "/speaker-links/solana-accelerate-miami-speakers.webp",
    alt: "Solana Accelerate Miami speakers gallery preview",
    icon: Images,
  },
];

export default function SpeakerResourceLinks() {
  return (
    <section className="space-y-4" aria-labelledby="speaker-resource-links-title">
      <h2
        id="speaker-resource-links-title"
        className="font-space-grotesk text-sm font-semibold tracking-[0.15em] text-white/60 uppercase"
      >
        Event Links
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {RESOURCE_LINKS.map(({ title, label, href, image, alt, icon: Icon }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] text-white shadow-sm backdrop-blur-sm transition-colors hover:border-[#19fb9b]/50 hover:bg-white/[0.04] focus-visible:ring-offset-black"
          >
            <div className="relative aspect-video overflow-hidden bg-white/[0.03]">
              <Image
                src={image}
                alt={alt}
                fill
                sizes="(min-width: 1024px) 264px, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-space-grotesk text-lg leading-tight font-light">{title}</h3>
                <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-white/45 transition-colors group-hover:text-[#19fb9b]" />
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-white/55">
                <Icon className="h-4 w-4 text-[#9945ff]" />
                <span>{label}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
