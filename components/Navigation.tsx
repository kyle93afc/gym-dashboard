"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, TrendingUp, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/progress", label: "Progress", icon: TrendingUp },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00b4ff]/10 border border-[#00b4ff]/30 group-hover:bg-[#00b4ff]/20 transition-colors">
              <Dumbbell className="h-4 w-4 text-[#00b4ff]" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold tracking-wider text-white uppercase">
                Kyle
              </span>
              <span className="text-[10px] font-medium tracking-widest text-[#00b4ff] uppercase">
                Gym Dashboard
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[#00b4ff]/10 text-[#00b4ff] border border-[#00b4ff]/20"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
