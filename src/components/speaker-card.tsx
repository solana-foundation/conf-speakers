import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { generateKey } from "@/lib/sign.server";
import { getSessionsCalendarUrl } from "@/lib/ics/utils";
import { Separator } from "./ui/separator";

export interface SpeakerCardProps {
  imageUrl?: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  company?: string;
  bio?: string;
  xLink?: string;
  xName?: string;
  subscribeUrl?: string;
  status?: "awaiting-deck" | "all-set" | "schedule-pending";
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
  subscribeUrl,
  status = "awaiting-deck",
}: SpeakerCardProps) {
  // Status badge configuration
  const getStatusConfig = (status?: string) => {
    switch (status) {
      case "awaiting-deck":
        return { label: "Awaiting deck", variant: "secondary" as const };
      case "all-set":
        return { label: "All set", variant: "default" as const };
      case "schedule-pending":
        return { label: "Schedule pending", variant: "outline" as const };
      default:
        return null;
    }
  };
  const calendarKey = generateKey(Date.now() + Number(process.env.NEXT_PUBLIC_KEY_EXP ?? 0), "ics");
  const calendarUrl = getSessionsCalendarUrl(calendarKey);

  const statusConfig = getStatusConfig(status);

  return (
    <div>
      {/* Status Badge Banner - moved to top */}
      {statusConfig && (
        <>
          <div className="mb-6 w-full">
            <div
              className={`text-md w-full rounded-lg border-2 px-6 py-2 text-center font-semibold ${
                statusConfig.variant === "secondary"
                  ? "bg-secondary text-secondary-foreground border-secondary"
                  : statusConfig.variant === "default"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border"
              }`}
            >
              {statusConfig.label}
            </div>
          </div>
          <Separator className="my-4" />
        </>
      )}

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
            <h1 className="text-3xl font-semibold tracking-tight">
              {firstName} {lastName}
            </h1>
            <p className="text-p2-mono mt-2 uppercase">
              {jobTitle && <span className="text-foreground/80 mt-2">{jobTitle}</span>}
              <br />
              {company && <span className="text-wisp/80">{company}</span>}
            </p>
          </div>

          {bio && (
            <div className="max-w-none leading-relaxed">
              <p className="text-p">{bio}</p>
            </div>
          )}

          {xLink && (
            <div className="flex gap-1">
              <p className="text-foreground/50 text-md m-0 mb-1">X Link:</p>
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

          <div className="flex gap-2">
            {/* Primary CTA Button - Add All Sessions to Calendar */}
            {calendarUrl && (
              <Button size="lg" variant="mint" asChild className="w-full lg:w-auto">
                <a href={calendarUrl} target="_blank" rel="noopener noreferrer">
                  + Add My Sessions to Calendar
                </a>
              </Button>
            )}

            {/* Keep existing subscribe button as secondary option */}
            {subscribeUrl && (
              <Button size="lg" variant="mint" asChild className="w-full lg:w-auto">
                <a href={subscribeUrl} target="_blank" rel="noopener noreferrer">
                  + Add All BP25 Sessions to Calendar
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
