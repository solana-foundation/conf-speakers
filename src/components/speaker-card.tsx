import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Twitter } from "@/components/ui/icons";
import { Button } from "./ui/button";
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
      });
    }

    const approvedDeckSessions = sessions.filter((session) => session.actionsDeckReceived === DeckStatus.Approved);
    if (approvedDeckSessions.length > 0) {
      badges.push({
        label: `Approved Deck${approvedDeckSessions.length > 1 ? ` (${approvedDeckSessions.length})` : ""}`,
        variant: "all-set",
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
      });
    }

    return badges;
  };

  const statusBadges = getStatusBadges();

  const markerClass = {
    "awaiting-deck": "bg-[#3c91ff]",
    "schedule-pending": "bg-[#aa67fb]",
    "all-set": "bg-[#14f195]",
  } as const;

  return (
    <section className="border border-[#353535] bg-black p-5 sm:p-8 lg:p-10" aria-label="Your speaker profile">
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8 lg:gap-12">
        <div className="flex shrink-0 flex-col items-start gap-4">
          <Avatar className="size-28 rounded-none sm:size-40 lg:size-[200px]">
            {imageUrl && <AvatarImage src={imageUrl} alt={`${firstName} ${lastName}`} className="object-cover" />}
            <AvatarFallback className="rounded-none bg-[#353535] text-4xl text-white">
              {firstName?.charAt(0)}
              {lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {speakerCardUrl && (
            <Button size="sm" variant="outline" asChild>
              <a href={speakerCardUrl} download target="_blank" rel="noopener noreferrer">
                Social media card
              </a>
            </Button>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
              <h2 className="text-4xl leading-[1.05] tracking-[-0.06rem] text-white sm:text-5xl lg:text-[3.75rem] lg:tracking-[-0.15rem]">
                {firstName} {lastName}
              </h2>
              {statusBadges.length > 0 && (
                <ul className="unstyled-list flex flex-wrap items-center gap-2" aria-label="Your status">
                  {statusBadges.map((badge) => (
                    <li key={badge.variant + badge.label}>
                      <Badge className="gap-2 text-white">
                        <span aria-hidden="true" className={`size-2 shrink-0 ${markerClass[badge.variant]}`} />
                        {badge.label}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {(jobTitle || company) && (
              <p className="breakpoint-eyebrow">
                {company && <span className="text-white">{company}</span>}
                {jobTitle && company && <span className="mx-2 text-[#696969]">/</span>}
                {jobTitle && <span className="text-[#a2a2a2]">{jobTitle}</span>}
              </p>
            )}

            {xLink && (
              <div className="flex items-center gap-2">
                <Twitter className="h-4 w-4 text-[#a2a2a2]" aria-hidden="true" />
                <a
                  className="text-base text-white underline underline-offset-4 transition-colors hover:text-[#aa67fb]"
                  href={xLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @{xName}
                </a>
              </div>
            )}
          </div>

          {bio && <p className="max-w-[48rem] text-base leading-[1.45] text-[#a2a2a2] lg:text-lg">{bio}</p>}
        </div>
      </div>
    </section>
  );
}
