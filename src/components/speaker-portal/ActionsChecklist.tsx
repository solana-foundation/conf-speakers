import * as React from "react";
import { Button } from "@/components/ui/button";
import { Check, CircleMinus, Info } from "lucide-react";

interface ActionsChecklistProps {
  hasSlideDeck?: boolean;
  hasDietaryForm?: boolean;
  telegramGroups?: Array<{
    sessionName: string;
    telegramGroup: string;
  }>;
}

export default function ActionsChecklist({
  hasSlideDeck = false,
  hasDietaryForm = true,
  telegramGroups = [],
}: ActionsChecklistProps) {
  const tasks = [
    {
      id: "upload-deck",
      title: "Deck received by Events Team",
      description: "Use 16:9 aspect, embed fonts, and export a PDF as backup.",
      completed: hasSlideDeck,
      link: "#",
      linkText: "Upload Deck",
      type: "task" as const,
    },
    {
      id: "content-dietary-form",
      title: "On‑stage Content & Dietary Form",
      description: "Share any content caveats and dietary needs.",
      completed: hasDietaryForm,
      link: "#",
      linkText: "Fill Form",
      type: "task" as const,
    },
    {
      id: "stage-team-questions",
      title: "Questions for Stage Team",
      description: "Email: events@solana.org. DMs okay during event week.",
      completed: false,
      link: null,
      linkText: null,
      type: "info" as const,
    },
    ...telegramGroups.map((group, index) => ({
      id: `telegram-group-${index}`,
      title: `Join ${group.sessionName} Telegram Group (optional)`,
      description: "Casual updates and coordination with fellow speakers.",
      completed: true,
      link: group.telegramGroup,
      linkText: "Open Group",
      type: "info" as const,
    })),
  ];

  const getTaskIcon = (task: (typeof tasks)[0]) => {
    if (task.type === "info") {
      return <Info className="text-azure h-5 w-5" />;
    }
    if (task.completed) {
      return <Check className="h-5 w-5 text-green-600" />;
    }
    return <CircleMinus className="h-5 w-5 text-red-500" />;
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
                : task.completed
                  ? "border-stroke-mint/30"
                  : "border-stroke-primary"
            }`}
          >
            <div className="flex items-start justify-center">{getTaskIcon(task)}</div>
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h4 className={"h4"}>{task.title}</h4>
                  {task.type === "task" && task.completed && (
                    <span className="bg-mint rounded-full px-2 py-0.5 font-mono text-[12px] text-black">Completed</span>
                  )}
                  {task.type === "task" && !task.completed && (
                    <span className="bg-azure rounded-full px-2 py-0.5 font-mono text-[12px] text-black">To Do</span>
                  )}
                </div>
                {task.link && task.linkText && (!task.completed || task.type === "info") && (
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
