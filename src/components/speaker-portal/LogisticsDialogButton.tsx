"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Clock, Coffee, Shirt, Luggage, ExternalLink } from "lucide-react";
import { StageTitle, StageValues } from "@/lib/airtable/types";
import { SPEAKER_GUIDE_URL } from "@/lib/site";

type StageConfig = {
  name: string;
  entrance: string;
  arrivalTime: string;
  checkInLocation: string;
};

const STAGE_LOGISTICS: Record<string, StageConfig> = {
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
  "Main Stage": {
    name: "Main Stage",
    entrance: "Follow venue signage and speaker check-in directions.",
    arrivalTime: "45 minutes before your session start time",
    checkInLocation: "Speaker check-in for mic fitting and stage brief",
  },
};

// Hardcoded configuration data
const LOGISTICS_CONFIG = {
  stages: STAGE_LOGISTICS,
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
  const stageConfigs = uniqueStages.map((s) => LOGISTICS_CONFIG.stages[s]).filter((config): config is StageConfig => Boolean(config));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" variant="gradient" className="w-full rounded-full">
          Key Information
        </Button>
      </DialogTrigger>
      <DialogContent className="border-white/10 max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-h2 text-center">Speaker Logistics</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {stageConfigs.length > 0 ? (
            stageConfigs.map((stageConfig, index) => (
              <React.Fragment key={index}>
                <section className="group">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="bg-[#19fb9b]/10 text-[#19fb9b] flex h-8 w-8 items-center justify-center rounded-full">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <h4 className="text-h3 font-medium uppercase text-white">
                      Venue & Stage Location{stageConfigs.length > 1 ? ` ${index + 1}` : ""}
                    </h4>
                  </div>
                  <div className="space-y-2 pl-11">
                    <p className="text-p1 font-medium">{stageConfig.name}</p>
                    <p className="text-p2 text-white/50">{stageConfig.entrance}</p>
                  </div>
                </section>

                <div className="bg-white/10 h-px" />

                <section className="group">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="bg-[#2a88de]/10 text-[#2a88de] flex h-8 w-8 items-center justify-center rounded-full">
                      <Clock className="h-4 w-4" />
                    </div>
                    <h4 className="text-h3 font-medium uppercase text-white">
                      Arrival{stageConfigs.length > 1 ? ` ${index + 1}` : ""}
                    </h4>
                  </div>
                  <div className="space-y-2 pl-11">
                    <p className="text-p1">Please arrive {stageConfig.arrivalTime}.</p>
                    <p className="text-p2 text-white/50">Check in at {stageConfig.checkInLocation}.</p>
                  </div>
                </section>

                {index < stageConfigs.length - 1 && <div className="bg-white/10 h-px" />}
              </React.Fragment>
            ))
          ) : (
            <section className="group">
              <div className="mb-3 flex items-center gap-3">
                <div className="bg-[#19fb9b]/10 text-[#19fb9b] flex h-8 w-8 items-center justify-center rounded-full">
                  <MapPin className="h-4 w-4" />
                </div>
                <h4 className="text-h3 font-medium uppercase text-white">Venue & Stage Location</h4>
              </div>
              <div className="space-y-2 pl-11">
                <p className="text-p1 font-medium">Venue details will appear here when stage information is assigned.</p>
                <p className="text-p2 text-white/50">Follow the latest event logistics and speaker check-in directions.</p>
              </div>
            </section>
          )}

          <div className="bg-white/10 h-px" />

          <section className="group">
            <div className="mb-3 flex items-center gap-3">
              <div className="bg-[#c9ff7c]/10 text-[#c9ff7c] flex h-8 w-8 items-center justify-center rounded-full">
                <Coffee className="h-4 w-4" />
              </div>
              <h4 className="text-h3 font-medium uppercase text-white">Speaker Lounge</h4>
            </div>
            <div className="pl-11">
              <p className="text-p1">{LOGISTICS_CONFIG.shared.speakerLounge}</p>
            </div>
          </section>

          <div className="bg-white/10 h-px" />

          <section className="group">
            <div className="mb-3 flex items-center gap-3">
              <div className="bg-[#9945ff]/10 text-[#9945ff] flex h-8 w-8 items-center justify-center rounded-full">
                <Shirt className="h-4 w-4" />
              </div>
              <h4 className="text-h3 font-medium uppercase text-white">Wardrobe</h4>
            </div>
            <div className="space-y-2 pl-11">
              <p className="text-p1">{LOGISTICS_CONFIG.shared.wardrobe.tips}</p>
              <p className="text-p2 text-white/50">{LOGISTICS_CONFIG.shared.wardrobe.jacket}</p>
            </div>
          </section>

          <div className="bg-white/10 h-px" />

          <section className="group">
            <div className="mb-3 flex items-center gap-3">
              <div className="bg-white/10 text-white/80 flex h-8 w-8 items-center justify-center rounded-full">
                <Luggage className="h-4 w-4" />
              </div>
              <h4 className="text-h3 font-medium uppercase text-white">Travel & Packing Notes</h4>
            </div>
            <div className="pl-11">
              <p className="text-p1">{LOGISTICS_CONFIG.shared.travel}</p>
            </div>
          </section>
          <div className="bg-white/10 h-px" />

          {SPEAKER_GUIDE_URL ? (
            <section className="group">
              <div className="pl-11">
                <a
                  href={SPEAKER_GUIDE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-p1 text-[#9945ff] hover:text-[#19fb9b] inline-flex items-center gap-2 font-medium transition-colors"
                >
                  View full speaker information & best practices guide
                  <ExternalLink className="h-4 w-4" />
                </a>
                <p className="text-p2 text-white/50 mt-2">
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
