import { StageTitle } from "@/lib/airtable/types";
import { normalizeStageTitle } from "@/lib/airtable/stages";
import { Badge } from "./ui/badge";

export const stageColorMap: Record<string, string> = {
  "Main Stage": "bg-[#3c91ff]/20 text-[#3c91ff]",
  "Side Stage": "bg-[#c0e021]/20 text-[#c0e021]",
  "Lounge Stage": "bg-[#aa67fb]/20 text-[#aa67fb]",
  "Arena Stage": "bg-[#14f195]/20 text-[#14f195]",
};

export function getStageBadgeClass(title: string): string {
  return stageColorMap[normalizeStageTitle(title) ?? ""] || "bg-[#aa67fb]/20 text-[#aa67fb]";
}

export default function StageBadge({ title }: { title: StageTitle | undefined }) {
  const stageTitle = normalizeStageTitle(title);

  return <Badge className={`${getStageBadgeClass(stageTitle ?? "")} font-mono text-[12px]`}>{stageTitle}</Badge>;
}
