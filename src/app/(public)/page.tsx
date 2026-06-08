import HeroSection from "../../components/sections/HeroSection";
import PackagesSection from "../../components/sections/PackagesSection";
import AboutSection from "../../components/sections/AboutSection";
import LocationSection from "../../components/sections/LocationSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div id="home">
        <HeroSection />
      </div>

      {/* Section Paket Kursus */}
      <div id="packages" className="bg-gray-50">
        <PackagesSection />
      </div>

      {/* Section About */}
      <div id="about">
        <AboutSection />
      </div>

      {/* Section Lokasi */}
      <div id="location">
        <LocationSection />
      </div>

    </main>
  );
}
