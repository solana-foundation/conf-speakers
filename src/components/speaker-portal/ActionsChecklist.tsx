import * as React from "react";
import { Button } from "@/components/ui/button";
import { Check, CircleMinus, Film, Info, X } from "@/components/ui/icons";
import { DeckStatus } from "@/lib/airtable/types";
import { buildEventCouponUrl, EVENT_REGISTRATION_PLATFORM, SPEAKER_CONTACT_EMAIL } from "@/lib/site";

interface ActionsChecklistProps {
  sessions?: Array<{
    id?: string;
    name?: string;
    actionsDeckReceived?: DeckStatus | null;
  }>;
  dietaryStatus?: string | null;
  slideDeckFile?: string | null;
  speakerTicketLink?: string | null;
  plusOneTicketLink?: string | null;
  invitationCode?: string | null;
  discountCode?: string | null;
  mcInfo?: string | null;
  parkingTicketUrl?: string | null;
  youtubeVideoUrl?: string | null;
  speakerPhotoLink?: string | null;
}

type TaskStatus = "approved" | "todo" | "pending" | "Approved" | "Denied" | "Pending";

type MediaLink = {
  label: string;
  url: string;
};

type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  link: string | null;
  linkText: string | null;
  type: "task" | "info" | "media";
  codes?: string[];
  mediaLinks?: MediaLink[];
};

