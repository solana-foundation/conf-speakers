import * as React from "react";
import { Button } from "@/components/ui/button";
import { Check, CircleMinus, Info, X } from "lucide-react";

interface ActionsChecklistProps {
  sessions?: Array<{
    id: string;
    name: string;
    deckStatus?: string;
  }>;
  dietaryStatus?: string;
  speakerTelegramGroup?: string;
  telegramGroups?: Array<{
    sessionName: string;
    telegramGroup: string;
  }>;
  speakerPermitApproval?: string;
}

export default function ActionsChecklist({
  sessions = [],
  dietaryStatus = "To Do",
  telegramGroups = [],
  speakerPermitApproval,
}: ActionsChecklistProps) {
  // Helper function to determine status based on approval value
  const getApprovalStatus = (approval?: string): "approved" | "pending" | "declined" => {
    if (approval === "approved") return "approved";
    if (approval === "denied") return "declined";
    return "pending"; // null or any other value
  };

  // Create deck upload tasks for each session
  const deckTasks = sessions.map((session) => ({
    id: `upload-deck-${session.id}`,
    title: `Deck received by Events Team - ${session.name}`,
    description: "Use 16:9 aspect, embed fonts, and export a PDF as backup.",
    status: session.deckStatus === "Completed" ? "approved" : "todo",
    link: "#",
    linkText: "Upload Deck",
    type: "task" as const,
  }));

  const tasks = [
    ...deckTasks,
    {
      id: "content-dietary-form",
      title: "On‑stage Content & Dietary Form",
      description: "Share any content caveats and dietary needs.",
      status: dietaryStatus === "Completed" ? "approved" : "todo",
      link: "#",
      linkText: "Fill Form",
      type: "task" as const,
    },
    {
      id: "speaker-permit-approval",
      title: "Speaker Permit Approval",
      description: "Required for international speakers or work authorization.",
      status: getApprovalStatus(speakerPermitApproval),
      link: null,
      linkText: null,
      type: "task" as const,
    },
    {
      id: "stage-team-questions",
      title: "Questions for Stage Team",
      description: "Email: events@solana.org. DMs okay during event week.",
      status: "pending" as const,
      link: null,
      linkText: null,
      type: "info" as const,
    },
    // Add session-specific Telegram groups
    ...telegramGroups.map((group, index) => ({
      id: `telegram-group-${index}`,
      title: `Join ${group.sessionName} Telegram Group (optional)`,
      description: "Casual updates and coordination with fellow speakers.",
      status: "approved" as const,
      link: group.telegramGroup,
      linkText: "Open Group",
      type: "info" as const,
    })),
  ];

  const getTaskIcon = (task: (typeof tasks)[0]) => {
    if (task.type === "info") {
      return <Info className="text-azure h-5 w-5" />;
    }
    if (task.status === "approved") {
      return <Check className="h-5 w-5 text-green-600" />;
    }
    if (task.status === "declined") {
      return <X className="h-5 w-5 text-red-500" />;
    }
    if (task.status === "todo") {
      return <CircleMinus className="h-5 w-5 text-red-500" />;
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
                : task.status === "approved"
                  ? "border-stroke-mint/30"
                  : task.status === "declined"
                    ? "border-red-300"
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
                  {task.type === "task" && task.status === "approved" && (
                    <span className="bg-mint rounded-full px-2 py-0.5 font-mono text-[12px] text-black">Approved</span>
                  )}
                  {task.type === "task" && task.status === "todo" && (
                    <span className="bg-azure rounded-full px-2 py-0.5 font-mono text-[12px] text-black">To Do</span>
                  )}
                  {task.type === "task" && task.status === "pending" && (
                    <span className="bg-azure rounded-full px-2 py-0.5 font-mono text-[12px] text-black">Pending</span>
                  )}
                  {task.type === "task" && task.status === "declined" && (
                    <span className="rounded-full bg-red-500 px-2 py-0.5 font-mono text-[12px] text-white">
                      Declined
                    </span>
                  )}
                </div>
                {task.link && task.linkText && (task.status !== "approved" || task.type === "info") && (
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
