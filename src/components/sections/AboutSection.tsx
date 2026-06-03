import Image from "next/image";
import Link from "next/link";
import { FaShieldAlt, FaHeart, FaCalendarAlt, FaArrowRight } from "react-icons/fa";

const features = [
  {
    icon: <FaShieldAlt className="text-primary text-lg" />,
    title: "Fokus pada Standar dan Keselamatan Kerja",
    desc: "Mengutamakan keselamatan dengan standar pelatihan terbaik dan terukur.",
  },
  {
    icon: <FaHeart className="text-primary text-lg" />,
    title: "Instruktur Sabar",
    desc: "Tim instruktur berpengalaman yang ramah dan sabar membimbing.",
  },
  {
    icon: <FaCalendarAlt className="text-primary text-lg" />,
    title: "Jadwal Fleksibel",
    desc: "Atur jadwal latihan sesuai waktu luang Anda, termasuk weekend.",
  },
];

export default function AboutSection() {
  return (
    <section id="tentang" className="bg-blue-500/10 py-20 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-3">
            Tentang Kami
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Mengapa Memilih Kami?
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
            LPK Sadewa hadir untuk membantu Anda menguasai kemampuan mengemudi
            dengan aman dan percaya diri.
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT — Gambar + Badge Pengalaman */}
          <div className="relative w-full pb-6">
            {/* Gambar utama */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
              <Image
                src="/images/about-images.jpg"
                alt="Instruktur mengemudi LPK Sadewa"
                fill
                className="object-cover"
              />
            </div>

            {/* Badge "10+ Tahun Pengalaman" — overlay pojok kanan bawah */}
            <div className="absolute bottom-0 right-4 md:right-6 bg-primary text-white rounded-2xl px-6 py-4 shadow-lg shadow-blue-300/40">
              <p className="text-3xl font-extrabold leading-none">10+</p>
              <p className="text-sm font-medium mt-1 opacity-90">Tahun Pengalaman</p>
            </div>
          </div>

          {/* RIGHT — Konten Teks */}
          <div className="pt-4 lg:pt-0">
            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-snug mb-4">
              Kursus Mengemudi Profesional{" "}
              <span className="text-primary">dengan Standar Keamanan Tinggi</span>
            </h3>

            <p className="text-gray-600 leading-relaxed mb-8">
              Kami berkomitmen memberikan pelatihan mengemudi terbaik dengan
              mengutamakan keselamatan dan kenyamanan peserta. Setiap instruktur
              kami telah tersertifikasi dan memiliki pengalaman bertahun-tahun
              dalam mengajar.
            </p>

            {/* Feature List */}
            <ul className="space-y-5 mb-10">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-4">
                  {/* Ikon dalam lingkaran tipis */}
                  <div className="flex-shrink-0 w-9 h-9 rounded-full border border-primary/30 bg-white flex items-center justify-center shadow-sm">
                    {f.icon}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{f.title}</p>
                    <p className="text-gray-500 text-sm mt-0.5">{f.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 items-center">
              <Link
                href="#paket"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold px-6 py-3 rounded-full shadow-md shadow-blue-200 transition-all hover:scale-105"
              >
                Daftar Sekarang <FaArrowRight className="text-sm" />
              </Link>
              <Link
                href="#paket"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:underline transition-all"
              >
                Lihat Paket Kursus <FaArrowRight className="text-sm" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
