import HeroSection from "../../components/sections/HeroSection";
import PackagesSection from "../../components/sections/PackagesSection";
import AboutSection from "../../components/sections/AboutSection";
import LocationSection from "../../components/sections/LocationSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />

      {/* Section Paket Kursus */}
      <div className="bg-gray-50">
        <PackagesSection />
      </div>

      {/* Section About */}
      <AboutSection />

      {/* Section Lokasi */}
      <LocationSection />

    </main>
  );
}
