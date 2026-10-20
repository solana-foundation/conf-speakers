export function SectionHeading({ eyebrow, title, id }: { eyebrow: string; title: string; id?: string }) {
  return (
    <div className="space-y-4 lg:space-y-6">
      <p className="breakpoint-eyebrow text-[#a2a2a2]">{eyebrow}</p>
      <h2 id={id} className="breakpoint-section-title text-white">
        {title}
      </h2>
    </div>
  );
}
