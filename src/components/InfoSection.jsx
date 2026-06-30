import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Users,
  Phone,
  QrCode,
  Loader2,
} from "lucide-react";
// Import koneksi db Firestore dari config Firebase Anda
import { db } from "../Config/firebase";
import { doc, getDoc } from "firebase/firestore";
import qr from "../assets/qr.png";
import { toast } from "sonner";
import maklumat from "../assets/Maklumat-pelayanan.png";
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
  const [liveData, setLiveData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Data Landing Page dari Firestore
  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const docRef = doc(db, "landing_page_data", "sipol_info");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setLiveData(docSnap.data());
        } else {
          console.error("Dokumen sipol_info tidak ditemukan di database.");
        }
      } catch (error) {
        console.error("Gagal memuat data dari Firestore:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLandingData();
  }, []);

  // Tampilan Placeholder Menunggu Data Realtime Selesai Dimuat
  if (isLoading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#700D09]" />
        <span className="text-xs text-slate-400 mt-3 font-light tracking-wide">
          Memuat Informasi Sinkronisasi SIPOL...
        </span>
      </div>
    );
  }

  // Fallback pengaman jika data gagal dimuat atau kosong di Firestore
  if (!liveData) return null;

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

            {/* Dasar Hukum (Fetched Online) */}
            {liveData.dasar_hukum && liveData.dasar_hukum.length > 0 && (
              <div>
                <h4 className="font-black text-slate-900 mb-6 flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <AlertCircle size={20} className="text-orange-600" />
                  </div>{" "}
                  Dasar Hukum
                </h4>
                <div className="space-y-3">
                  {liveData.dasar_hukum.map((item, i) => (
                    <a
                      key={i}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-[#700D09] hover:text-white transition-all group"
                    >
                      <span className="font-semibold text-sm">{item.nama}</span>
                      <span className="text-[10px] bg-white/20 px-2 py-1 rounded border border-current">
                        PDF
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* 1. MAKLUMAT PELAYANAN (POSISI ATAS: SEBAGAI PAYUNG INFORMASI) */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-md">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  {/* Gambar Maklumat */}
                  <div className="w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-md flex-shrink-0">
                    <img
                      src={maklumat}
                      alt="Maklumat Pelayanan KPU Kabupaten Sekadau"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  {/* Teks Pernyataan Maklumat */}
                 
                </div>
              </div>

              {/* 2. AKSES TEKNIS (POSISI BAWAH: QR CODE & KONTAK HELPDESK) */}
              <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-100 grid md:grid-cols-12 gap-6 items-center">
                {/* Sub-Kiri: QR Scan */}
                <div className="md:col-span-5 flex flex-col items-center text-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                  <div className="mb-3 p-2 bg-slate-50 rounded-xl border border-slate-200/60 inline-block">
                    <img
                      src={qr}
                      alt="QR Code Pelayanan KPU"
                      className="w-28 h-28 object-contain"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
                    <QrCode size={12} className="text-[#700D09]" /> Scan QR
                    Panduan
                  </span>
                </div>

                {/* Sub-Kanan: Kontak WhatsApp Helpdesk */}
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <h4 className="font-black text-slate-900 text-base flex items-center gap-2 mb-1">
                      Kontak Pelayanan Helpdesk
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Butuh bantuan teknis kilat terkait kendala aplikasi SIPOL?
                      Sila hubungi tim admin Helpdesk KPU Kabupaten Sekadau.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <a
                      href="https://wa.me/6289618601348"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white hover:bg-[#700D09] hover:text-white rounded-xl transition-all border border-slate-100 group shadow-sm"
                    >
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                        <Phone size={14} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 group-hover:text-red-200 font-medium">
                          Operator 1
                        </p>
                        <p className="text-xs font-bold">
                          Agung
                        </p>
                      </div>
                    </a>

                    <a
                      href="https://wa.me/6282261247070"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-white hover:bg-[#700D09] hover:text-white rounded-xl transition-all border border-slate-100 group shadow-sm"
                    >
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
                        <Phone size={14} />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 group-hover:text-red-200 font-medium">
                          Operator 2
                        </p>
                        <p className="text-xs font-bold">
                          Genta
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
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

            {/* Lingkup Data (Expandable List - Fetched Online) */}
            {liveData.cakupan_data && liveData.cakupan_data.length > 0 && (
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h4 className="font-black text-slate-900 mb-6 text-sm uppercase tracking-widest">
                  Komponen Data Untuk Pemutakhiran
                </h4>
                <div className="space-y-4">
                  {liveData.cakupan_data.map((item, i) => (
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
