import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  weight: ["400", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "LPK Sadewa Course",
  description: "Belajar mengemudi aman dan nyaman bersama instruktur berpengalaman.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${poppins.variable}`}>
      <body className="bg-white font-sans text-gray-800 antialiased">
        {children}
      </body>
    </html>
  );
}
