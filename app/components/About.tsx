import Image from "next/image";

export default function About() {
  const values = [
    { label: "Nikmat", desc: "Cita rasa otentik." },
    { label: "Yummy", desc: "Lezat di setiap suapan." },
    { label: "Aman", desc: "Tanpa pengawet buatan." },
    { label: "Mantap", desc: "Pedasnya pas dan nagih." }
  ];

  return (
    <section id="about" className="py-24 bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          <span className="text-red-600">Tentang</span> Kami
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative group flex justify-center">
            <Image
              src="/Gambar/dapur.png"
              width={400}
              height={400}
              style={{ height: 'auto' }}
              alt="Dapur Nuampoll"
              className="relative rounded-lg grayscale-0 hover:grayscale transition-all duration-500 shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:shadow-[0_0_15px_rgba(220,38,38,0.3)]"
            />
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4">Kenapa Sambal Nuampoll?</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Kami menggunakan bahan-bahan segar langsung dari petani lokal untuk menjaga kualitas rasa.
              Sesuai visi kami, setiap produk dipastikan higienis dan mengikuti standar rasa yang konsisten.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {values.map((v) => (
                <div key={v.label} className="border border-red-900/30 p-4 rounded-lg bg-blue-950/30">
                  <h4 className="text-red-500 font-bold text-xl">{v.label}</h4>
                  <p className="text-sm text-gray-500">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}