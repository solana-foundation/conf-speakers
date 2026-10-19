"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Clock, Coffee, Shirt, Luggage, ExternalLink } from "@/components/ui/icons";
import { StageTitle } from "@/lib/airtable/types";
import { normalizeStageTitle } from "@/lib/airtable/stages";
import { SPEAKER_GUIDE_LABEL, SPEAKER_GUIDE_NOTE, SPEAKER_GUIDE_URL } from "@/lib/site";

type StageConfig = {
  name: string;
  entrance: string;
  arrivalTime: string;
  checkInLocation: string;
};

const LOGISTICS_CONFIG = {
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
  const uniqueStages =
    stages
      ?.map((value) => normalizeStageTitle(value))
      .filter((value, index, self): value is string => Boolean(value) && self.indexOf(value) === index) ||
    (stage ? [normalizeStageTitle(stage)].filter((value): value is string => Boolean(value)) : []);
  const stageConfigs: StageConfig[] = uniqueStages.map((name) => ({
    name,
    entrance: "Follow the latest speaker check-in directions from the event team.",
    arrivalTime: "Your check-in time will be confirmed by the speaker team.",
    checkInLocation: "the designated speaker check-in desk",
  }));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" variant="gradient" className="w-full rounded-full">
          Key Information
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto border-white/10">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-h2 text-center">Speaker Logistics</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {stageConfigs.length > 0 ? (
            stageConfigs.map((stageConfig, index) => (
              <React.Fragment key={index}>
                <section className="group">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#14f195]/10 text-[#14f195]">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <h4 className="text-h3 font-medium text-white uppercase">
                      Venue & Stage Location{stageConfigs.length > 1 ? ` ${index + 1}` : ""}
                    </h4>
                  </div>
                  <div className="space-y-2 pl-11">
                    <p className="text-p1 font-medium">{stageConfig.name}</p>
                    <p className="text-p2 text-white/50">{stageConfig.entrance}</p>
                  </div>
                </section>

                <div className="h-px bg-white/10" />

                <section className="group">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3c91ff]/10 text-[#3c91ff]">
                      <Clock className="h-4 w-4" />
                    </div>
                    <h4 className="text-h3 font-medium text-white uppercase">
                      Arrival{stageConfigs.length > 1 ? ` ${index + 1}` : ""}
                    </h4>
                  </div>
                  <div className="space-y-2 pl-11">
                    <p className="text-p1">{stageConfig.arrivalTime}</p>
                    <p className="text-p2 text-white/50">Check in at {stageConfig.checkInLocation}.</p>
                  </div>
                </section>

                {index < stageConfigs.length - 1 && <div className="h-px bg-white/10" />}
              </React.Fragment>
            ))
          ) : (
            <section className="group">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#14f195]/10 text-[#14f195]">
                  <MapPin className="h-4 w-4" />
                </div>
                <h4 className="text-h3 font-medium text-white uppercase">Venue & Stage Location</h4>
              </div>
              <div className="space-y-2 pl-11">
                <p className="text-p1 font-medium">
                  Venue details will appear here when stage information is assigned.
                </p>
                <p className="text-p2 text-white/50">
                  Follow the latest event logistics and speaker check-in directions.
                </p>
              </div>
            </section>
          )}

          <div className="h-px bg-white/10" />

          <section className="group">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c0e021]/10 text-[#c0e021]">
                <Coffee className="h-4 w-4" />
              </div>
              <h4 className="text-h3 font-medium text-white uppercase">Speaker Lounge</h4>
            </div>
            <div className="pl-11">
              <p className="text-p1">{LOGISTICS_CONFIG.shared.speakerLounge}</p>
            </div>
          </section>

          <div className="h-px bg-white/10" />

          <section className="group">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#aa67fb]/10 text-[#aa67fb]">
                <Shirt className="h-4 w-4" />
              </div>
              <h4 className="text-h3 font-medium text-white uppercase">Wardrobe</h4>
            </div>
            <div className="space-y-2 pl-11">
              <p className="text-p1">{LOGISTICS_CONFIG.shared.wardrobe.tips}</p>
              <p className="text-p2 text-white/50">{LOGISTICS_CONFIG.shared.wardrobe.jacket}</p>
            </div>
          </section>

          <div className="h-px bg-white/10" />

          <section className="group">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80">
                <Luggage className="h-4 w-4" />
              </div>
              <h4 className="text-h3 font-medium text-white uppercase">Travel & Packing Notes</h4>
            </div>
            <div className="pl-11">
              <p className="text-p1">{LOGISTICS_CONFIG.shared.travel}</p>
            </div>
          </section>
          <div className="h-px bg-white/10" />

          {SPEAKER_GUIDE_URL ? (
            <section className="group">
              <div className="pl-11">
                <a
                  href={SPEAKER_GUIDE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-p1 inline-flex items-center gap-2 font-medium text-[#aa67fb] transition-colors hover:text-[#14f195]"
                >
                  {SPEAKER_GUIDE_LABEL}
                  <ExternalLink className="h-4 w-4" />
                </a>
                {SPEAKER_GUIDE_NOTE && <p className="text-p2 mt-2 text-white/50">{SPEAKER_GUIDE_NOTE}</p>}
              </div>
            </section>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
