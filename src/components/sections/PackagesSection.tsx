import { supabase } from "../../lib/supabase";
import { Package } from "../../types";
import { FaCar } from "react-icons/fa";

// Server Component — fetch langsung dari Supabase
export default async function PackagesSection() {
  const { data: packages, error } = await supabase
    .from("packages")
    .select("*")
    .order("price", { ascending: true });

  if (error) {
    console.error("Error fetching packages:", error);
    return (
      <p className="text-center text-red-500">Gagal memuat data paket.</p>
    );
  }

  return (
    <section id="paket" className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Pilih Paket yang Sesuai
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Temukan paket belajar mengemudi yang sesuai dengan kebutuhan Anda.
          </p>
        </div>

        {/* Card Grid — 1 kolom mobile, 2 tablet, 4 desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {packages?.map((pkg: Package) => (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-2xl flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                pkg.is_popular
                  ? "border-2 border-blue-500 shadow-xl shadow-blue-100"
                  : "border border-gray-200 hover:shadow-lg hover:shadow-gray-100"
              }`}
            >
              {/* Badge Paling Populer */}
              {pkg.is_popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md whitespace-nowrap">
                    Paling Populer
                  </span>
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                {/* Nama & Durasi */}
                <div className="text-center mb-5 mt-2">
                  <h3 className="text-lg font-extrabold text-gray-900 mb-3">
                    {pkg.name}
                  </h3>
                  {pkg.duration && (
                    <span className="inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                      {pkg.duration}
                    </span>
                  )}
                </div>

                {/* Harga */}
                <div className="text-center mb-3">
                  <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Rp {pkg.price.toLocaleString("id-ID")}
                  </p>
                </div>

                {/* Deskripsi — di bawah harga */}
                {pkg.description && (
                  <p className="text-center text-gray-500 text-sm leading-relaxed mb-5 px-1">
                    {pkg.description}
                  </p>
                )}

                {/* Divider */}
                <div className="border-t border-gray-100 my-1" />

                {/* Info Kendaraan */}
                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm py-4">
                  <FaCar className="text-blue-400 flex-shrink-0" />
                  <span>{pkg.vehicle}</span>
                </div>

                {/* Spacer agar tombol selalu di bawah */}
                <div className="flex-1" />

                {/* Tombol */}
                <button
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 mt-2 ${
                    pkg.is_popular
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-blue-400 hover:text-blue-600"
                  }`}
                >
                  Pilih Paket
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
