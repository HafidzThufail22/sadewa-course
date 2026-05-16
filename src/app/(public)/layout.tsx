import { Inter, Poppins } from "next/font/google";
import "../globals.css";
// 1. Import Navbar yang baru kita buat
import Navbar from "../../components/layout/public/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  weight: ["400", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "LPK Sadewa Course | Kursus Mengemudi Profesional",
  description:
    "Belajar mengemudi aman dan nyaman bersama instruktur berpengalaman.",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${poppins.variable}`}>
      <body className="bg-white font-sans text-gray-800 antialiased">
        {/* 2. Pasang Navbar di sini agar selalu muncul di semua halaman publik */}
        <Navbar />

        {/* 3. Konten halaman akan berada di bawahnya */}
        {children}
      </body>
    </html>
  );
}
