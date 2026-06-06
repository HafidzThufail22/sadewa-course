"use client";

import Image from "next/image";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full flex">

      {/* LEFT — Gambar penuh */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/images/hero-images.png"
          alt="LPK Sadewa"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Overlay gelap tipis */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* RIGHT — Form Login */}
      <div className="relative w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        {/* Background: gambar blur di belakang form (versi mobile & kanan desktop) */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/hero-images.png"
            alt=""
            fill
            className="object-cover object-center"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        </div>

        {/* Form Card */}
        <div className="w-full max-w-md">
          {/* Judul */}
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold text-white mb-2">
              Selamat Datang
            </h1>
            <p className="text-gray-300 text-sm">
              Masukkan detail akun Anda untuk melanjutkan.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-white font-semibold text-sm mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Masukkan email Anda"
                autoComplete="email"
                className="w-full bg-transparent border-b border-white/40 text-white placeholder-white/40 py-2 text-sm focus:outline-none focus:border-white transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-white font-semibold text-sm mb-2"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-transparent border-b border-white/40 text-white placeholder-white/40 py-2 text-sm focus:outline-none focus:border-white transition-colors pr-8"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Remember me + Lupa sandi */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 accent-primary rounded"
                />
                <span className="text-white/70 text-sm">Ingat saya</span>
              </label>
              <a
                href="#"
                className="text-white/70 text-sm hover:text-white transition-colors"
              >
                Lupa kata sandi?
              </a>
            </div>

            {/* Tombol Masuk */}
            <button
              id="btn-login"
              type="submit"
              className="w-full bg-white text-gray-900 font-bold py-3 rounded-lg mt-2 hover:bg-gray-100 transition-all duration-200 hover:scale-[1.01] shadow-md"
            >
              Masuk
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
