import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Star,
  Lock,
  Share2,
  QrCode,
  Download,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
// Import koneksi db Firestore dari config Firebase Anda
import { db } from "../Config/firebase";
import { doc, getDoc } from "firebase/firestore";

const SurveyKepuasaForm = () => {
  const [surveys, setSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk kontrol visual share & modal preview QR Code
  const [copiedId, setCopiedId] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState(null);

  // 1. Fetch Data Survei secara Realtime dari Firestore
  useEffect(() => {
    const fetchSurveysData = async () => {
      try {
        const docRef = doc(db, "landing_page_data", "sipol_info");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().surveys) {
          setSurveys(docSnap.data().surveys);
        } else {
          console.error("Data survei tidak ditemukan di Firestore.");
        }
      } catch (error) {
        console.error("Gagal sinkronisasi data survei:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurveysData();
  }, []);

  const handleShare = async (item) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Survei: ${item.nama}`,
          text: `Yuk ikut isi Survei Kepuasan Pelayanan KPU Kabupaten Sekadau: ${item.nama}`,
          url: item.link,
        });
      } catch (error) {
        console.log("Error sharing:", error);
        toast.error("Gagal membagikan tautan");
      }
    } else {
      try {
        await navigator.clipboard.writeText(item.link);
        setCopiedId(item.id);
        toast.success("Tautan berhasil disalin!");
        setTimeout(() => setCopiedId(null), 2000);
      } catch (err) {
        toast.error("Gagal menyalin tautan");
      }
    }
  };

  const openQrModal = (item) => {
    setSelectedSurvey(item);
    setShowQrModal(true);
  };

  // Fungsi Unduh Gambar QR Code murni via blob internal browser
  const downloadQrCode = async () => {
    if (!selectedSurvey || !selectedSurvey.link_qr_code) return;

    try {
      const response = await fetch(selectedSurvey.link_qr_code);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `QR_Code_Survei_${selectedSurvey.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      toast.success("Gambar QR Code berhasil diunduh!");
    } catch (error) {
      window.open(selectedSurvey.link_qr_code, "_blank");
      toast.info("Membuka berkas gambar di tab baru untuk disimpan manual.");
    }
  };

  // Tampilan Placeholder Sinkronisasi Database
  if (isLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-7 h-7 animate-spin text-slate-400" />
        <span className="text-xs text-slate-400 mt-2 font-light tracking-wide">
          Menyinkronkan Kuesioner Pelayanan...
        </span>
      </div>
    );
  }

  if (surveys.length === 0) return null;

  return (
    <section id="survey-section" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight mb-4">
            Survei Kepuasan Pelayanan
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Bantu kami meningkatkan kualitas layanan KPU Kabupaten Sekadau.
            Masukan dan penilaian Anda sangat berharga untuk perbaikan
            berkelanjutan kami.
          </p>
        </div>

        {/* Grid Card Survei */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {surveys.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-10 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 transition-all hover:shadow-md"
            >
              {/* Ikon Status */}
              <div className="flex-shrink-0">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center ${item.aktif ? "bg-orange-50" : "bg-slate-100"}`}
                >
                  {item.aktif ? (
                    <Star
                      size={28}
                      className="text-orange-500 fill-orange-500"
                    />
                  ) : (
                    <Lock size={28} className="text-slate-400" />
                  )}
                </div>
              </div>

              {/* Konten Teks & Tombol */}
              <div className="flex-grow text-center sm:text-left flex flex-col h-full justify-between">
                <div>
                  <div
                    className={`inline-block px-3 py-1 mb-3 rounded-lg text-[10px] font-bold uppercase tracking-widest ${item.aktif ? "bg-orange-100 text-orange-700" : "bg-slate-200 text-slate-600"}`}
                  >
                    {item.aktif ? "Umpan Balik" : "Belum Dibuka"}
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                    {item.nama}
                  </h3>

                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    {item.aktif
                      ? "Silakan berikan penilaian Anda mengenai kualitas pelayanan kami selama periode triwulan ini."
                      : "Saat ini periode pengisian survei untuk triwulan ini belum dibuka atau telah berakhir."}
                  </p>
                </div>

                {/* Tombol Aksi */}
                <div>
                  {item.aktif ? (
                    <div className="flex flex-wrap gap-2 w-full justify-center sm:justify-start">
                      {/* Tombol Utama Isi Survei */}
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-[#700D09] text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors hover:bg-[#5a0a07] flex-grow sm:flex-grow-0"
                      >
                        <span>Isi Survei</span>
                        <ExternalLink size={16} />
                      </a>

                      {/* TOMBOL QR CODE (Muncul Jika Gambar Sudah Terupload di Admin) */}
                      {item.link_qr_code && item.link_qr_code.trim() !== "" && (
                        <button
                          type="button"
                          onClick={() => openQrModal(item)}
                          className="inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-800 px-4 py-3 rounded-xl text-sm font-bold transition-colors hover:bg-slate-200 border border-slate-200 w-full sm:w-auto"
                        >
                          <QrCode size={16} />
                          <span>QR Code</span>
                        </button>
                      )}

                      {/* Tombol Bagikan */}
                      <button
                        type="button"
                        onClick={() => handleShare(item)}
                        className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-colors border w-full sm:w-auto ${
                          copiedId === item.id
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <Share2
                          size={16}
                          className={copiedId === item.id ? "animate-bounce" : ""}
                        />
                        <span>
                          {copiedId === item.id ? "Tersalin!" : "Bagikan"}
                        </span>
                      </button>
                    </div>
                  ) : (
                    <button
                      disabled
                      className="inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-400 px-6 py-3 rounded-xl text-sm font-bold cursor-not-allowed w-full sm:w-auto"
                    >
                      <span>Terkunci</span>
                      <Lock size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL POPUP PREVIEW QR CODE MURNI IMAGE */}
      <AnimatePresence>
        {showQrModal && selectedSurvey && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] max-w-sm w-full p-6 shadow-2xl relative border border-slate-100"
            >
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center mt-2">
                <h4 className="font-black text-slate-900 text-lg uppercase tracking-tight mb-1">
                  QR Code Survei
                </h4>
                <p className="text-xs text-slate-500 mb-6 px-4">
                  {selectedSurvey.nama}
                </p>

                {/* Render Gambar QR Code External Link Server */}
                <div className="w-48 h-48 mx-auto bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 mb-6 p-2 shadow-sm flex items-center justify-center">
                  <img
                    src={selectedSurvey.link_qr_code}
                    className="max-w-full max-h-full object-contain"
                    alt={`QR Code ${selectedSurvey.nama}`}
                    loading="lazy"
                  />
                </div>

                {/* Tombol Unduh */}
                <button
                  type="button"
                  onClick={downloadQrCode}
                  className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all w-full shadow-md active:scale-98"
                >
                  <Download size={16} />
                  <span>Unduh Gambar QR</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SurveyKepuasaForm;