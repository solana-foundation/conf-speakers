import * as React from "react";
import Section from "./Section";
import InfoDialog from "./InfoDialog";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b py-3 first:pt-0 last:border-b-0 last:pb-0">
      <div className="text-sm font-medium">{label}</div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function LogisticsSection() {
  return (
    <Section title="Logistics" description="Practical details for your event day.">
      <div className="divide-y">
        <Row label="Venue & Stage Location">
          <InfoDialog title="Venue & Stage Location">
            <p>Refer to the latest venue map and speaker briefing for your assigned stage.</p>
            <p>Follow posted wayfinding and speaker check-in directions on site.</p>
          </InfoDialog>
        </Row>

        <Row label="Arrival (45 min prior to session)">
          <InfoDialog title="Arrival Timing">
            <p>Please arrive 45 minutes before your session start time.</p>
            <p>Check in at the speaker operations desk for mic fitting and stage brief.</p>
          </InfoDialog>
        </Row>

        <Row label="Speaker Lounge: Location & Amenities">
          <InfoDialog title="Speaker Lounge">
            <p>Refer to the latest event logistics for lounge location and access.</p>
            <p>Refreshments, power, and Wi-Fi are typically available in the speaker lounge.</p>
          </InfoDialog>
        </Row>

        <Row label="Wardrobe: Camera‑safe guidance">
          <InfoDialog title="Wardrobe Guidance">
            <p>Avoid small stripes and high‑contrast micro‑patterns.</p>
            <p>Bring a light jacket; stage can be cool.</p>
          </InfoDialog>
        </Row>

        <Row label="Travel & Packing Notes">
          <InfoDialog title="Travel & Packing Notes">
            <p>Bring any adapters you expect to need at the venue.</p>
            <p>We recommend carrying your deck on a USB‑C or USB‑A drive as backup.</p>
          </InfoDialog>
        </Row>
      </div>
    </Section>
  );
}
