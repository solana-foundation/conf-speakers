"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Clock, Coffee, Shirt, Luggage } from "lucide-react";
import { StageTitle, StageValues } from "@/lib/airtable/types";

// Hardcoded configuration data
const LOGISTICS_CONFIG = {
  stages: {
    [StageValues.Main]: {
      name: "Breakers Ballroom — Stage A",
      entrance: "Backstage entrance via Hall C. Staff will guide you.",
      arrivalTime: "45 minutes before your session start time",
      checkInLocation: "Speaker Ops for mic fitting and stage brief",
    },
    [StageValues.Side]: {
      name: "Conference Room B — Stage B",
      entrance: "Direct entrance via Main Hall. Look for Stage B signage.",
      arrivalTime: "45 minutes before your session start time",
      checkInLocation: "Lock In Stage Ops for equipment check and brief",
    },
  },
  shared: {
    speakerLounge: "Mezzanine Level, Room M2. Coffee, snacks, power, Wi‑Fi.",
    wardrobe: {
      tips: "Avoid small stripes and high‑contrast micro‑patterns.",
      jacket: "Bring a light jacket; stage can be cool.",
    },
    travel: "EU Type C adapters available on site; carry your deck on USB.",
  },
};

export default function LogisticsDialogButton({ stage, stages }: { stage: StageTitle; stages?: StageTitle[] }) {
  const uniqueStages = stages?.filter((s, index, self) => self.indexOf(s) === index) || [stage];
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
          {stageConfigs.map((stageConfig, index) => (
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
          ))}

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
        </div>
      </DialogContent>
    </Dialog>
  );
}
