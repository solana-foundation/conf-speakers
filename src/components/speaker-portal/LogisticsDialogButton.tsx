"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function LogisticsDialogButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" variant="mint">
          Key Information
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Logistics</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <section>
            <h4 className="font-medium">Venue & Stage Location</h4>
            <p>Breakers Ballroom — Stage A</p>
            <p>Backstage entrance via Hall C. Staff will guide you.</p>
          </section>
          <section>
            <h4 className="font-medium">Arrival</h4>
            <p>Please arrive 45 minutes before your session start time.</p>
            <p>Check in at Speaker Ops for mic fitting and stage brief.</p>
          </section>
          <section>
            <h4 className="font-medium">Speaker Lounge</h4>
            <p>Mezzanine Level, Room M2. Coffee, snacks, power, Wi‑Fi.</p>
          </section>
          <section>
            <h4 className="font-medium">Wardrobe</h4>
            <p>Avoid small stripes and high‑contrast micro‑patterns.</p>
            <p>Bring a light jacket; stage can be cool.</p>
          </section>
          <section>
            <h4 className="font-medium">Travel & Packing Notes</h4>
            <p>EU Type C adapters available on site; carry your deck on USB.</p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
