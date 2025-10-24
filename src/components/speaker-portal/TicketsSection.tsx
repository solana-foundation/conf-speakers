import * as React from "react";
import Section from "./Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExternalLink, HelpCircle } from "lucide-react";

function Row({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="text-wisp border-stroke-primary flex items-start justify-between gap-4 border-b py-3 first:pt-0 last:border-b-0 last:pb-0">
      <div className="text-base font-medium">{label}</div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

interface TicketsSectionProps {
  speakerTicket?: string;
  plusOneTicket?: string;
  invitationCode?: string;
}

export default function TicketsSection({ speakerTicket, plusOneTicket, invitationCode }: TicketsSectionProps) {
  return (
    <Section title="Tickets" description="Your speaker ticket and plus-one">
      <div className="divide-y">
        <Row label={<span>Speaker Ticket Status</span>}>
          {speakerTicket ? (
            <Button size="sm" variant="outline" asChild>
              <a href={speakerTicket} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Badge variant="outline">Confirmed</Badge>
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          ) : (
            <Button size="sm" variant="outline" disabled>
              Not Issued Yet
            </Button>
          )}
        </Row>

        <Row label={<span>Plus One Ticket Redemption</span>}>
          {plusOneTicket ? (
            <Button size="sm" variant="outline" asChild>
              <a href={plusOneTicket} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                Redeem
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          ) : (
            <Button size="sm" variant="outline" disabled>
              Not Available
            </Button>
          )}
        </Row>

        <Row label={<span>Invite Code</span>}>
          <code className="text-base">{invitationCode || "Not Available"}</code>
        </Row>

        <Row label={<span>How to Redeem</span>}>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="link" className="flex items-center gap-2">
                <HelpCircle className="h-3 w-3" />
                View Instructions
              </Button>
            </DialogTrigger>
            <DialogContent className="border-stroke-secondary max-h-[85vh] overflow-y-auto">
              <DialogHeader className="pb-6">
                <DialogTitle className="text-h2 text-center">Ticket Redemption Instructions</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <section className="group">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="bg-mint/10 text-mint flex h-8 w-8 items-center justify-center rounded-full">
                      <ExternalLink className="h-4 w-4" />
                    </div>
                    <h4 className="text-h3 text-primary font-medium uppercase">Speaker Ticket</h4>
                  </div>
                  <div className="space-y-2 pl-11">
                    <p className="text-p1">Your speaker ticket provides complimentary access to the event.</p>
                    <p className="text-p2 text-secondary">
                      Click the "Confirmed" button above to redeem your ticket on Luma.
                    </p>
                  </div>
                </section>

                <div className="bg-stroke-primary h-px" />

                <section className="group">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="bg-azure/10 text-azure flex h-8 w-8 items-center justify-center rounded-full">
                      <ExternalLink className="h-4 w-4" />
                    </div>
                    <h4 className="text-h3 text-primary font-medium uppercase">Plus One Ticket</h4>
                  </div>
                  <div className="space-y-2 pl-11">
                    <p className="text-p1">Your plus-one ticket allows you to bring a guest to the event.</p>
                    <p className="text-p2 text-secondary">
                      Click the "Redeem" button above to claim your plus-one ticket on Luma.
                    </p>
                  </div>
                </section>

                <div className="bg-stroke-primary h-px" />

                <section className="group">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="bg-lime/10 text-lime flex h-8 w-8 items-center justify-center rounded-full">
                      <HelpCircle className="h-4 w-4" />
                    </div>
                    <h4 className="text-h3 text-primary font-medium uppercase">Using Coupon Codes</h4>
                  </div>
                  <div className="space-y-2 pl-11">
                    <p className="text-p1">If you have an invitation code, you can use it during checkout on Luma.</p>
                    <p className="text-p2 text-secondary">
                      Look for the "Use a Coupon" option on the event registration page.
                    </p>
                  </div>
                </section>

                <div className="bg-stroke-primary h-px" />

                <section className="group">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="bg-byte/10 text-byte flex h-8 w-8 items-center justify-center rounded-full">
                      <ExternalLink className="h-4 w-4" />
                    </div>
                    <h4 className="text-h3 text-primary font-medium uppercase">Need Help?</h4>
                  </div>
                  <div className="pl-11">
                    <p className="text-p1">
                      If you encounter any issues with ticket redemption, please contact the event organizers.
                    </p>
                  </div>
                </section>
              </div>
            </DialogContent>
          </Dialog>
        </Row>
      </div>
    </Section>
  );
}
