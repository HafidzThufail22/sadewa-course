import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

// Mendefinisikan properti apa saja yang bisa diterima oleh tombol ini
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "glass" | "white";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string; // Jika sewaktu-waktu butuh menambah class tambahan
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  className = "",
  ...props // Mengambil properti bawaan button (seperti onClick, disabled, type)
}: ButtonProps) {
  
  // 1. Gaya Dasar (Selalu ada di semua tombol)
  // Berisi efek hover scale, shadow, flex, dan rounded-full sesuai referensi kamu
  const baseStyles = "font-bold flex items-center justify-center gap-2 transition-all transform hover:scale-105 rounded-full shadow-xl";

  // 2. Varian Warna (Bisa dipilih melalui prop 'variant')
  const variants = {
    primary: "bg-primary hover:bg-primary-hover text-white shadow-primary/20",
    glass: "bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30",
    white: "bg-white hover:bg-gray-50 text-primary border border-gray-200", // Tombol putih biasa
  };

  // 3. Varian Ukuran (Bisa dipilih melalui prop 'size')
  // Kamu menggunakan px-8 py-4 di hardcode, itu setara dengan ukuran "lg"
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  // Menggabungkan semua class
  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  // LOGIKA SMART BUTTON: 
  // Jika ada prop 'href', jadikan Link Next.js
  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  // Jika tidak ada 'href', jadikan button biasa (untuk Form, Modal, dll)
  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}