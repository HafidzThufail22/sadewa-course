import Image from "next/image";
import Link from "next/link";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaAward,
  FaShieldAlt,
} from "react-icons/fa";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-20">
      {/* 1. LAYER GAMBAR LATAR (BACKGROUND) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-images.png" // Path sesuai asetmu
          alt="Belajar Mengemudi LPK Sadewa"
          fill
          priority // Mempercepat loading karena ini gambar utama
          className="object-cover object-right md:object-center" // Mobile fokus kanan, Desktop tengah
        />

        {/* 2. LAYER OVERLAY HITAM (Agar teks mudah dibaca) */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>
      </div>

      {/* 3. LAYER KONTEN (TEKS & TOMBOL) */}
      <div className="container mx-auto px-6 relative z-20 flex items-center justify-center">
        <div className="max-w-5xl text-center px-4">
          {/* Judul Utama */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold text-white leading-tight mb-6">
            Mengemudi Aman &{" "}
            <span className="text-primary italic">Percaya Diri</span>
          </h1>

          {/* Sub Judul */}
          <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed max-w-md md:max-w-4xl mx-auto">
            Belajar mengemudi bersama instruktur profesional dan berpengalaman.
            Metode pembelajaran yang mudah dipahami untuk pemula hingga mahir.
          </p>

          {/* Tombol Aksi (CTA) */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16 justify-center">
            <Link
              href="#paket"
              className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-xl shadow-primary/20"
            >
              Daftar Sekarang <FaArrowRight className="text-sm" />
            </Link>
            <Link
              href="#tentang"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-bold flex items-center justify-center transition-all"
            >
              Lihat Paket
            </Link>
          </div>

          {/* Fitur Utama (3 Ikon di bawah) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-white/20 pt-8 justify-items-center">
            <div className="flex items-center gap-4">
              <div className="bg-white/30 p-3 rounded-lg text-white">
                <FaCalendarAlt className="text-2xl" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">Jadwal Fleksibel</p>
                <p className="text-gray-200 text-sm">Atur waktu luang anda</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-white/30 p-3 rounded-lg text-white">
                <FaAward className="text-2xl" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">10+ Tahun</p>
                <p className="text-gray-200 text-sm">Pengalaman</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-white/30 p-3 rounded-lg text-white">
                <FaShieldAlt className="text-2xl" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">100% Aman</p>
                <p className="text-gray-200 text-sm">Standar keselamatan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
