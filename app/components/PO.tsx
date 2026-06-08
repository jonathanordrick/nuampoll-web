'use client';
import React from 'react';

export default function PO() {
    const [isPOOpen, setIsPOOpen] = React.useState(false);

    React.useEffect(() => {
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => {
                if (data.isPOOpen !== undefined) {
                    setIsPOOpen(data.isPOOpen === "true");
                }
            })
            .catch(err => console.error("Failed to fetch PO status:", err));
    }, []);

    return (
        <section id="preorder" className="py-24 bg-[#fff0c7]">
            <div className="container mx-auto px-6 text-center">
                {/* Judul Section */}
                <h2 className="text-3xl md:text-4xl font-bold mb-12">
                    <span className="text-red-600">Pre-Order</span> Session
                </h2>

                <div className="max-w-2xl mx-auto bg-[#1a1a1a] p-8 md:p-12 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden">
                    {/* Dekorasi Aksen Merah */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 blur-3xl -mr-16 -mt-16 rounded-full"></div>

                    {isPOOpen ? (
                        /* --- TAMPILAN JIKA PO BUKA --- */
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/20 text-green-500 rounded-full text-xs font-bold mb-6 animate-pulse border border-green-500/20">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                BATCH SEDANG DIBUKA
                            </div>

                            <h3 className="text-2xl md:text-3xl font-black text-white mb-4">
                                Amankan Slot <span className="text-red-600">Nuampoll-mu!</span>
                            </h3>

                            <p className="text-gray-400 mb-10 leading-relaxed">
                                Batch kali ini sangat terbatas, jangan sampai kehabisan lagi.
                                Klik tombol di bawah untuk pesan via Google Form.
                            </p>

                            <a
                                href="https://wa.me/6282220047070?text=Halo,%20Mau%20PO%20{menu%20kesukaanmu}" // Ganti dengan link GForm kamu
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-12 rounded-full transition-all transform hover:scale-105 shadow-lg shadow-red-600/20"
                            >
                                Pesan Sekarang
                            </a>
                        </div>
                    ) : (
                        /* --- TAMPILAN JIKA PO TUTUP --- */
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-500/20 text-gray-400 rounded-full text-xs font-bold mb-6 border border-white/10">
                                <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                                BATCH SELESAI
                            </div>

                            <h3 className="text-2xl md:text-3xl font-black text-white mb-4">
                                Pre-Order Sedang <span className="text-gray-500">Istirahat</span>
                            </h3>

                            <p className="text-gray-400 mb-6 leading-relaxed">
                                Maaf, slot batch kali ini sudah penuh. Tim Nuampoll lagi fokus ngulek sambelnya.
                            </p>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 inline-block">
                                <p className="text-red-500 font-bold italic">
                                    "Terus pantau akun sosial media kami untuk info batch selanjutnya!"
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}