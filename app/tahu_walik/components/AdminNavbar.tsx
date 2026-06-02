"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { FiLayout, FiBarChart2, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import Image from "next/image";

export default function AdminNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/tahu_walik/dashboard", icon: FiLayout },
    { name: "Analytics", href: "/tahu_walik/analitycs", icon: FiBarChart2 },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#111111]/90 backdrop-blur-md text-white border-b border-red-950/40 z-50 shadow-2xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 flex items-center justify-center bg-red-950/20 rounded-xl border border-red-600/30 overflow-hidden shadow-[0_0_15px_rgba(220,38,38,0.2)]">
              <Image
                src="/nuampoll.png"
                alt="Logo Nuampoll"
                width={24}
                height={24}
                className="hover:scale-110 hover:rotate-12 transition-all duration-300"
              />
            </div>
            <Link href="/tahu_walik/dashboard" className="text-xl font-black tracking-tight text-white select-none">
              Nuampoll<span className="text-red-600">.</span>Admin
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 border ${
                    isActive
                      ? "bg-red-600/10 text-red-500 border-red-600/30 shadow-[0_0_20px_rgba(220,38,38,0.15)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5 border-transparent"
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  {item.name}
                </Link>
              );
            })}

            <div className="h-6 w-[1px] bg-red-950/40"></div>

            <button
              onClick={() => signOut({ callbackUrl: "/tahu_walik" })}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all duration-300 shadow-[0_0_15px_rgba(220,38,38,0.25)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] transform active:scale-95 cursor-pointer"
            >
              <FiLogOut className="w-4.5 h-4.5" />
              Keluar
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2.5 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition cursor-pointer border border-transparent hover:border-white/10"
            aria-label="Toggle Menu"
          >
            {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden border-t border-red-950/40 bg-[#111111]/fb backdrop-blur-2xl transition-all duration-300 ease-out origin-top ${
          isOpen
            ? "opacity-100 scale-y-100 translate-y-0"
            : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none absolute w-full"
        }`}
      >
        <div className="px-4 py-4 space-y-2 bg-[#111111]/90">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold text-base transition-all border ${
                  isActive
                    ? "bg-red-600/10 text-red-500 border-red-600/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border-transparent"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-red-950/20">
            <button
              onClick={() => {
                setIsOpen(false);
                signOut({ callbackUrl: "/tahu_walik" });
              }}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-600/10 font-bold text-base transition-all text-left cursor-pointer border border-transparent hover:border-red-600/20"
            >
              <FiLogOut className="w-5 h-5" />
              Keluar (Logout)
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
