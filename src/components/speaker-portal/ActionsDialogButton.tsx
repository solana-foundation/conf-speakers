"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ActionsDialogButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          View Actions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Actions</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <section>
            <h4 className="font-medium">Upload Deck</h4>
            <p>Use 16:9 aspect, embed fonts, and export a PDF as backup.</p>
            <Button size="sm" variant="mint" asChild>
              <a href="#">Open Upload Portal</a>
            </Button>
          </section>
          <section>
            <h4 className="font-medium">On‑stage Content & Dietary Form</h4>
            <p>Share any content caveats and dietary needs.</p>
            <Button size="sm" variant="outline" asChild>
              <a href="#">Fill Form</a>
            </Button>
          </section>
          <section>
            <h4 className="font-medium">Questions for Stage Team</h4>
            <p>Email: stage@event.tld (placeholder). DMs okay during event week.</p>
          </section>
          <section>
            <h4 className="font-medium">Join Telegram Group (optional)</h4>
            <p>Casual updates and coordination with fellow speakers.</p>
            <Button size="sm" variant="outline" asChild>
              <a href="#">Open Group</a>
            </Button>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
