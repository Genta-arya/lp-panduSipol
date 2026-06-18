import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Footer = () => {
  // Nomor telepon (format internasional tanpa + atau 0 di depan, contoh: 62851...)
  const phoneNumber = "6285173284821";
  const emailAddress = "kab_sekadau@kpu.go.id";

  return (
    <footer className="bg-[#700D09] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 mb-12">
        {/* Kolom 1: Informasi Kontak */}
        <div className="space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-tight">
            KPU Kabupaten Sekadau
          </h2>
          <p className="text-orange-200 text-sm leading-relaxed">
            Komisi Pemilihan Umum Kabupaten Sekadau berkomitmen menyelenggarakan
            pemilihan yang berintegritas dan transparan.
          </p>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="text-orange-400 shrink-0" size={20} />
              <span>
                Komplek Perkantoran Pemda, Gonis Tekam, Kec. Sekadau Hilir,
                Kabupaten Sekadau, Kalimantan Barat 79515
              </span>
            </div>

            {/* WA Redirect */}
            <a 
              href={`https://wa.me/${phoneNumber}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:text-orange-300 transition-colors"
            >
              <Phone className="text-orange-400" size={20} />
              <span>0851-7328-4821</span>
            </a>

            {/* Email Redirect */}
            <a 
              href={`mailto:${emailAddress}`}
              className="flex items-center gap-3 hover:text-orange-300 transition-colors"
            >
              <Mail className="text-orange-400" size={20} />
              <span>{emailAddress}</span>
            </a>
          </div>
        </div>

        {/* Kolom 2: Jam Operasional */}
        <div className="space-y-6">
          <h4 className="font-bold uppercase tracking-widest text-orange-400">
            Jam Layanan
          </h4>
          <div className="flex items-start gap-4">
            <Clock className="text-orange-400" size={24} />
            <div className="text-sm space-y-2">
              <p>Senin - Kamis: 08:00 - 16:00</p>
              <p>Jumat: 08:00 - 16:30</p>
              <p className="text-orange-200 italic">*Sabtu & Minggu Libur</p>
            </div>
          </div>
        </div>

        {/* Kolom 3: Lokasi Map */}
        <div className="space-y-4">
          <h4 className="font-bold uppercase tracking-widest text-orange-400">
            Lokasi Kami
          </h4>
          <div className="rounded-2xl overflow-hidden shadow-lg border border-white/10 h-72">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.818263207399!2d110.95269907395831!3d0.00969649999021184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31fdf900460f11b7%3A0x59bf88dd6de90bb6!2sKomisi%20Pemilihan%20umum%20kabupaten%20Sekadau!5e0!3m2!1sid!2sid!4v1781759960192!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0, filter: "grayscale(20%) contrast(1.1)" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi KPU Sekadau"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/10 text-center text-orange-200/60 text-xs">
        © {new Date().getFullYear()} KPU Kabupaten Sekadau. Seluruh Hak Cipta
        Dilindungi.
      </div>
    </footer>
  );
};

export default Footer;