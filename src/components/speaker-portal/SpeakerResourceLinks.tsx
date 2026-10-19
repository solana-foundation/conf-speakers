import { ArrowUpRight, CalendarDays, MapPin, Ticket, Users } from "@/components/ui/icons";
import { SectionHeading } from "@/components/section-heading";
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
    <section className="space-y-10" aria-labelledby="speaker-resource-links-title">
      <SectionHeading eyebrow="Event site" title="Around the event" id="speaker-resource-links-title" />
      <div className="grid gap-px border border-[#353535] bg-[#353535] sm:grid-cols-2 lg:grid-cols-4">
        {RESOURCE_LINKS.map(({ title, description, path, icon: Icon }) => (
          <a
            key={path}
            href={`${EVENT_SITE_URL.replace(/\/$/, "")}${path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-56 flex-col justify-between bg-black p-5 text-white transition-colors hover:bg-[#1e1e1e] sm:p-6"
          >
            <div className="flex items-start justify-between">
              <Icon className="h-6 w-6 text-white" aria-hidden="true" />
              <ArrowUpRight
                className="h-5 w-5 text-[#a2a2a2] transition-colors group-hover:text-white"
                aria-hidden="true"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl leading-[1.2] tracking-[-0.03rem]">{title}</h3>
              <p className="text-base leading-[1.4] text-[#a2a2a2]">{description}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
