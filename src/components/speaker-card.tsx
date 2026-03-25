import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Twitter, Check, CircleMinus, Clock } from "lucide-react";
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

    if (hasDoNotPublishSession && sessions.some((session) => session.greenlightTime)) {
      badges.push({
        label: "Schedule Pending",
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
    if (badges.length === 0 && sessions.length > 0 && allCompletedSessions.length === sessions.length) {
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
    <div>
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <div className="flex flex-col items-center gap-4 lg:items-start">
          <div className="relative">
            <div className="rounded-[48px] p-[2px]" style={{ background: "linear-gradient(135deg, #9945ff, #19fb9b, #00d4ff)" }}>
              <Avatar className="size-24 rounded-[46px] lg:size-32">
                {imageUrl && <AvatarImage src={imageUrl} alt={`${firstName} ${lastName}`} />}
                <AvatarFallback className="rounded-[46px] bg-[#0d0d0d] text-3xl font-semibold text-white">
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
              className="flex items-center text-xs text-[#9945ff] underline transition-colors hover:text-[#19fb9b]"
            >
              Social Media Card
            </a>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="gradient-text font-space-grotesk text-4xl font-light tracking-tight">
                {firstName} {lastName}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                {statusBadges.map((badge, index) => (
                  <Badge
                    key={index}
                    className={`gap-1.5 ${
                      badge.variant === "awaiting-deck"
                        ? "bg-[#2a88de] text-white"
                        : badge.variant === "schedule-pending"
                          ? "bg-[#c9ff7c] text-black"
                          : "bg-[#19fb9b] text-black"
                    }`}
                  >
                    {badge.icon}
                    <span>{badge.label}</span>
                  </Badge>
                ))}
              </div>
            </div>
            <p className="text-p2-mono mt-2 uppercase">
              {jobTitle && <span className="text-white/70">{jobTitle}</span>}
              <br />
              {company && <span className="text-white/50">{company}</span>}
            </p>

            {xLink && (
              <div className="mt-2 flex items-center gap-2">
                <Twitter className="h-4 w-4 text-white/40" />
                <a
                  className="text-[#9945ff] text-md transition-colors hover:text-[#19fb9b] hover:underline"
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
    </div>
  );
}
