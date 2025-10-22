import * as React from "react";
import Section from "./Section";
import { Button } from "@/components/ui/button";

function Row({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b py-3 first:pt-0 last:border-b-0 last:pb-0">
      <div className="text-sm font-medium">{label}</div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function PostEventSection() {
  return (
    <Section title="Post‑Event" description="Follow-ups after the event">
      <div className="divide-y">
        <Row label={<span>Photos Gallery</span>}>
          <Button size="sm" variant="outline" asChild>
            <a href="#">View Gallery</a>
          </Button>
        </Row>

        <Row label={<span>Speaker Permit Info (TBC)</span>}>
          <Button size="sm" variant="outline" asChild>
            <a href="#">View Info</a>
          </Button>
        </Row>

        <Row label={<span>Social Card Download (optional)</span>}>
          <Button size="sm" variant="outline" asChild>
            <a href="#">Download</a>
          </Button>
        </Row>
      </div>
    </Section>
  );
}
