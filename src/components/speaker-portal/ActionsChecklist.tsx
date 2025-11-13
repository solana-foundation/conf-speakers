import * as React from "react";
import { Button } from "@/components/ui/button";
import { Check, CircleMinus, Info, X } from "lucide-react";
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
}

export default function ActionsChecklist({
  sessions = [],
  dietaryStatus,
  speakerPermitApproval,
  slideDeckFile,
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

      return {
        id: `upload-deck-${session.id}`,
        title: `Deck upload status for - ${session.name}`,
        description:
          "Use 16:9 aspect, embed fonts, and upload as Keynote or Powerpoint file. Upload any video files seperately.",
        status,
        link: isApproved ? null : slideDeckFile || "#",
        linkText: isApproved ? null : "Deck Files Dropbox",
        type: "task" as const,
      };
    });

  const tasks = [
    ...deckTasks,
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
    {
      id: "tickets-pending",
      title: "Tickets Pending",
      description: "All speaker and plus-one tickets are pending. Please wait for confirmation.",
      status: "pending" as const,
      link: null,
      linkText: null,
      type: "info" as const,
    },
  ];

  const getTaskIcon = (task: (typeof tasks)[0]) => {
    if (task.type === "info") {
      return <Info className="text-azure h-5 w-5" />;
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
