"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface InfoDialogProps {
  title: string;
  description?: string;
  triggerLabel?: string;
  children?: React.ReactNode;
}

export function InfoDialog({ title, description, triggerLabel = "View", children }: InfoDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <div className="space-y-3 text-sm leading-relaxed">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

export default InfoDialog;
