import * as React from "react";
import Section from "./Section";
import InfoDialog from "./InfoDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function Row({ label, trailing }: { label: React.ReactNode; trailing: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b py-3 first:pt-0 last:border-b-0 last:pb-0">
      <div className="flex items-center gap-2 text-sm font-medium">{label}</div>
      <div className="shrink-0">{trailing}</div>
    </div>
  );
}

export default function ActionsSection() {
  return (
    <Section title="Actions" description="Complete these before your session.">
      <div className="divide-y">
        <Row
          label={
            <>
              Upload Deck <Badge variant="secondary">Deadline: 09/20</Badge>
            </>
          }
          trailing={
            <InfoDialog title="Upload Deck" description="How to prepare and upload your slides.">
              <p>Use 16:9 aspect ratio, embed fonts, and export a PDF as backup.</p>
              <p>Upload link is currently a placeholder. Use the button below once enabled.</p>
              <Button size="sm" variant="mint" asChild>
                <a href="#">Open Upload Portal</a>
              </Button>
            </InfoDialog>
          }
        />

        <Row
          label={<>On‑stage Content & Dietary Form</>}
          trailing={
            <InfoDialog title="On‑stage Content & Dietary Form">
              <p>Tell us about any content caveats and dietary needs.</p>
              <p>This is a placeholder form link.</p>
              <Button size="sm" variant="outline" asChild>
                <a href="#">Fill Form</a>
              </Button>
            </InfoDialog>
          }
        />

        <Row
          label={<>Questions for Stage Team</>}
          trailing={
            <InfoDialog title="Questions for Stage Team" description="Reach the production crew.">
              <p>Email: stage@event.tld (placeholder)</p>
              <p>DMs are fine if urgent on event week.</p>
            </InfoDialog>
          }
        />

        <Row
          label={<>Join Telegram Group (optional)</>}
          trailing={
            <InfoDialog title="Telegram Group">
              <p>Casual updates and coordination with fellow speakers.</p>
              <Button size="sm" variant="outline" asChild>
                <a href="#">Open Group</a>
              </Button>
            </InfoDialog>
          }
        />
      </div>
    </Section>
  );
}
