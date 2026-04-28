"use client";
import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-[#1a1a1a]/80 backdrop-blur-md text-white p-4 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Image src="/nuampoll.png" alt="Logo Nuampoll" width={40} height={40} />
          <a href="#" className="text-2xl font-bold">
            Nuampoll
          </a>
        </div>
        
        {/* Nav Links - Desktop */}
        <div className="hidden md:flex gap-6">
          <a href="#home" className="hover:text-red-500 transition">Home</a>
          <a href="#about" className="hover:text-red-500 transition">Tentang</a>
          <a href="#menu" className="hover:text-red-500 transition">Menu</a>
          <a href="#contact" className="hover:text-red-500 transition">Kontak</a>
        </div>
      </div>
    </nav>
  );
}