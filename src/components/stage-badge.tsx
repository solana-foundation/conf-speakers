import { StageTitle } from "@/lib/airtable/types";
import { Badge } from "./ui/badge";

export const stageColorMap: Record<StageTitle, string> = {
  "Absolute Cinema": "bg-azure",
  "Lock In": "bg-lime",
};

export function getStageBadgeClass(title: string): string {
  return stageColorMap[title as StageTitle] || "bg-primary";
}

export default function StageBadge({ title }: { title: StageTitle | undefined }) {
  return <Badge className={`${getStageBadgeClass(title ?? "")} rounded-full font-mono text-[12px]`}>{title}</Badge>;
}
