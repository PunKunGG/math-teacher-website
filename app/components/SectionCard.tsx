import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function SectionCard({
  title,
  description,
  children,
}: SectionCardProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      {description ? (
        <p className="mt-2 text-slate-700">{description}</p>
      ) : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}
