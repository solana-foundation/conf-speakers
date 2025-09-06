export type StageTitle = "Stage A" | "Stage B";

export const stageColorMap: Record<StageTitle, string> = {
  "Stage A": "bg-azure",
  "Stage B": "bg-lime",
};

export function getStageBadgeClass(title: string): string {
  return stageColorMap[title as StageTitle] || "bg-primary";
}
