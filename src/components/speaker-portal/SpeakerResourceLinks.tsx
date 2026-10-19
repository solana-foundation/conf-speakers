import { ArrowUpRight, CalendarDays, MapPin, Ticket, Users } from "@/components/ui/icons";
import { EVENT_SITE_URL } from "@/lib/site";

const RESOURCE_LINKS = [
  { title: "Event schedule", description: "See the latest event programme.", path: "/schedule", icon: CalendarDays },
  { title: "Speakers", description: "Explore the speaker lineup.", path: "/speakers", icon: Users },
  { title: "Plan your visit", description: "Travel and venue information.", path: "/travel", icon: MapPin },
  { title: "Registration", description: "Ticket information and event access.", path: "/registration", icon: Ticket },
];

export default function SpeakerResourceLinks() {
  if (!EVENT_SITE_URL) return null;

  return (
    <section className="space-y-4" aria-labelledby="speaker-resource-links-title">
      <h2 id="speaker-resource-links-title" className="breakpoint-display text-2xl text-white sm:text-3xl">
        Around the event
      </h2>
      <div className="grid gap-px border border-white/20 bg-white/20 sm:grid-cols-2 lg:grid-cols-4">
        {RESOURCE_LINKS.map(({ title, description, path, icon: Icon }) => (
          <a
            key={path}
            href={`${EVENT_SITE_URL.replace(/\/$/, "")}${path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-44 flex-col justify-between bg-black p-5 text-white transition-colors hover:bg-[#1e1e1e]"
          >
            <div className="flex items-start justify-between">
              <Icon className="h-6 w-6 text-[#14f195]" aria-hidden="true" />
              <ArrowUpRight
                className="h-5 w-5 text-white/40 transition-colors group-hover:text-[#14f195]"
                aria-hidden="true"
              />
            </div>
            <div>
              <h3 className="breakpoint-eyebrow mb-2 text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-white/55">{description}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
