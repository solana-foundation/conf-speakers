"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Clock, Coffee, Shirt, Luggage, ExternalLink } from "lucide-react";
import { StageTitle, StageValues } from "@/lib/airtable/types";
import { SPEAKER_GUIDE_URL } from "@/lib/site";

// Hardcoded configuration data
const LOGISTICS_CONFIG = {
  stages: {
    [StageValues.Main]: {
      name: StageValues.Main,
      entrance: "Follow venue signage and speaker check-in directions.",
      arrivalTime: "45 minutes before your session start time",
      checkInLocation: "Speaker check-in for mic fitting and stage brief",
    },
    [StageValues.Side]: {
      name: StageValues.Side,
      entrance: "Follow venue signage and speaker check-in directions.",
      arrivalTime: "45 minutes before your session start time",
      checkInLocation: "Speaker check-in for equipment check and brief",
    },
    [StageValues.Cafe]: {
      name: StageValues.Cafe,
      entrance: "Follow venue signage and speaker check-in directions.",
      arrivalTime: "45 minutes before your session start time",
      checkInLocation: "Speaker check-in",
    },
    [StageValues.Etihad]: {
      name: StageValues.Etihad,
      entrance: "Follow venue signage and speaker check-in directions.",
      arrivalTime: "45 minutes before your session start time",
      checkInLocation: "Speaker check-in",
    },
  },
  shared: {
    speakerLounge: "Refer to the latest event logistics for speaker lounge access, refreshments, power, and Wi-Fi.",
    wardrobe: {
      tips: "Avoid small stripes and high‑contrast micro‑patterns.",
      jacket: "Bring an extra layer if your venue or stage area tends to run cool.",
    },
    travel: "Carry your deck on USB and keep key presentation files available offline.",
  },
};

export default function LogisticsDialogButton({ stage, stages }: { stage?: StageTitle; stages?: StageTitle[] }) {
  const uniqueStages = stages?.filter((s, index, self) => self.indexOf(s) === index) || (stage ? [stage] : []);
  const stageConfigs = uniqueStages.map((s) => LOGISTICS_CONFIG.stages[s]).filter(Boolean);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" variant="mint" className="w-full">
          Key Information
        </Button>
      </DialogTrigger>
      <DialogContent className="border-stroke-secondary max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-h2 text-center">Speaker Logistics</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {stageConfigs.length > 0 ? (
            stageConfigs.map((stageConfig, index) => (
            <React.Fragment key={index}>
              <section className="group">
                <div className="mb-3 flex items-center gap-3">
                  <div className="bg-mint/10 text-mint flex h-8 w-8 items-center justify-center rounded-full">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <h4 className="text-h3 text-primary font-medium uppercase">
                    Venue & Stage Location{stageConfigs.length > 1 ? ` ${index + 1}` : ""}
                  </h4>
                </div>
                <div className="space-y-2 pl-11">
                  <p className="text-p1 font-medium">{stageConfig.name}</p>
                  <p className="text-p2 text-secondary">{stageConfig.entrance}</p>
                </div>
              </section>

              <div className="bg-stroke-primary h-px" />

              <section className="group">
                <div className="mb-3 flex items-center gap-3">
                  <div className="bg-azure/10 text-azure flex h-8 w-8 items-center justify-center rounded-full">
                    <Clock className="h-4 w-4" />
                  </div>
                  <h4 className="text-h3 text-primary font-medium uppercase">
                    Arrival{stageConfigs.length > 1 ? ` ${index + 1}` : ""}
                  </h4>
                </div>
                <div className="space-y-2 pl-11">
                  <p className="text-p1">Please arrive {stageConfig.arrivalTime}.</p>
                  <p className="text-p2 text-secondary">Check in at {stageConfig.checkInLocation}.</p>
                </div>
              </section>

              {index < stageConfigs.length - 1 && <div className="bg-stroke-primary h-px" />}
            </React.Fragment>
            ))
          ) : (
            <section className="group">
              <div className="mb-3 flex items-center gap-3">
                <div className="bg-mint/10 text-mint flex h-8 w-8 items-center justify-center rounded-full">
                  <MapPin className="h-4 w-4" />
                </div>
                <h4 className="text-h3 text-primary font-medium uppercase">Venue & Stage Location</h4>
              </div>
              <div className="space-y-2 pl-11">
                <p className="text-p1 font-medium">Venue details will appear here when stage information is assigned.</p>
                <p className="text-p2 text-secondary">Follow the latest event logistics and speaker check-in directions.</p>
              </div>
            </section>
          )}

          <div className="bg-stroke-primary h-px" />

          <section className="group">
            <div className="mb-3 flex items-center gap-3">
              <div className="bg-lime/10 text-lime flex h-8 w-8 items-center justify-center rounded-full">
                <Coffee className="h-4 w-4" />
              </div>
              <h4 className="text-h3 text-primary font-medium uppercase">Speaker Lounge</h4>
            </div>
            <div className="pl-11">
              <p className="text-p1">{LOGISTICS_CONFIG.shared.speakerLounge}</p>
            </div>
          </section>

          <div className="bg-stroke-primary h-px" />

          <section className="group">
            <div className="mb-3 flex items-center gap-3">
              <div className="bg-byte/10 text-byte flex h-8 w-8 items-center justify-center rounded-full">
                <Shirt className="h-4 w-4" />
              </div>
              <h4 className="text-h3 text-primary font-medium uppercase">Wardrobe</h4>
            </div>
            <div className="space-y-2 pl-11">
              <p className="text-p1">{LOGISTICS_CONFIG.shared.wardrobe.tips}</p>
              <p className="text-p2 text-secondary">{LOGISTICS_CONFIG.shared.wardrobe.jacket}</p>
            </div>
          </section>

          <div className="bg-stroke-primary h-px" />

          <section className="group">
            <div className="mb-3 flex items-center gap-3">
              <div className="bg-wisp/10 text-wisp flex h-8 w-8 items-center justify-center rounded-full">
                <Luggage className="h-4 w-4" />
              </div>
              <h4 className="text-h3 text-primary font-medium uppercase">Travel & Packing Notes</h4>
            </div>
            <div className="pl-11">
              <p className="text-p1">{LOGISTICS_CONFIG.shared.travel}</p>
            </div>
          </section>
          <div className="bg-stroke-primary h-px" />

          {SPEAKER_GUIDE_URL ? (
            <section className="group">
              <div className="pl-11">
                <a
                  href={SPEAKER_GUIDE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-p1 text-primary hover:text-azure inline-flex items-center gap-2 font-medium transition-colors"
                >
                  View full speaker information & best practices guide
                  <ExternalLink className="h-4 w-4" />
                </a>
                <p className="text-p2 text-secondary mt-2">
                  For more detailed information about speaking at this event, including best practices and additional resources.
                </p>
              </div>
            </section>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
