import Link from "next/link";

type ContentListItem = {
  id: number;
  title: string;
  detail?: string;
  meta?: string;
  href?: string;
};

type ContentListProps = {
  items: ContentListItem[];
  emptyText?: string;
};

export default function ContentList({
  items,
  emptyText = "ยังไม่มีข้อมูล",
}: ContentListProps) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-600">{emptyText}</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          key={item.id}
          className="rounded-md border border-slate-200 bg-slate-50 p-4"
        >
          {item.href ? (
            <Link
              href={item.href}
              className="font-medium text-slate-900 hover:underline"
            >
              {item.title}
            </Link>
          ) : (
            <p className="font-medium text-slate-900">{item.title}</p>
          )}
          {item.detail ? (
            <p className="mt-1 text-sm text-slate-700">{item.detail}</p>
          ) : null}
          {item.meta ? (
            <p className="mt-1 text-xs text-slate-500">{item.meta}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
