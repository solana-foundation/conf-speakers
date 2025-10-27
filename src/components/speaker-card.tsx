import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Twitter, Check, CircleMinus, Clock } from "lucide-react";

export interface SpeakerCardProps {
  imageUrl?: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  company?: string;
  bio?: string;
  xLink?: string;
  xName?: string;
  // ActionsChecklist data
  sessions?: Array<{
    id: string;
    name: string;
    deckStatus?: string;
    greenlightTime?: string;
  }>;
  dietaryStatus?: string;
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
  sessions = [],
  dietaryStatus = "To Do",
}: SpeakerCardProps) {
  const getStatusBadges = (): StatusBadge[] => {
    const badges: StatusBadge[] = [];

    // Check for awaiting deck status (multiple sessions)
    const awaitingDeckSessions = sessions.filter((session) => session.deckStatus !== "Completed");
    if (awaitingDeckSessions.length > 0) {
      badges.push({
        label: `Awaiting Deck${awaitingDeckSessions.length > 1 ? ` (${awaitingDeckSessions.length})` : ""}`,
        variant: "awaiting-deck",
        icon: <CircleMinus className="h-3 w-3" />,
      });
    }

    // Check for schedule pending (if greenlightTime is true)
    if (sessions.some((session) => session.greenlightTime && session.greenlightTime !== "Completed")) {
      badges.push({
        label: "Schedule Pending",
        variant: "schedule-pending",
        icon: <Clock className="h-3 w-3" />,
      });
    }

    // If no other badges, show "All Set"
    if (badges.length === 0) {
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
            <Avatar className="size-24 lg:size-32">
              {imageUrl && <AvatarImage src={imageUrl} alt={`${firstName} ${lastName}`} />}
              <AvatarFallback className="text-3xl font-semibold">
                {firstName?.charAt(0)}
                {lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight">
                {firstName} {lastName}
              </h1>
              {/* Inline Status Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {statusBadges.map((badge, index) => (
                  <Badge
                    key={index}
                    className={`gap-1.5 ${
                      badge.variant === "awaiting-deck"
                        ? "bg-azure text-black"
                        : badge.variant === "schedule-pending"
                          ? "bg-lime text-black"
                          : "bg-mint text-mint-foreground"
                    }`}
                  >
                    {badge.icon}
                    <span>{badge.label}</span>
                  </Badge>
                ))}
              </div>
            </div>
            <p className="text-p2-mono mt-2 uppercase">
              {jobTitle && <span className="text-foreground/80 mt-2">{jobTitle}</span>}
              <br />
              {company && <span className="text-wisp/80">{company}</span>}
            </p>

            {xLink && (
              <div className="mt-2 flex items-center gap-2">
                <Twitter className="text-foreground/50 h-4 w-4" />
                <a
                  className="text-primary text-md hover:underline"
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
              <p className="text-p">{bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
