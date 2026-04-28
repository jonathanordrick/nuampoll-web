'use client';
import React from 'react';
import Navbar from "./components/Navbar";
import Header from "./components/Hero";
import About from "./components/About";
import Menu from "./components/Menu";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
export default function Home() {

  return (
    <>
      <Navbar />
      <Header />
      <About />
      <Menu />
      <Contact />
      <Footer />
    </>
  );
}
