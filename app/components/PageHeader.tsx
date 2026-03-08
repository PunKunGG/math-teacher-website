type PageHeaderProps = {
  title: string;
  description: string;
};

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="rounded-lg border border-slate-200 bg-slate-50 p-6">
      <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
      <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">
        {description}
      </p>
    </header>
  );
}
