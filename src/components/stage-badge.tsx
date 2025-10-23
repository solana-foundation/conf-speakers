import { Badge } from "./ui/badge";

export type StageTitle = "Main Stage" | "Side Stage";

export const stageColorMap: Record<StageTitle, string> = {
  "Main Stage": "bg-azure",
  "Side Stage": "bg-lime",
};

export function getStageBadgeClass(title: string): string {
  return stageColorMap[title as StageTitle] || "bg-primary";
}

export default function StageBadge({ title }: { title: StageTitle }) {
  return <Badge className={`${getStageBadgeClass(title)} rounded-full font-mono text-[12px]`}>{title}</Badge>;
}
