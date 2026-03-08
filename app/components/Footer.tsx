import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-4 text-sm text-slate-600">
        <p>เว็บไซต์รายวิชาคณิตศาสตร์</p>
        <div className="flex items-center gap-4">
          <Link href="/admin" className="hover:text-slate-900 hover:underline">
            ผู้ดูแลระบบ
          </Link>
          <p>Copyright © {year}</p>
        </div>
      </div>
    </footer>
  );
}
