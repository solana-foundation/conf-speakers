import * as React from "react";
import Section from "./Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function Row({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="text-wisp border-stroke-primary flex items-start justify-between gap-4 border-b py-3 first:pt-0 last:border-b-0 last:pb-0">
      <div className="text-base font-medium">{label}</div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function TicketsSection() {
  return (
    <Section title="Tickets" description="Your speaker ticket and plus-one">
      <div className="divide-y">
        <Row label={<span>Speaker Ticket Status</span>}>
          <Badge variant="outline">Confirmed</Badge>
        </Row>

        <Row label={<span>Plus One Ticket Redemption</span>}>
          <Button size="sm" variant="outline" asChild>
            <a href="#">Redeem</a>
          </Button>
        </Row>

        <Row label={<span>Invite Code</span>}>
          <code className="text-base">XXXXXX</code>
        </Row>

        <Row label={<span>How to Redeem</span>}>
          <Button size="sm" variant="link" asChild>
            <a href="#">View Instructions</a>
          </Button>
        </Row>
      </div>
    </Section>
  );
}
