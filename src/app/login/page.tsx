"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase"; // Pastikan path ini sesuai dengan file supabase.ts kamu
import { FaEye, FaEyeSlash } from "react-icons/fa";

type AdminRole = "admin" | "super_admin";

function normalizeRole(role: unknown): AdminRole | null {
  if (typeof role !== "string") return null;

  const compactRole = role
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  if (compactRole === "admin") return "admin";

  if (compactRole === "superadmin") return "super_admin";

  return null;
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // State baru untuk menampung input dan status
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Logika Autentikasi
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 1. Proses Autentikasi ke Supabase
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) throw new Error("Email atau kata sandi salah.");
      if (!authData.user) throw new Error("Terjadi kesalahan sistem.");

      // 2. Cek Role dari tabel user_role
      const { data: roleRows, error: roleError } = await supabase
        .from("user_role")
        .select("user_id, role")
        .eq("user_id", authData.user.id)
        .limit(1);

      const roleData = roleRows?.[0];
      const metadataRole = normalizeRole(authData.user.app_metadata?.role);
      const role = normalizeRole(roleData?.role) ?? metadataRole;

      console.info("Login role check", {
        authUserId: authData.user.id,
        roleRows,
        roleError,
        metadataRole: authData.user.app_metadata?.role,
        normalizedRole: role,
      });

      if (roleError && !metadataRole) {
        // Jika akun tidak punya role, paksa keluar (logout)
        await supabase.auth.signOut();
        throw new Error(
          "Gagal membaca role admin. Pastikan tabel user_role tersedia, memiliki kolom user_id dan role, serta policy Supabase mengizinkan user login membaca role miliknya.",
        );
      }

      if (!role) {
        await supabase.auth.signOut();
        throw new Error(
          `Akun Anda belum memiliki role admin. User ID: ${authData.user.id}. Role terbaca: ${roleData?.role ?? "kosong"}.`,
        );
      }

      // 3. Simpan Role di Local Storage
      localStorage.setItem("userRole", role);
      window.dispatchEvent(new Event("userRoleChange"));

      // 4. Arahkan ke dasbor admin
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login gagal.");
    } finally {
      setIsLoading(false);
    }
  };

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
        {/* Background: gambar blur di belakang form */}
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

          {/* Menampilkan Pesan Error jika gagal login */}
          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-500/50 text-white p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleLogin}>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="autofill-transparent w-full bg-transparent border-b border-white/40 text-white placeholder-white/40 py-2 text-sm focus:outline-none focus:border-white transition-colors"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="autofill-transparent w-full bg-transparent border-b border-white/40 text-white placeholder-white/40 py-2 text-sm focus:outline-none focus:border-white transition-colors pr-8"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  aria-label={
                    showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"
                  }
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
              disabled={isLoading}
              className={`w-full text-gray-900 font-bold py-3 rounded-lg mt-2 transition-all duration-200 shadow-md ${
                isLoading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100 hover:scale-[1.01]"
              }`}
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
