"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [isNavActive, setIsNavActive] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    // Menjalankan feather icons setelah halaman dimuat
    if (typeof window !== "undefined" && (window as any).feather) {
      (window as any).feather.replace();
    }
  }, []);

  return (
    <>
      {/* Navbar start */}
      <nav className="navbar">
        <a href="#" className="navbar-logo">
          Sambal<span>Nuampoll</span>.
        </a>

        <div className={`navbar-nav ${isNavActive ? "active" : ""}`}>
          <a href="#home">Home</a>
          <a href="#about">Tentang Kami</a>
          <a href="#menu">Menu</a>
          <a href="#contact">Kontak</a>
        </div>

        <div className="navbar-extra">
          <a
            href="#"
            id="search-button"
            onClick={(e) => {
              e.preventDefault();
              setIsSearchActive(!isSearchActive);
            }}
          >
            <i data-feather="search"></i>
          </a>
          <a href="#" id="shopping-cart">
            <i data-feather="shopping-cart"></i>
          </a>
          <a
            href="#"
            id="hamburger-menu"
            onClick={(e) => {
              e.preventDefault();
              setIsNavActive(!isNavActive);
            }}
          >
            <i data-feather="menu"></i>
          </a>
        </div>

        {/* Search Form Start */}
        <div className={`search-form ${isSearchActive ? "active" : ""}`}>
          <input
            type="search"
            id="search-box"
            placeholder="Cari sambal favoritmu..."
          />
          <label htmlFor="search-box">
            <i data-feather="search"></i>
          </label>
        </div>
      </nav>
      {/* Navbar end */}

      {/* Hero Section start */}
      <section className="hero" id="home">
        <div className="mask-container">
          <main className="content">
            <h1>
              Pedasnya <span>Nampol</span> Di Lidah!
            </h1>
            <p>Dibuat dengan cabai pilihan dan bumbu rahasia nusantara.</p>
            <a href="#menu" className="cta">
              Pesan Sekarang
            </a>
          </main>
        </div>
      </section>
      {/* Hero Section end */}

      {/* About Section start */}
      <section id="about" className="about">
        <h2>
          <span>Tentang</span> Kami
        </h2>
        <div className="row">
          <div className="about-image">
            <img src="/Gambar/tentang-kami.jpg" alt="Tentang Kami" />
          </div>
          <div className="content">
            <h3>Kenapa Sambal Nuampoll?</h3>
            <p>
              Kami menggunakan bahan-bahan segar langsung dari petani lokal
              untuk menjaga kualitas rasa.
            </p>
            <p>
              Tanpa pengawet, tanpa pewarna buatan. Hanya rasa pedas murni yang
              bikin nagih.
            </p>
          </div>
        </div>
      </section>
      {/* About Section end */}

      {/* Menu Section start */}
      <section id="menu" className="menu">
        <h2>
          <span>Menu</span> Kami
        </h2>
        <div className="row">
          <div className="menu-card">
            <img
              src="/Gambar/1.jpg"
              alt="Sambal Bawang"
              className="menu-card-img"
            />
            <h3 className="menu-card-title">- Sambal Bawang -</h3>
            <p className="menu-card-price">IDR 25k</p>
          </div>
          <div className="menu-card">
            <img
              src="/Gambar/1.jpg"
              alt="Sambal Terasi"
              className="menu-card-img"
            />
            <h3 className="menu-card-title">- Sambal Terasi -</h3>
            <p className="menu-card-price">IDR 25k</p>
          </div>
        </div>
      </section>
      {/* Menu Section end */}

      {/* Contact Section start */}
      <section id="contact" className="contact">
        <h2>
          <span>Kontak</span> Kami
        </h2>
        <div className="row">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.556275243793!2d110.44219592741067!3d-7.061306999999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708f4c0d7d2c59%3A0x821209d1cf01ec21!2sKos%20Wisma%20Dewa%201!5e0!3m2!1sid!2sid!4v1777212395148!5m2!1sid!2sid"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="map"
          ></iframe>

          <form action="">
            <div className="input-group">
              <i data-feather="user"></i>
              <input type="text" placeholder="Nama Lengkap" />
            </div>
            <div className="input-group">
              <i data-feather="mail"></i>
              <input type="email" placeholder="Email" />
            </div>
            <div className="input-group">
              <i data-feather="phone"></i>
              <input type="text" placeholder="Nomor Telepon" />
            </div>
            <button type="submit" className="btn">
              Kirim Pesan
            </button>
          </form>
        </div>
      </section>
      {/* Contact Section end */}

      {/* Footer start */}
      <footer>
        <div className="socials">
          <a href="#">
            <i data-feather="instagram"></i>
          </a>
          <a href="#">
            <i data-feather="facebook"></i>
          </a>
          <a href="#">
            <i data-feather="twitter"></i>
          </a>
        </div>
        <div className="links">
          <a href="#home">Home</a>
          <a href="#about">Tentang Kami</a>
          <a href="#menu">Menu</a>
          <a href="#contact">Kontak</a>
        </div>
      </footer>
    </>
  );
}
