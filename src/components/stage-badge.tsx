import { StageTitle } from "@/lib/airtable/types";
import { Badge } from "./ui/badge";

export const stageColorMap: Record<string, string> = {
  "Absolute Cinema": "bg-[#2a88de] text-white",
  "Lock In": "bg-[#c9ff7c] text-black",
  "Cafe del Mar": "bg-[#9945ff] text-white",
  "Etihad Arena": "bg-[#19fb9b] text-black",
  "Main Stage": "bg-[#2a88de] text-white",
};

export function getStageBadgeClass(title: string): string {
  return stageColorMap[title] || "bg-[#9945ff] text-white";
}

export default function StageBadge({ title }: { title: StageTitle | undefined }) {
  return <Badge className={`${getStageBadgeClass(title ?? "")} rounded-full font-mono text-[12px]`}>{title}</Badge>;
}
