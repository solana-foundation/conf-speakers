import { StageTitle } from "@/lib/airtable/types";
import { normalizeStageTitle } from "@/lib/airtable/stages";
import { Badge } from "./ui/badge";

export const stageColorMap: Record<string, string> = {
  "Main Stage": "bg-[#2a88de]/20 text-[#2a88de]",
  "Side Stage": "bg-[#c9ff7c]/20 text-[#c9ff7c]",
  "Lounge Stage": "bg-[#9945ff]/20 text-[#9945ff]",
  "Arena Stage": "bg-[#19fb9b]/20 text-[#19fb9b]",
};

export function getStageBadgeClass(title: string): string {
  return stageColorMap[normalizeStageTitle(title) ?? ""] || "bg-[#9945ff]/20 text-[#9945ff]";
}

export default function StageBadge({ title }: { title: StageTitle | undefined }) {
  const stageTitle = normalizeStageTitle(title);

  return <Badge className={`${getStageBadgeClass(stageTitle ?? "")} font-mono text-[12px]`}>{stageTitle}</Badge>;
}
