"use client";
import { useState } from "react";
import Image from "next/image";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Tentang", href: "#about" },
    { name: "Menu", href: "#menu" },
    { name: "Pre Order", href: "#preorder" },
    { name: "Kontak", href: "#contact" },
  ];

  return (
    <nav className="fixed w-full bg-[#1a1a1a]/80 backdrop-blur-lg text-white p-4 z-50 border-b border-white/5">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-4">
          <Image
            src="/nuampoll.png"
            alt="Logo Nuampoll"
            width={40}
            height={40}
            className="hover:scale-110 transition-transform duration-300"
          />
          <a href="#" className="text-2xl font-black tracking-tight">
            Nuampoll<span className="text-red-600">.</span>
          </a>
        </div>

        {/* Nav Links - Desktop */}
        <div className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="hover:text-red-600 font-bold transition-all duration-300 relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Hamburger Menu Button - Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-3xl text-white hover:text-red-600 transition-colors focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu - Transitioning Overlay */}
      <div
        className={`md:hidden absolute top-[72px] left-0 w-full bg-[#1a1a1a]/fb backdrop-blur-2xl border-b border-white/10 transition-all duration-300 ease-out origin-top ${isOpen
          ? 'opacity-100 scale-y-100 translate-y-0'
          : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
          }`}
      >
        <div className="flex flex-col p-6 gap-2 bg-[#1a1a1a]/80">
          {navLinks.map((link, index) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-xl font-bold hover:text-red-600 transition-all py-4 border-b border-white/5 last:border-0 transform hover:translate-x-2"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}