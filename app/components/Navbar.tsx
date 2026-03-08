import Link from "next/link";

const navLinks: Array<{ href: string; label: string }> = [
  { href: "/", label: "หน้าแรก" },
  { href: "/about", label: "เกี่ยวกับครู" },
  { href: "/lessons", label: "บทเรียน" },
  { href: "/documents", label: "เอกสาร" },
  { href: "/news", label: "ประกาศ" },
  { href: "/contact", label: "ติดต่อ" },
];

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <p className="text-sm font-semibold text-slate-900">
          คณิตศาสตร์ ม.3 กับครูสุมาลี
        </p>
        <div className="flex flex-wrap items-center gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
