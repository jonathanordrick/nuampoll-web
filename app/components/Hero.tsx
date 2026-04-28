"use client";
import { FiChevronRight } from "react-icons/fi";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Hero() {
  const words = ["sambal", "snack"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullWord = words[currentWordIndex];
    
    const handleTyping = () => {
      if (!isDeleting) {
        // PROSES KETIK: nambah satu huruf
        const nextChar = fullWord.slice(0, currentText.length + 1);
        setCurrentText(nextChar);

        // Kalau sudah lengkap, berhenti sebentar lalu mulai hapus
        if (nextChar === fullWord) {
          setTimeout(() => setIsDeleting(true), 1500); // Delay 1.5 detik saat kata lengkap
          return; 
        }
      } else {
        // PROSES HAPUS: kurang satu huruf (backspace)
        const prevChar = fullWord.slice(0, currentText.length - 1);
        setCurrentText(prevChar);

        // Kalau sudah kosong, pindah ke kata berikutnya
        if (prevChar === "") {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          return;
        }
      }
    };

    // Kecepatan: Mengetik (100ms), Menghapus (50ms)
    const typingSpeed = isDeleting ? 50 : 100;
    const timer = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex]);

  return (
    <section id="home" className="relative min-h-screen flex items-center">
      {/* Gambar background dengan Image */}
      <Image
        src="/Gambar/hero-background.jpg"
        alt="Hero Background"
        fill
        className="object-cover -z-10"
        priority
      />
      
      {/* Overlay agar teks terbaca */}
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            <span className="text-red-600 font-black">Nuampoll</span> {currentText}
            <span className="animate-pulse">|</span> {/* Cursor blinking */}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 italic">
            "Sekali Nyoba, Langsung Nuampoll!" - Dibuat dengan cabai pilihan dan bumbu rahasia nusantara.
          </p>
          <a 
            href="#menu" 
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105"
          >
            Lihat Menu Sekarang <FiChevronRight size={20} />
          </a>
        </div>
      </div>
    </section>
  );
}