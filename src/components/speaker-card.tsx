import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Twitter, Check, CircleMinus, Clock } from "@/components/ui/icons";
import { DeckStatus } from "@/lib/airtable/types";
import { getWebPublishingStatus } from "@/lib/airtable/utils";

export interface SpeakerCardProps {
  imageUrl?: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  company?: string;
  bio?: string;
  xLink?: string;
  xName?: string;
  speakerCardUrl?: string;
  // ActionsChecklist data
  sessions?: Array<{
    id?: string;
    name?: string;
    actionsDeckReceived?: DeckStatus | null;
    greenlightTime?: string | null;
    webPublishingStatus?: string[] | null;
  }>;
  dietaryStatus?: string | null;
}

interface StatusBadge {
  label: string;
  variant: "awaiting-deck" | "schedule-pending" | "all-set";
  icon: React.ReactNode;
}

export default function SpeakerCard({
  imageUrl,
  firstName,
  lastName,
  jobTitle,
  company,
  bio,
  xLink,
  xName,
  speakerCardUrl,
  sessions = [],
}: SpeakerCardProps) {
  const getStatusBadges = (): StatusBadge[] => {
    const badges: StatusBadge[] = [];

    const pendingDeckSessions = sessions.filter((session) => session.actionsDeckReceived === DeckStatus.ToUpload);
    if (pendingDeckSessions.length > 0) {
      badges.push({
        label: `Awaiting Deck${pendingDeckSessions.length > 1 ? ` (${pendingDeckSessions.length})` : ""}`,
        variant: "awaiting-deck",
        icon: <CircleMinus className="h-3 w-3" />,
      });
    }

    const approvedDeckSessions = sessions.filter((session) => session.actionsDeckReceived === DeckStatus.Approved);
    if (approvedDeckSessions.length > 0) {
      badges.push({
        label: `Approved Deck${approvedDeckSessions.length > 1 ? ` (${approvedDeckSessions.length})` : ""}`,
        variant: "all-set",
        icon: <Check className="h-3 w-3" />,
      });
    }

    const hasDoNotPublishSession = sessions.some((session) => {
      const status = getWebPublishingStatus(session.webPublishingStatus ?? undefined);
      return status?.hasDoNotPublish === true;
    });

    if (
      sessions.some(
        (session) =>
          session.greenlightTime && !getWebPublishingStatus(session.webPublishingStatus ?? undefined).hasTime,
      )
    ) {
      badges.push({
        label: "Time to be confirmed",
        variant: "schedule-pending",
        icon: <Clock className="h-3 w-3" />,
      });
    }

    const allCompletedSessions = sessions.filter(
      (session) =>
        session.actionsDeckReceived === DeckStatus.Approved ||
        session.actionsDeckReceived === null ||
        session.actionsDeckReceived === undefined,
    );
    if (
      badges.length === 0 &&
      sessions.length > 0 &&
      allCompletedSessions.length === sessions.length &&
      !hasDoNotPublishSession &&
      sessions.every((session) => getWebPublishingStatus(session.webPublishingStatus ?? undefined).hasTime)
    ) {
      badges.push({
        label: "All Set",
        variant: "all-set",
        icon: <Check className="h-3 w-3" />,
      });
    }

    return badges;
  };

  const statusBadges = getStatusBadges();

  return (
    <section className="border border-white/20 bg-[#1e1e1e] p-5 sm:p-8" aria-label="Your speaker profile">
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
        <div className="flex flex-col items-center gap-4 lg:items-start">
          <div className="relative">
            <div className="border border-[#14f195]/60 p-1">
              <Avatar className="size-24 rounded-none lg:size-32">
                {imageUrl && <AvatarImage src={imageUrl} alt={`${firstName} ${lastName}`} />}
                <AvatarFallback className="rounded-none bg-black text-3xl font-semibold text-white">
                  {firstName?.charAt(0)}
                  {lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          {speakerCardUrl && (
            <a
              href={speakerCardUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              title="Download Speaker Card"
              className="breakpoint-eyebrow flex items-center text-[#14f195] underline underline-offset-4 transition-colors hover:text-white"
            >
              Social Media Card
            </a>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="breakpoint-display text-3xl leading-none text-white sm:text-5xl">
                {firstName} {lastName}
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                {statusBadges.map((badge, index) => (
                  <Badge
                    key={index}
                    className={`gap-1.5 ${
                      badge.variant === "awaiting-deck"
                        ? "bg-[#3c91ff]/20 text-[#3c91ff]"
                        : badge.variant === "schedule-pending"
                          ? "bg-[#c0e021]/20 text-[#c0e021]"
                          : "bg-[#14f195]/20 text-[#14f195]"
                    }`}
                  >
                    {badge.icon}
                    <span>{badge.label}</span>
                  </Badge>
                ))}
              </div>
            </div>
            <p className="breakpoint-eyebrow mt-3 leading-relaxed">
              {jobTitle && <span className="text-white/70">{jobTitle}</span>}
              {jobTitle && company && <span className="mx-2 text-white/30">/</span>}
              {company && <span className="text-white/50">{company}</span>}
            </p>

            {xLink && (
              <div className="mt-2 flex items-center gap-2">
                <Twitter className="h-4 w-4 text-white/40" />
                <a
                  className="text-md text-[#aa67fb] transition-colors hover:text-[#14f195] hover:underline"
                  href={xLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @{xName}
                </a>
              </div>
            )}
          </div>

          {bio && (
            <div className="max-w-none leading-relaxed">
              <p className="text-p text-white/70">{bio}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
