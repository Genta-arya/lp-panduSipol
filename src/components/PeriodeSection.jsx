import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ClipboardCheck,
  CheckCircle,
  FileText,
  X,
  Loader2,
  ArrowUpRight,
  Info
} from "lucide-react";
// Import koneksi db Firestore dari config Firebase Anda
import { db } from "../Config/firebase"; 
import { doc, getDoc } from "firebase/firestore";

const PeriodeSection = () => {
  const [activeTab, setActiveTab] = useState("semester1");
  const [showModal, setShowModal] = useState(false);
  const [liveData, setLiveData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Acuan urutan tab agar Semester 1 selalu berada di depan
  const tabOrder = ["semester1", "semester2"];

  // 1. Fetch Data dari Firestore
  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        const docRef = doc(db, "landing_page_data", "sipol_info");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const fetchedData = docSnap.data();
          setLiveData(fetchedData);
          
          // Memastikan active tab di-set ke key pertama yang valid sesuai acuan tabOrder
          if (fetchedData.jadwal) {
            const validKeys = Object.keys(fetchedData.jadwal);
            const firstKey = tabOrder.find(key => validKeys.includes(key)) || validKeys[0];
            setActiveTab(firstKey);
          }
        } else {
          console.error("Dokumen sipol_info tidak ditemukan.");
        }
      } catch (error) {
        console.error("Gagal memuat data timeline:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimelineData();
  }, []);

  // Mengunci scroll saat modal aktif
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  // Tampilan Placeholder Loading
  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#700D09]" />
        <span className="text-xs text-slate-400 mt-3 font-light tracking-wide">
          Sinkronisasi Jadwal Pemutakhiran...
        </span>
      </div>
    );
  }

  // Pengaman jika data kosong
  if (!liveData || !liveData.jadwal) return null;

  const data = liveData.jadwal[activeTab];

  // Komponen Ikon dengan efek pulse
  const PulseIcon = ({ icon: Icon, isLive, colorClass }) => (
    <div className="relative">
      <div
        className={`w-20 h-20 ${colorClass} rounded-full flex items-center justify-center text-white shadow-lg`}
      >
        <Icon size={36} />
      </div>
      {isLive && (
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`absolute inset-0 ${colorClass} rounded-full z-[-1]`}
        />
      )}
    </div>
  );

  return (
    <section id="jadwal-pemutakhiran" className="py-20 bg-white">
      <div className="text-center mb-12">
        <h2 className="text-sm font-bold text-orange-600 uppercase tracking-[0.2em] mb-2">
          Timeline
        </h2>
        <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tight">
          Jadwal Pemutakhiran Data Partai Politik
        </h3>
        <div className="w-20 h-1.5 bg-[#700D09] mx-auto mt-6 rounded-full" />
      </div>
      
      <div className="max-w-7xl mx-auto md:px-6">
        {/* Tab Switcher Menggunakan tabOrder Agar Urutan Konstan (Smt 1 -> Smt 2) */}
        <div className="flex gap-2 mb-0 overflow-x-auto no-scrollbar">
          {tabOrder
            .filter((key) => liveData.jadwal[key]) // Hanya tampilkan jika key ada di Firestore
            .map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`py-3 px-8 rounded-t-2xl font-black uppercase tracking-widest text-xs whitespace-nowrap transition-all ${
                  activeTab === key
                    ? "bg-black text-white"
                    : "bg-slate-200 text-slate-500 hover:bg-slate-300"
                }`}
              >
                {liveData.jadwal[key].title}
              </button>
            ))}
        </div>

        {/* Container Utama Konten */}
        {data && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-2 border-orange-200 rounded-b-3xl rounded-tr-3xl p-8 md:p-12 shadow-sm bg-white relative"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
              {/* Garis Konektor dengan Animasi Running Line */}
              <div className="absolute top-12 left-0 right-0 h-0.5 bg-slate-200 hidden md:block z-0 overflow-hidden">
                {data.live && (
                  <motion.div
                    className="h-full bg-orange-500 shadow-[0_0_10px_2px_rgba(249,115,22,0.8)]"
                    initial={{ x: "-100%" }}
                    animate={{ x: "400%" }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{ width: "20%" }}
                  />
                )}
              </div>

              {/* Tahap 1: Periode */}
              <div className="relative z-10 flex flex-col items-center text-center w-full md:w-1/3">
                <PulseIcon
                  icon={Calendar}
                  isLive={data.live}
                  colorClass="bg-[#700D09]"
                />
                <h4 className="text-[#700D09] font-black uppercase text-sm mt-4 mb-2">
                  Periode Pemutakhiran
                </h4>
                <p className="text-slate-700 font-medium">{data.range}</p>
              </div>

              {/* Tahap 2: Pengajuan */}
              <div className="relative z-10 flex flex-col items-center text-center w-full md:w-1/3">
                <PulseIcon
                  icon={ClipboardCheck}
                  isLive={false}
                  colorClass="bg-orange-500"
                />
                <h4 className="text-orange-600 font-black uppercase text-sm mt-4 mb-2">
                  Pengajuan (Submit)
                </h4>
                <p className="text-slate-700 text-sm max-w-[220px]">
                  {data.description}
                </p>
              </div>

              {/* Tahap 3: Batas Akhir */}
              <div className="relative z-10 flex flex-col items-center text-center w-full md:w-1/3">
                <PulseIcon
                  icon={CheckCircle}
                  isLive={false}
                  colorClass="bg-black"
                />
                <h4 className="text-black font-black uppercase text-sm mt-4 mb-2">
                  Batas Akhir Pengajuan
                </h4>
                <p className="text-slate-700 font-medium">Batas Akhir:</p>
                <p className="text-2xl font-black text-black">{data.deadline}</p>
              </div>
            </div>

            <div className="bg-slate-50 px-4 mt-10 py-2 rounded-lg border border-slate-200">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">
                Dasar Surat:
              </p>
              <p className="text-[11px] font-semibold text-slate-700 leading-tight">
                {data.surat_dinas}
              </p>
            </div>

            {/* AREA BOTTOM BUTTONS */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Tombol SOP */}
              {liveData.sop?.sop_utama && (
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="w-full sm:w-auto flex items-center justify-center text-sm gap-3 bg-[#700D09] hover:bg-[#520906] text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-[#700D09]/10 transition-all active:scale-98"
                >
                  <FileText size={18} /> Pelayanan SOP
                </button>
              )}

              {/* Handler Dinamis Link Hasil Pengumuman */}
              {data.link_pengumuman && data.link_pengumuman.trim() !== "" ? (
                <a
                  href={data.link_pengumuman}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex items-center justify-center text-sm gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-slate-900/10 transition-all active:scale-98"
                >
                  Hasil Pengumuman Verifikasi
                  <ArrowUpRight size={16} className="text-slate-400" />
                </a>
              ) : (
                <div className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 rounded-2xl border border-slate-200 text-slate-500 font-medium text-xs tracking-wide">
                  <Info size={14} className="text-amber-600 animate-pulse" />
                  Hasil Pengumuman Belum Publish
                </div>
              )}
            </div>

          </motion.div>
        )}
      </div>

      {/* Modal Iframe Terbuka Menggunakan Link Online database */}
      <AnimatePresence>
        {showModal && liveData.sop?.sop_utama && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white w-full max-w-4xl h-[80vh] rounded-3xl overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute top-4 left-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black transition-colors"
              >
                <X size={24} />
              </button>
              <iframe
                src={liveData.sop.sop_utama.replace("/view", "/preview").replace("?usp=drive_link", "")}
                className="w-full h-full"
                title="SOP Document Online"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PeriodeSection;