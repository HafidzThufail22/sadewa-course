import { supabase } from "../../lib/supabase";
import { Package } from "../../types";


// Perhatikan ada kata "async" di sini
export default async function PackagesSection() {
  // 1. Menarik data dari Supabase (Tabel 'packages')
  // Kita urutkan berdasarkan harga dari yang termurah (ascending)
  const { data: packages, error } = await supabase
    .from("packages")
    .select("*")
    .order("price", { ascending: true });

  // 2. Jika koneksi atau data error
  if (error) {
    console.error("Error fetching packages:", error);
    return <p className="text-center text-red-500">Gagal memuat data paket.</p>;
  }

  // 3. Menampilkan UI
  return (
    <section className="py-12 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3">Pilih Paket Kursus</h2>
        <p className="text-gray-600">
          Temukan paket belajar mengemudi yang sesuai dengan kebutuhan Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Melakukan perulangan / mapping data dari Supabase */}
        {packages?.map((pkg: Package) => (
          <div
            key={pkg.id}
            className={`p-6 rounded-2xl border-2 bg-white relative transition-all hover:shadow-lg ${
              pkg.is_popular ? "border-blue-500 shadow-md" : "border-gray-100"
            }`}
          >
            {/* Label Paling Populer (Muncul hanya jika is_popular = true) */}
            {pkg.is_popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                Paling Populer
              </div>
            )}

            <div className="text-center mb-6 mt-2">
              <h3 className="text-lg font-bold text-gray-800">{pkg.name}</h3>
              <span className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold mt-2">
                {pkg.duration}
              </span>
            </div>

            <div className="text-center mb-6">
              <p className="text-3xl font-extrabold text-gray-900">
                {/* Format angka menjadi Rupiah */}
                Rp {pkg.price.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="text-center text-gray-600 text-sm mb-8 flex justify-center items-center gap-2">
              🚗 <span>{pkg.vehicle}</span>
            </div>

            <button
              className={`w-full py-3 rounded-xl font-semibold transition-colors ${
                pkg.is_popular
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-50 text-gray-800 hover:bg-gray-100"
              }`}
            >
              Pilih Paket
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
