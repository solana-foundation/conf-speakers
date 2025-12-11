import * as React from "react";
import { Button } from "@/components/ui/button";
import { Check, CircleMinus, Film, Info, X } from "lucide-react";
import { DeckStatus } from "@/lib/airtable/types";

interface ActionsChecklistProps {
  sessions?: Array<{
    id?: string;
    name?: string;
    actionsDeckReceived?: DeckStatus | null;
  }>;
  dietaryStatus?: string | null;
  speakerPermitApproval?: string;
  slideDeckFile?: string | null;
  speakerTicketLink?: string | null;
  plusOneTicketLink?: string | null;
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
  speakerPermitApproval,
  slideDeckFile,
  speakerTicketLink,
  plusOneTicketLink,
  discountCode,
  mcInfo,
  parkingTicketUrl,
  youtubeVideoUrl,
  speakerPhotoLink,
}: ActionsChecklistProps) {
  // Helper function to determine status based on approval value
  const getApprovalStatus = (approval?: string): "Approved" | "Denied" | "Pending" => {
    if (approval === "Approved") return "Approved";
    if (approval === "Denied") return "Denied";
    return "Pending";
  };

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
    const encodedCode = encodeURIComponent(plusOneTicketLink);
    const plusOneUrl = `https://luma.com/breakpoint2025?coupon=${encodedCode}`;
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

  // Discount Codes - single action item with list of codes
  const discountCodes = parseDiscountCodes(discountCode);
  if (discountCodes.length > 0) {
    ticketTasks.push({
      id: "discount-codes",
      title: "25% Discount Codes",
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
      description: "Access your parking pass for the Etihad Arena.",
      status: "approved" as const,
      link: "https://drive.google.com/file/d/1CcH_qpYcrK_9QhRWBIXxMleZ12FfeyXH/view",
      linkText: "View Parking Pass",
      type: "info" as const,
    });
  }

  // Media Links - combined info box for YouTube video and speaker photo
  const mediaLinks: MediaLink[] = [];
  if (youtubeVideoUrl) {
    mediaLinks.push({ label: "Speaker Videos", url: youtubeVideoUrl });
  }
  if (speakerPhotoLink) {
    mediaLinks.push({ label: "Speaker Photos", url: speakerPhotoLink });
  }
  if (mediaLinks.length > 0) {
    ticketTasks.push({
      id: "media-links",
      title: "Media",
      description: "Your speaker media from Breakpoint.",
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

      // Determine link based on deck status:
      // - ToUpload: Show upload link so user can upload their deck
      // - Uploaded: Show link in case user needs to re-upload
      // - Approved: No link needed, deck is finalized
      // - null/undefined: Filtered out above
      const getDeckLink = (): string | null => {
        if (isApproved) return null;
        // For ToUpload and Uploaded states, show link only if available
        return slideDeckFile || null;
      };

      return {
        id: `upload-deck-${session.id}`,
        title: `Deck upload status for - ${session.name}`,
        description:
          "Use 16:9 aspect, embed fonts, and upload as Keynote or Powerpoint file. Upload any video files seperately.",
        status,
        link: getDeckLink(),
        linkText: getDeckLink() ? "Deck Files Dropbox" : null,
        type: "task" as const,
      };
    });

  const tasks: Task[] = [
    ...deckTasks,
    ...ticketTasks,
    {
      id: "speaker-permit-approval",
      title: "Speaker Permit Approval",
      description: "We're arranging this for you with UAE government. Contact us if you have any questions.",
      status: getApprovalStatus(speakerPermitApproval),
      link: null,
      linkText: null,
      type: "task" as const,
    },
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
      description: "Email: speakers@solana.org",
      status: "pending" as const,
      link: null,
      linkText: null,
      type: "info" as const,
    },
  ];

  const getTaskIcon = (task: Task) => {
    if (task.type === "info") {
      return <Info className="text-azure h-5 w-5" />;
    }
    if (task.type === "media") {
      return <Film className="text-byte h-5 w-5" />;
    }
    if (task.status === "approved" || task.status === "Approved") {
      return <Check className="h-5 w-5 text-green-600" />;
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
      <h3 className="h5 uppercase">Actions Checklist</h3>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-start gap-3 rounded-lg border p-3 ${
              task.type === "info"
                ? "bg-azure/10 border-0"
                : task.status === "Denied"
                  ? "border-red-500"
                  : task.status === "todo"
                    ? "border-stroke-primary"
                    : "border-stroke-primary"
            }`}
          >
            <div className="flex items-start justify-center">{getTaskIcon(task)}</div>
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h4 className={"h4"}>{task.title}</h4>
                  {task.type === "task" && (task.status === "approved" || task.status === "Approved") && (
                    <span className="rounded-full bg-green-500 px-2 py-0.5 font-mono text-[12px] text-white">
                      Approved
                    </span>
                  )}
                  {task.type === "task" && task.status === "todo" && (
                    <span className="bg-azure rounded-full px-2 py-0.5 font-mono text-[12px] text-black">To Do</span>
                  )}
                  {task.type === "task" && (task.status === "pending" || task.status === "Pending") && (
                    <span className="rounded-full bg-yellow-500 px-2 py-0.5 font-mono text-[12px] text-black">
                      Pending
                    </span>
                  )}
                  {task.type === "task" && task.status === "Denied" && (
                    <span className="rounded-full bg-red-500 px-2 py-0.5 font-mono text-[12px] text-white">
                      Declined
                    </span>
                  )}
                </div>
                {task.link && task.linkText && (
                  <Button size="sm" variant="azure" asChild>
                    <a target="_blank" rel="noopener noreferrer" href={task.link}>
                      {task.linkText}
                    </a>
                  </Button>
                )}
              </div>
              <p className={`text-muted-foreground text-sm`}>{task.description}</p>
              {task.codes && task.codes.length > 0 && (
                <ul className="text-muted-foreground mt-2 space-y-1 text-sm">
                  {task.codes.map((code: string, index: number) => {
                    const encodedCode = encodeURIComponent(code);
                    const lumaUrl = `https://luma.com/breakpoint2025?coupon=${encodedCode}`;
                    return (
                      <li key={index} className="font-mono">
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={lumaUrl}
                          className="text-azure hover:underline"
                        >
                          {code}
                        </a>
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
                        className="text-azure hover:underline"
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
