import Navbar from "../../components/layout/public/Navbar";
import Footer from "../../components/layout/public/Footer";

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
    <>
      <Navbar />

      {children}

      <Footer />
    </>
  );
}
