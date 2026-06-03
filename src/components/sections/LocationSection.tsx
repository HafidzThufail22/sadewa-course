import { FaMapMarkerAlt, FaClock, FaPhone } from "react-icons/fa";

export default function LocationSection() {
  return (
    <section id="lokasi" className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-primary text-sm font-semibold uppercase tracking-widest mb-3">
            Lokasi Kami
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Temukan Kami
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
            Kunjungi kantor LPK Sadewa atau hubungi kami untuk informasi lebih
            lanjut mengenai pendaftaran kursus mengemudi.
          </p>
        </div>

        {/* Map Card */}
        <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7145.478875978527!2d110.15674935680924!3d-7.8628202646696295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7afb3bbdb701f9%3A0x7031211137245558!2sLPK%20Sadewa!5e1!3m2!1sid!2sid!4v1780500959294!5m2!1sid!2sid"
            width="100%"
            height="420"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi LPK Sadewa"
          />
        </div>

        {/* Info Cards di bawah map */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">

          {/* Alamat */}
          <div className="flex items-start gap-4 bg-gray-50 rounded-xl px-5 py-4 border border-gray-100">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <FaMapMarkerAlt className="text-primary text-sm" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm mb-0.5">Alamat</p>
              <p className="text-gray-500 text-sm leading-relaxed">
                LPK Sadewa, Purworejo,<br />
                Jawa Tengah, Indonesia
              </p>
            </div>
          </div>

          {/* Jam Operasional */}
          <div className="flex items-start gap-4 bg-gray-50 rounded-xl px-5 py-4 border border-gray-100">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <FaClock className="text-primary text-sm" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm mb-0.5">Jam Operasional</p>
              <p className="text-gray-500 text-sm leading-relaxed">
                Senin – Sabtu<br />
                08.00 – 17.00 WIB
              </p>
            </div>
          </div>

          {/* Kontak */}
          <div className="flex items-start gap-4 bg-gray-50 rounded-xl px-5 py-4 border border-gray-100">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <FaPhone className="text-primary text-sm" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm mb-0.5">Hubungi Kami</p>
              <p className="text-gray-500 text-sm leading-relaxed">
                WhatsApp / Telp<br />
                +62 8xx-xxxx-xxxx
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
