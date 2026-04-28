"use client";
import { useState } from "react";
import Link from "next/link";
import { FiSend, FiBook } from "react-icons/fi";

export default function Menu() {
  const [showModal, setShowModal] = useState(false);
  const menus = [
    { name: "Sambal Ulek Bawang", price: "25k", image: "/Gambar/sambal_bawang.jpg" },
    { name: "Sambal Ulek Terasi", price: "25k", image: "/Gambar/sambal_terasi.jpg" },
    { name: "Makaroni Nyamm", price: "15k", image: "/Gambar/makaroni_nyamm.jpg" },
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {menus.map((item, index) => (
            <div key={index} className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5 shadow-xl hover:border-red-600/50 transition-all group">
              <img src={item.image} className="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform" alt={item.name} />
              <h3 className="text-xl font-bold text-white mt-1">{item.name}</h3>
              <p className="text-red-600 font-black mt-2">IDR {item.price}</p>
            </div>
          ))}
        </div>
        
        {/* Tombol di bawah */}
        <div className="flex justify-center gap-20 mt-12">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 shadow-lg hover:bg-red-600 hover:scale-105 text-white font-bold rounded-full transition cursor-pointer"
          >
            Lihat Menu Lainnya
            <FiBook size={20} />
          </button>
          <div className="flex items-center gap-2 px-6 py-3 bg-green-600 shadow-lg hover:bg-green-600 hover:scale-105 text-white font-bold rounded-full transition cursor-pointer">
            <a 
              href="https://wa.me/6282220047070?text=Halo,%20saya%20ingin%20pesan%20sambal%20Nuampoll"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pesan Sekarang
            </a>
            <FiSend size={20} />
          </div>
        </div>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="max-w-md w-full rounded-3xl bg-[#111111] p-8 text-white shadow-2xl">
              <h3 className="text-2xl font-bold mb-4">Halaman Sedang Dibuat</h3>
              <p className="text-gray-300 mb-6">
                Menu lainnya akan segera hadir.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="w-full rounded-full bg-red-600 hover:bg-red-700 px-6 py-3 font-bold transition cursor-pointer"
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