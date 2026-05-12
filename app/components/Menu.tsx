"use client";
import { useState } from "react";
import Link from "next/link";
import { FiSend, FiBook } from "react-icons/fi";

export default function Menu() {
  const [showModal, setShowModal] = useState(false);
  const menus = [
    { name: "Nuampoll Tomate", price: "10k", image: "/Gambar/nuampoll_tomate.jpg" }
  ];

  const handleMenuLainnya = () => {
    alert("Halaman ini sedang dibuat");
  };

  return (
    <section id="menu" className="py-24 bg-[#fff0c7]">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          <span className="text-red-600">Menu</span> Unggulan
        </h2>

        <div className="grid grid-cols-1 gap-8 justify-items-center">
          {menus.map((item, index) => (
            <div key={index} className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 shadow-xl hover:border-red-600/50 transition-all group">
              <img src={item.image} className="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform" alt={item.name} />
              <h3 className="text-xl font-bold text-white mt-1">{item.name}</h3>
              <p className="text-red-600 font-black mt-2">IDR {item.price}</p>
            </div>
          ))}
        </div>

        {/* Tombol di bawah */}
        <div className="flex justify-center gap-5 md:gap-20 mt-12">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 shadow-lg hover:bg-red-600 hover:scale-105 text-white font-bold rounded-full transition cursor-pointer"
          >
            Lihat Menu Lainnya
            <FiBook className="w-7 h-7 md:w-5 md:h-5" />
          </button>
          <div className="flex items-center gap-2 px-6 py-3 bg-green-600 shadow-lg text-center hover:bg-green-600 hover:scale-105 text-white font-bold rounded-full transition cursor-pointer">
            <a
              href="https://wa.me/6282220047070?text=Halo,%20apakah%20PO%20nuampoll%20sudah%20dibuka?"
              target="_blank"
              rel="noopener noreferrer"
            >
              Informasi lebih lanjut
            </a>
            <FiSend className="w-7 h-7 md:w-5 md:h-5" />
          </div>
        </div>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
            {/* Container Modal - Kita buat lebih lebar (max-w-4xl) agar AnyFlip lega */}
            <div className="max-w-4xl w-full rounded-3xl bg-[#111111] p-4 md:p-8 text-white shadow-2xl relative">

              {/* Header Modal */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl md:text-2xl font-bold">Katalog Menu</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 cursor-pointer hover:text-white transition"
                >
                  ✕
                </button>
              </div>

              {/* Container Iframe dengan Aspect Ratio 16:9 atau 4:3 */}
              <div className="relative w-full overflow-hidden rounded-xl bg-white aspect-[3/4] md:aspect-video">
                <iframe
                  src="https://anyflip.com/vkaxr/ornw/"
                  className="absolute top-0 left-0 w-full h-full border-none"
                  allowFullScreen={true}
                  scrolling="no"
                ></iframe>
              </div>

              {/* Button Tutup di bawah */}
              <p className="mt-4 text-xl text-center md:text-2xl font-medium">Geser ke kanan untuk melihat menu lainnya</p>
              <button
                onClick={() => setShowModal(false)}
                className="w-full mt-2 rounded-full bg-red-600 hover:bg-red-700 px-6 py-3 font-bold transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}