"use client";

import * as React from "react";
import Section from "./Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExternalLink, HelpCircle, CheckCircle, Clock, Copy, AlertCircle } from "lucide-react";
import { EVENT_REGISTRATION_PLATFORM, SPEAKER_CONTACT_EMAIL } from "@/lib/site";

function Row({
  label,
  children,
  description,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  description?: string;
}) {
  return (
    <div className="text-white border-white/10 flex flex-col gap-3 border-b py-4 first:pt-0 last:border-b-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
      <div className="min-w-0 flex-1">
        <div className="text-base font-medium">{label}</div>
        {description && <div className="text-white/50 mt-1 text-sm">{description}</div>}
      </div>
      <div className="flex-shrink-0 shrink-0">{children}</div>
    </div>
  );
}

interface TicketsSectionProps {
  speakerTicket?: string;
  plusOneTicket?: string;
  invitationCode?: string;
}

export default function TicketsSection({ speakerTicket, plusOneTicket, invitationCode }: TicketsSectionProps) {
  const [copiedCode, setCopiedCode] = React.useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleExternalLink = (url: string) => {
    // Add analytics or tracking here if needed
    window.open(url, "_blank", "noopener,noreferrer");
  };
  return (
    <Section title="Tickets" description="Your speaker ticket and plus-one">
      <div className="divide-y">
        <Row
          label={
            <div className="flex items-center gap-2">
              <span>Speaker Ticket</span>
              {speakerTicket ? (
                <CheckCircle className="text-[#19fb9b] h-4 w-4" aria-label="Confirmed" />
              ) : (
                <Clock className="text-white/40 h-4 w-4" aria-label="Pending" />
              )}
            </div>
          }
          description="Complimentary access to the event"
        >
          {speakerTicket ? (
            <Button
              size="sm"
              variant="mint"
              onClick={() => handleExternalLink(speakerTicket)}
              className="flex items-center gap-2"
              aria-label={`Redeem speaker ticket on ${EVENT_REGISTRATION_PLATFORM}`}
            >
              <span>Redeem Ticket</span>
              <ExternalLink className="h-3 w-3" />
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Pending
              </Badge>
            </div>
          )}
        </Row>

        <Row
          label={
            <div className="flex items-center gap-2">
              <span>Plus One Ticket</span>
              {plusOneTicket ? (
                <CheckCircle className="text-[#2a88de] h-4 w-4" aria-label="Available" />
              ) : (
                <AlertCircle className="text-white/40 h-4 w-4" aria-label="Not available" />
              )}
            </div>
          }
          description="Bring a guest to the event"
        >
          {plusOneTicket ? (
            <Button
              size="sm"
              variant="azure"
              onClick={() => handleExternalLink(plusOneTicket)}
              className="flex items-center gap-2"
              aria-label={`Redeem plus one ticket on ${EVENT_REGISTRATION_PLATFORM}`}
            >
              <span>Redeem Guest Ticket</span>
              <ExternalLink className="h-3 w-3" />
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Not Available
              </Badge>
            </div>
          )}
        </Row>

        <Row
          label={
            <div className="flex items-center gap-2">
              <span>Invitation Code</span>
              {invitationCode ? (
                <CheckCircle className="text-[#c9ff7c] h-4 w-4" aria-label="Code available" />
              ) : (
                <AlertCircle className="text-white/40 h-4 w-4" aria-label="No code" />
              )}
            </div>
          }
          description={`Use this code during checkout on ${EVENT_REGISTRATION_PLATFORM}`}
        >
          {invitationCode ? (
            <div className="flex items-center gap-2">
              <code className="bg-secondary/20 rounded px-2 py-1 font-mono text-sm">{invitationCode}</code>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(invitationCode)}
                className="h-8 w-8 p-0"
                aria-label="Copy invitation code"
              >
                {copiedCode ? <CheckCircle className="text-[#c9ff7c] h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          ) : (
            <Badge variant="secondary" className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Not Available
            </Badge>
          )}
        </Row>

        <Row label="Redemption Help" description="Step-by-step instructions for ticket redemption">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="flex items-center gap-2"
                aria-label="Open ticket redemption instructions"
              >
                <HelpCircle className="h-4 w-4" />
                <span className="hidden sm:inline">View Instructions</span>
                <span className="sm:hidden">Help</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="border-white/10 max-h-[85vh] overflow-y-auto">
              <DialogHeader className="pb-6">
                <DialogTitle className="text-h2 text-center">Ticket Redemption Guide</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <section className="group">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="bg-[#19fb9b]/10 text-[#19fb9b] flex h-8 w-8 items-center justify-center rounded-full">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <h4 className="text-h3 font-medium uppercase text-white">Speaker Ticket</h4>
                  </div>
                  <div className="space-y-2 pl-11">
                    <p className="text-p1">Your speaker ticket provides complimentary access to the event.</p>
                    <p className="text-p2 text-white/50">
                      Click the &#34;Redeem Ticket&#34; button above to claim your speaker access on {EVENT_REGISTRATION_PLATFORM}.
                    </p>
                  </div>
                </section>

                <div className="bg-white/10 h-px" />

                <section className="group">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="bg-[#2a88de]/10 text-[#2a88de] flex h-8 w-8 items-center justify-center rounded-full">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <h4 className="text-h3 font-medium uppercase text-white">Plus One Ticket</h4>
                  </div>
                  <div className="space-y-2 pl-11">
                    <p className="text-p1">Your plus-one ticket allows you to bring a guest to the event.</p>
                    <p className="text-p2 text-white/50">
                      Click the &#34;Redeem Guest Ticket&#34; button above to claim your plus-one access on {EVENT_REGISTRATION_PLATFORM}.
                    </p>
                  </div>
                </section>

                <div className="bg-white/10 h-px" />

                <section className="group">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="bg-[#c9ff7c]/10 text-[#c9ff7c] flex h-8 w-8 items-center justify-center rounded-full">
                      <Copy className="h-4 w-4" />
                    </div>
                    <h4 className="text-h3 font-medium uppercase text-white">Using Invitation Codes</h4>
                  </div>
                  <div className="space-y-2 pl-11">
                    <p className="text-p1">
                      If you have an invitation code, you can use it during checkout on {EVENT_REGISTRATION_PLATFORM}.
                    </p>
                    <p className="text-p2 text-white/50">
                      Copy the code above and paste it when prompted during registration.
                    </p>
                    <p className="text-p2 text-white/50">
                      Look for the &#34;Use a Coupon&#34; option on the event registration page.
                    </p>
                  </div>
                </section>

                <div className="bg-white/10 h-px" />

                <section className="group">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="bg-[#9945ff]/10 text-[#9945ff] flex h-8 w-8 items-center justify-center rounded-full">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                    <h4 className="text-h3 font-medium uppercase text-white">Need Help?</h4>
                  </div>
                  <div className="pl-11">
                    <p className="text-p1">
                      If you encounter any issues with ticket redemption, please contact the event organizers at{" "}
                      <a
                        href={`mailto:${SPEAKER_CONTACT_EMAIL}`}
                        className="text-[#9945ff] hover:text-[#19fb9b] hover:underline transition-colors"
                        aria-label="Contact event organizers via email"
                      >
                        {SPEAKER_CONTACT_EMAIL}
                      </a>
                      .
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
