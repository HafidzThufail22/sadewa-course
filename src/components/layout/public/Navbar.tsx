"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaCar } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll Effect: Menambahkan event listener untuk mendeteksi scroll dan mengubah state isScrolled
  useEffect(() => {
    const handleScroll = () => {
      // Jika di-scroll lebih dari 20px, ubah state menjadi true
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Beranda", href: "#" },
    { name: "Tentang", href: "#" },
    { name: "Paket", href: "#" },
    { name: "Lokasi", href: "#" },
    { name: "Kontak", href: "#" },
  ];

  return (
    // Wrapper utama: fixed di atas, transisi halus
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled ? "py-4" : "py-0"
      }`}
    >
      {/* Container Navbar yang bentuknya akan berubah */}
      <nav
        className={`mx-auto flex items-center justify-between transition-all duration-300 ease-in-out ${
          isScrolled
            ? "max-w-5xl bg-white/80 backdrop-blur-md shadow-lg rounded-full px-8 py-3 border border-gray-100" // Mode Kapsul (Scrolled)
            : "max-w-7xl bg-transparent px-6 py-6" // Mode Default (Transparan, Lebar)
        }`}
      >
        {/* LOGO KIRI */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary text-white p-2 rounded-lg group-hover:bg-primary-hover transition-colors">
            <FaCar className="text-xl" />
          </div>
          <span className="font-heading font-bold text-xl text-gray-900 tracking-tight">
            LPK Sadewa
          </span>
        </Link>

        {/* MENU TENGAH (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* TOMBOL KANAN (Desktop) */}
        <div className="hidden md:block">
          <Link
            href="#"
            className="bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors shadow-sm"
          >
            Daftar
          </Link>
        </div>

        {/* TOMBOL MENU (Mobile) */}
        <button
          className="md:hidden text-gray-800 text-2xl"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <HiX /> : <HiMenu />}
        </button>
      </nav>

      {/* DROPDOWN MENU MOBILE */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full px-4 mt-2">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-600 font-medium hover:text-primary px-4 py-2 hover:bg-surface rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="#"
              className="bg-primary text-white text-center font-semibold px-4 py-3 rounded-xl mt-2"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
