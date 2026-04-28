"use client";
import { FaInstagram, FaTiktok, FaWhatsapp, FaMapPin } from "react-icons/fa";
import { BsTelephone } from "react-icons/bs";
import { MdEmail } from "react-icons/md";

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-[#fff0c7]">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          <span className="text-[#f00000]">Hubungi</span> Kami
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Google Maps di Kiri */}
          <div className="rounded-2xl p-1 bg-[#f00000] shadow-2xl"> {/* Peta di dalam bingkai merah */}
            <div className="rounded-xl overflow-hidden bg-white">
                <iframe
                src="https://www.google.com/maps/embed?..."
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
            </div>

          {/* Social Media di Kanan */}
          <div className="flex flex-col justify-center items-center gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center">Ikuti Kami</h3>
              <p className="text-[#1a1a1a] text-center mb-8">Hubungi kami melalui sosial media untuk update terbaru dan penawaran menarik.</p>
            </div>

            <div className="flex gap-8">
              {/* Instagram */}
              <a
                href="https://instagram.com/nuampoll"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:scale-110 transition-transform shadow-lg"
              >
                <FaInstagram size={32} className="text-white" />
              </a>

              {/* TikTok */}
              <a
                href="https://tiktok.com/@nuampoll"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-16 h-16 bg-black rounded-full hover:scale-110 transition-transform shadow-lg border border-white/20"
              >
                <FaTiktok size={32} className="text-white" />
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/6282220047070"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-16 h-16 bg-green-600 rounded-full hover:scale-110 transition-transform shadow-lg hover:bg-green-700"
              >
                <FaWhatsapp size={32} className="text-white" />
              </a>
            </div>

            <div className="text-center text-[#1a1a1a] mt-6 space-y-3">
              <p className="flex items-center justify-center gap-2"><FaMapPin /> Jalan Raya Nuampoll No. 123</p>
              <p className="flex items-center justify-center gap-2"><BsTelephone /> +62 822 2004 7070</p>
              <p className="flex items-center justify-center gap-2"><MdEmail /> info@nuampoll.com</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}