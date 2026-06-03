import { Inter, Poppins } from "next/font/google";
import "../../app/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  weight: ["400", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Admin — LPK Sadewa",
  description: "Halaman admin LPK Sadewa.",
};

export default function AdminLayout({
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
