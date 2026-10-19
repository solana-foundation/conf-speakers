import { StageTitle } from "@/lib/airtable/types";
import { normalizeStageTitle } from "@/lib/airtable/stages";
import { Badge } from "./ui/badge";

export default function StageBadge({ title }: { title: StageTitle | undefined }) {
  const stageTitle = normalizeStageTitle(title);

  return <Badge className="text-white">{stageTitle ?? "To be confirmed"}</Badge>;
}
