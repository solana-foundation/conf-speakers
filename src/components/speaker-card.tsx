import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export interface SpeakerCardProps {
  imageUrl?: string;
  firstName?: string;
  lastName: string;
  jobTitle?: string;
  company?: string;
  bio?: string;
  xLink?: string;
  xName?: string;
  subscribeUrl?: string;
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
}: SpeakerCardProps) {
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
              <p className="text-sm">{bio}</p>
            </div>
          )}

          {xLink && (
            <div className="flex gap-1">
              <p className="text-foreground/50 m-0 mb-1 text-sm">X Link:</p>
              <a
                className="text-primary text-sm hover:underline"
                href={xLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                @{xName}
              </a>
            </div>
          )}

          {subscribeUrl && (
            <div>
              <p>
                <Button size="sm" asChild>
                  <a href={subscribeUrl} target="_blank" rel="noopener noreferrer">
                    Subscribe to {firstName} {lastName}&apos;s sessions
                  </a>
                </Button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