export default function ActionsChecklist({
  sessions = [],
  dietaryStatus,
  slideDeckFile,
  speakerTicketLink,
  plusOneTicketLink,
  invitationCode,
  discountCode,
  mcInfo,
  parkingTicketUrl,
  youtubeVideoUrl,
  speakerPhotoLink,
}: ActionsChecklistProps) {
  // Helper function to get dietary description
  const getDietaryDescription = (): string => {
    if (!dietaryStatus || dietaryStatus.toLowerCase() === "none") {
      return "No requirements";
    }
    return dietaryStatus;
  };

  // Parse discount codes from comma-separated string
  const parseDiscountCodes = (codes?: string | null): string[] => {
    if (!codes) return [];
    return codes
      .split(",")
      .map((code) => code.trim())
      .filter((code) => code.length > 0);
  };

  // Parse comma-separated URLs
  const parseUrls = (urls?: string | null): string[] => {
    if (!urls) return [];
    return urls
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url.length > 0);
  };

  // Create ticket tasks
  const ticketTasks = [];

  // Speaker Ticket
  if (speakerTicketLink) {
    ticketTasks.push({
      id: "speaker-ticket",
      title: "Speaker Ticket",
      description: "You can open your ticket QR code directly from the button.",
      status: "approved" as const,
      link: speakerTicketLink,
      linkText: "Open Ticket",
      type: "task" as const,
    });
  }

  // Plus One Ticket
  if (plusOneTicketLink) {
    const plusOneUrl = buildEventCouponUrl(plusOneTicketLink) ?? plusOneTicketLink;
    ticketTasks.push({
      id: "plus-one-ticket",
      title: "Plus One Ticket",
      description: "Use this link to claim your plus-one ticket.",
      status: "approved" as const,
      link: plusOneUrl,
      linkText: "Claim Plus One Ticket",
      type: "task" as const,
    });
  }

  if (invitationCode) {
    ticketTasks.push({
      id: "invitation-code",
      title: "Invitation Code",
      description: `Use this code during checkout on ${EVENT_REGISTRATION_PLATFORM}.`,
      status: "approved" as const,
      link: null,
      linkText: null,
      type: "task" as const,
      codes: [invitationCode],
    });
  }

  // Discount Codes - single action item with list of codes
  const discountCodes = parseDiscountCodes(discountCode);
  if (discountCodes.length > 0) {
    ticketTasks.push({
      id: "discount-codes",
      title: "Discount Codes",
      description: "Use these discount codes when purchasing tickets.",
      status: "approved" as const,
      link: null,
      linkText: null,
      type: "task" as const,
      codes: discountCodes,
    });
  }

  // MC Info - Google Doc link
  if (mcInfo) {
    ticketTasks.push({
      id: "mc-info",
      title: "MC Information",
      description: "Important logistics, venue locations, and guidelines for you as a MC.",
      status: "approved" as const,
      link: mcInfo,
      linkText: "View MC Info",
      type: "info" as const,
    });
  }

  // Parking Ticket - only shows if the URL field exists
  if (parkingTicketUrl) {
    ticketTasks.push({
      id: "parking-ticket",
      title: "Parking Access Ticket",
      description: "Access your event parking pass.",
      status: "approved" as const,
      link: parkingTicketUrl,
      linkText: "View Parking Pass",
      type: "info" as const,
    });
  }

  // Media Links - combined info box for YouTube video and speaker photo
  // Supports comma-separated URLs for multiple links
  const mediaLinks: MediaLink[] = [];
  const youtubeUrls = parseUrls(youtubeVideoUrl);
  const photoUrls = parseUrls(speakerPhotoLink);

  youtubeUrls.forEach((url, index) => {
    const label = youtubeUrls.length > 1 ? `Speaker Video ${index + 1}` : "Speaker Video";
    mediaLinks.push({ label, url });
  });
  photoUrls.forEach((url, index) => {
    const label = photoUrls.length > 1 ? `Speaker Photos ${index + 1}` : "Speaker Photos";
    mediaLinks.push({ label, url });
  });
  if (mediaLinks.length > 0) {
    ticketTasks.push({
      id: "media-links",
      title: "Media",
      description: "Your speaker media for this event.",
      status: "approved" as const,
      link: null,
      linkText: null,
      type: "media" as const,
      mediaLinks,
    });
  }

  // Create deck upload tasks for each session
  // States: null, DeckStatus.ToUpload, DeckStatus.Uploaded, DeckStatus.Approved
  // Show tasks for all states except null
  const deckTasks = sessions
    .filter((session) => session.actionsDeckReceived !== null && session.actionsDeckReceived !== undefined)
    .map((session) => {
      const deckStatus = session.actionsDeckReceived;
      const isApproved = deckStatus === DeckStatus.Approved;
      const isUploaded = deckStatus === DeckStatus.Uploaded;

      // Determine task status
      let status: "approved" | "todo" | "pending";
      if (isApproved) {
        status = "approved";
      } else if (isUploaded) {
        status = "pending"; // Uploaded but awaiting approval
      } else {
        status = "todo"; // DeckStatus.ToUpload
      }

      const deckLink = isApproved
        ? null
        : slideDeckFile ||
          `mailto:${SPEAKER_CONTACT_EMAIL}?subject=${encodeURIComponent(`Deck upload link for ${session.name ?? "my session"}`)}`;

      return {
        id: `upload-deck-${session.id}`,
        title: `Deck: ${session.name ?? "Your session"}`,
        description: isApproved
          ? "Your deck is approved."
          : slideDeckFile
            ? isUploaded
              ? "Your deck is awaiting review. Use the link if you need to replace it."
              : "Upload your deck using the link provided by the speaker team."
            : "The upload link is not available yet. Ask the speaker team for it.",
        status,
        link: deckLink,
        linkText: deckLink ? (slideDeckFile ? "Open upload link" : "Ask for upload link") : null,
        type: "task" as const,
      };
    });

  const tasks: Task[] = [
    ...deckTasks,
    ...ticketTasks,
    {
      id: "dietary-requirements",
      title: "Your Dietary Requirements",
      description: getDietaryDescription(),
      status: "approved" as const,
      link: null,
      linkText: null,
      type: "info" as const,
    },
    {
      id: "stage-team-questions",
      title: "Questions",
      description: "Contact the speaker team about your session or event day.",
      status: "pending" as const,
      link: `mailto:${SPEAKER_CONTACT_EMAIL}`,
      linkText: "Email speaker team",
      type: "info" as const,
    },
  ];

  const getTaskIcon = (task: Task) => {
    if (task.type === "info") {
      return <Info className="h-5 w-5 text-[#3c91ff]" />;
    }
    if (task.type === "media") {
      return <Film className="h-5 w-5 text-[#aa67fb]" />;
    }
    if (task.status === "approved" || task.status === "Approved") {
      return <Check className="h-5 w-5 text-[#14f195]" />;
    }
    if (task.status === "Denied") {
      return <X className="h-5 w-5 text-red-500" />;
    }
    if (task.status === "todo") {
      return <CircleMinus className="h-5 w-5 text-red-500" />;
    }
    if (task.status === "Pending") {
      return <CircleMinus className="h-5 w-5 text-yellow-500" />;
    }
    return <CircleMinus className="h-5 w-5 text-yellow-500" />;
  };

  return (
    <div className="space-y-4">
      <h3 className="font-space-grotesk text-sm font-semibold tracking-[0.15em] text-white/60 uppercase">
        Actions Checklist
      </h3>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-start gap-3 rounded-lg border p-3 ${
              task.type === "info"
                ? "border-[#3c91ff]/20 bg-[#3c91ff]/5"
                : task.status === "Denied"
                  ? "border-red-500/30 bg-red-500/5"
                  : "border-white/10 bg-white/[0.02]"
            }`}
          >
            <div className="flex items-start justify-center">{getTaskIcon(task)}</div>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-col items-start gap-2 sm:flex-row sm:justify-between">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <h4 className={"h4"}>{task.title}</h4>
                  {task.type === "task" && (task.status === "approved" || task.status === "Approved") && (
                    <span className="rounded-full bg-[#14f195]/20 px-2.5 py-0.5 font-mono text-[12px] tracking-wider text-[#14f195] uppercase">
                      Approved
                    </span>
                  )}
                  {task.type === "task" && task.status === "todo" && (
                    <span className="rounded-full bg-[#3c91ff]/20 px-2.5 py-0.5 font-mono text-[12px] tracking-wider text-[#3c91ff] uppercase">
                      To Do
                    </span>
                  )}
                  {task.type === "task" && (task.status === "pending" || task.status === "Pending") && (
                    <span className="rounded-full bg-[#c0e021]/20 px-2.5 py-0.5 font-mono text-[12px] tracking-wider text-[#c0e021] uppercase">
                      Pending
                    </span>
                  )}
                  {task.type === "task" && task.status === "Denied" && (
                    <span className="rounded-full bg-red-500/20 px-2.5 py-0.5 font-mono text-[12px] tracking-wider text-red-400 uppercase">
                      Declined
                    </span>
                  )}
                </div>
                {task.link && task.linkText && (
                  <Button size="sm" variant="azure" className="max-w-full shrink-0" asChild>
                    <a target="_blank" rel="noopener noreferrer" href={task.link}>
                      {task.linkText}
                    </a>
                  </Button>
                )}
              </div>
              <p className="text-sm text-white/50">{task.description}</p>
              {task.codes && task.codes.length > 0 && (
                <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
                  {task.codes.map((code: string, index: number) => {
                    const couponUrl = buildEventCouponUrl(code);
                    return (
                      <li key={index} className="font-mono">
                        {couponUrl ? (
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={couponUrl}
                            className="text-[#aa67fb] transition-colors hover:text-[#14f195] hover:underline"
                          >
                            {code}
                          </a>
                        ) : (
                          <span title={`Use this code during checkout on ${EVENT_REGISTRATION_PLATFORM}`}>{code}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
              {task.mediaLinks && task.mediaLinks.length > 0 && (
                <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
                  {task.mediaLinks.map((mediaLink: MediaLink, index: number) => (
                    <li key={index}>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={mediaLink.url}
                        className="text-[#aa67fb] transition-colors hover:text-[#14f195] hover:underline"
                      >
                        {mediaLink.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
