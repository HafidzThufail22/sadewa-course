import PackagesSection from "../../components/sections/PackagesSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Nanti Hero Section dan About Section taruh di atas sini */}

      {/* Memanggil Section Paket yang terhubung ke database */}
      <PackagesSection />
    </main>
  );
}
