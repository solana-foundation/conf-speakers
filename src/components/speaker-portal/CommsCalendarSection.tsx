import * as React from "react";
import Section from "./Section";
import { Button } from "@/components/ui/button";

function Row({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="text-wisp border-stroke-primary flex items-start justify-between gap-4 border-b py-3 first:pt-0 last:border-b-0 last:pb-0">
      <div className="text-base font-medium">{label}</div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function CommsCalendarSection() {
  return (
    <Section title="Comms & Calendar" description="Emails you’ll receive and calendar links">
      <div className="divide-y">
        <Row label={<span>What you'll receive via email</span>}>
          <span className="text-foreground/60 text-xs">Welcome, logistics, and schedule updates</span>
        </Row>
        <Row label={<span>Add to Calendar</span>}>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" asChild>
              <a href="#">Individual Session ICS</a>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href="#">All Sessions ICS</a>
            </Button>
          </div>
        </Row>
        <Row label={<span>Request: Resend Calendar Invites</span>}>
          <Button size="sm" variant="link" asChild>
            <a href="#">Request Resend</a>
          </Button>
        </Row>
      </div>
    </Section>
  );
}
