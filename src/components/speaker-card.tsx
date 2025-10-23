import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Twitter } from "lucide-react";

export interface SpeakerCardProps {
  imageUrl?: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  company?: string;
  bio?: string;
  xLink?: string;
  xName?: string;
  status?: "awaiting-deck" | "all-set" | "schedule-pending";
  dueDate?: string;
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
  status = "awaiting-deck",
  dueDate = "10 Nov, 2025",
}: SpeakerCardProps) {
  const getStatusConfig = (status?: string, dueDate?: string) => {
    switch (status) {
      case "awaiting-deck":
        return {
          label: "Awaiting deck",
          variant: "urgent" as const,
          dueDate: dueDate ? `Due: ${dueDate}` : undefined,
        };
      case "all-set":
        return {
          label: "All set",
          variant: "default" as const,
          dueDate: dueDate ? `Due: ${dueDate}` : undefined,
        };
      case "schedule-pending":
        return {
          label: "Schedule pending",
          variant: "warning" as const,
          dueDate: dueDate ? `Due: ${dueDate}` : undefined,
        };
      default:
        return null;
    }
  };

  const statusConfig = getStatusConfig(status, dueDate);

  return (
    <div>
      {/* Status Badge Banner - moved to top */}
      {statusConfig && (
        <>
          <div className="mb-6 w-full">
            <div
              className={`text-md w-full rounded-lg px-6 py-2 text-center font-semibold ${
                statusConfig.variant === "urgent"
                  ? "bg-red-500 text-black"
                  : statusConfig.variant === "warning"
                    ? "bg-lime text-black"
                    : statusConfig.variant === "default"
                      ? "bg-mint text-black"
                      : "bg-background text-primary border-0"
              }`}
            >
              <span>{statusConfig.label}</span>
              {statusConfig.dueDate && (
                <span className="ml-2 text-sm font-normal opacity-80">{statusConfig.dueDate}</span>
              )}
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
