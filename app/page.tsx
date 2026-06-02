'use client';
import React, { useEffect } from 'react';
import Navbar from "./components/Navbar";
import Header from "./components/Hero";
import About from "./components/About";
import Menu from "./components/Menu";
import Contact from "./components/Contact";
import PO from "./components/PO";
import Footer from "./components/Footer";

export default function Home() {
  useEffect(() => {
    // Catat kunjungan halaman utama
    fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: window.location.pathname || "/" }),
    }).catch((err) => {
      console.error("Failed to track visit:", err);
    });
  }, []);

  return (
    <>
      <Navbar />
      <Header />
      <About />
      <Menu />
      <PO />
      <Contact />
      <Footer />
    </>
  );
}
