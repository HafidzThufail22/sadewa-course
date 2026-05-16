import HeroSection from "../../components/sections/HeroSection";
import PackagesSection from "../../components/sections/PackagesSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />

      {/* Section Paket Kursus */}
      <div id="paket" className="py-10 bg-gray-50">
        <PackagesSection />
      </div>

      {/* Sesi lainnya (About, Contact) nanti menyusul di bawah sini */}
    </main>
  );
}
