import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Users,
  Phone,
  QrCode,
} from "lucide-react";
import scheduleData from "../data/schedule.json";
import qr from "../assets/qr.png";

// Pastikan data deskripsi sesuai dengan kunci yang ada di cakupan_data
const deskripsiCakupan = {
  "Kepengurusan Partai Politik":
    "Data ketua, sekretaris, dan bendahara di tingkat pusat hingga kecamatan.",
  "Keterwakilan Perempuan":
    "Memastikan kuota keterwakilan perempuan minimal 30% dalam kepengurusan.",
  "Keanggotaan Partai Politik":
    "Sinkronisasi data KTA dan NIK anggota untuk validitas pemilih.",
  "Domisili Kantor Tetap":
    "Informasi domisili dan status sewa atau kepemilikan kantor tetap partai.",
};

const InfoSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section
      id="panduan-qr"
      className="py-24 bg-white relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 -z-0" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        {/* Header Section */}
        <div className="max-w-3xl mb-16">
          <span className="text-[#700D09] font-bold tracking-widest uppercase text-sm border-l-4 border-[#700D09] pl-4 mb-2 block">
            Panduan Informasi
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
            Pemutakhiran Data <br />
            <span className="text-[#700D09]">Partai Politik</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-12 gap-12">
          {/* Kolom Kiri */}
          <div className="md:col-span-7 space-y-12">
            <div className="bg-white border-l-8 border-[#700D09] p-8 shadow-sm">
              <p className="text-slate-600 text-lg leading-relaxed">
                Proses pemutakhiran data berkelanjutan melalui{" "}
                <strong>SIPOL</strong> bertujuan menjaga integritas data
                kepesertaan Pemilu. Hal ini berpedoman pada PKPU terbaru untuk
                memastikan akuntabilitas dan transparansi di seluruh tingkatan
                wilayah.
              </p>
            </div>

            {/* Dasar Hukum */}
            <div>
              <h4 className="font-black text-slate-900 mb-6 flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <AlertCircle size={20} className="text-orange-600" />
                </div>{" "}
                Dasar Hukum
              </h4>
              <div className="space-y-3">
                {scheduleData.dasar_hukum.map((item, i) => (
                  <a
                    key={i}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-slate-50 healthiest rounded-xl hover:bg-[#700D09] hover:text-white transition-all group"
                  >
                    <span className="font-semibold text-sm">{item.nama}</span>
                    <span className="text-[10px] bg-white/20 px-2 py-1 rounded border border-current">
                      PDF
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* ========================================================= */}
            {/* TEMPAT BARU: QR CODE & KONTAK PELAYANAN HELPDESK */}
            {/* ========================================================= */}
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-100 grid sm:grid-cols-12 gap-6 items-center">
              {/* Bagian QR Code */}
              <div className="sm:col-span-5 flex flex-col items-center text-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="mb-2 p-1 bg-slate-50 rounded-lg">
                  <img 
                    src={qr} 
                    alt="QR Code Pelayanan KPU" 
                    className="w-32 h-32 md:w-36 md:h-36 object-contain"
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <QrCode size={12} className="text-[#700D09]" /> Scan QR Layanan
                </span>
              </div>

              {/* Bagian Kontak */}
              <div className="sm:col-span-7 space-y-4">
                <div>
                  <h4 className="font-black text-slate-900 text-lg flex items-center gap-2 mb-1">
                    Kontak Pelayanan
                  </h4>
                  <p className="text-xs text-slate-500">
                    Butuh bantuan teknis terkait SIPOL? Hubungi tim admin Helpdesk KPU Kabupaten Sekadau.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <a 
                    href="https://wa.me/6289618601348" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-white hover:bg-[#700D09] hover:text-white rounded-xl transition-all border border-slate-100 group shadow-sm"
                  >
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                      <Phone size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 group-hover:text-red-200 transition-colors font-medium">Admin Helpdesk 1</p>
                      <p className="text-sm font-bold">Genta (0896-1860-1348)</p>
                    </div>
                  </a>

                  <a 
                    href="https://wa.me/6282261247070" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-white hover:bg-[#700D09] hover:text-white rounded-xl transition-all border border-slate-100 group shadow-sm"
                  >
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                      <Phone size={16} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 group-hover:text-red-200 transition-colors font-medium">Admin Helpdesk 2</p>
                      <p className="text-sm font-bold">Agung (0822-6124-7070)</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            {/* ========================================================= */}

          </div>

          {/* Kolom Kanan */}
          <div className="md:col-span-5 space-y-8">
            {/* Pihak Terkait */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg">
              <h4 className="font-bold mb-6 text-slate-800 uppercase tracking-widest text-xs">
                Pihak Terkait & Peran
              </h4>
              <div className="flex flex-col gap-3">
                {[
                  {
                    title: "KPU",
                    desc: "Verifikator Data & Dokumen",
                    color: "bg-blue-50 text-blue-600",
                  },
                  {
                    title: "Partai Politik",
                    desc: "Input & Update melalui SIPOL",
                    color: "bg-orange-50 text-orange-600",
                  },
                  {
                    title: "Bawaslu",
                    desc: "Pengawasan Melekat",
                    color: "bg-emerald-50 text-emerald-600",
                  },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all"
                  >
                    <div className={`p-3 rounded-xl ${p.color}`}>
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900">
                        {p.title}
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {p.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lingkup Data (Expandable List) */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <h4 className="font-black text-slate-900 mb-6 text-sm uppercase tracking-widest">
                Komponen Data Untuk Pemutakhiran
              </h4>
              <div className="space-y-4">
                {scheduleData.cakupan_data.map((item, i) => (
                  <div
                    key={i}
                    className={`group rounded-2xl transition-all duration-300 border ${
                      openIndex === i
                        ? "bg-[#700D09]/5 border-[#700D09]/20"
                        : "bg-slate-50 border-transparent hover:bg-slate-100"
                    }`}
                  >
                    <button
                      onClick={() => setOpenIndex(openIndex === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 font-bold text-sm text-slate-800"
                    >
                      <span className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                            openIndex === i
                              ? "bg-[#700D09] text-white"
                              : "bg-white text-orange-500 shadow-sm"
                          }`}
                        >
                          <CheckCircle2 size={14} />
                        </div>
                        {item}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-300 ${
                          openIndex === i
                            ? "rotate-180 text-[#700D09]"
                            : "text-slate-400"
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {openIndex === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-4 text-sm text-slate-600 leading-relaxed border-t border-[#700D09]/10">
                            {deskripsiCakupan[item] ||
                              "Informasi detail terkait elemen data ini."}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;