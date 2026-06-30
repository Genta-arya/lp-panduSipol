import React, { useState, useEffect } from "react";
import { db, auth } from "../../Config/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  CheckSquare,
  BarChart3,
  Menu,
  X,
  LogOut,
  Save,
  Loader2,
  Plus,
  Trash2,
  Image as ImageIcon,
  Upload
} from "lucide-react";
import { UploadImage } from "../../Services/Upload.services";

// Struktur JSON dengan field tambahan: link_pengumuman
const INITIAL_SIPOL_DATA = {
  jadwal: {
    semester1: {
      title: "Semester I",
      range: "Januari s.d. Juni 2026",
      deadline: "25 Juni 2026",
      status: "Berlangsung",
      live: true,
      description: "Paling lambat 3 (tiga) hari kerja sebelum akhir Juni 2026.",
      surat_dinas: "Surat Dinas KPU RI Nomor 464/PL.01.1-SD/06/2026",
      link_surat_dinas:
        "https://drive.google.com/file/d/1moNb7v8K1B44HY2lvhemmea4qm93XTWA/view",
      link_pengumuman: "", // Field Baru
    },
    semester2: {
      title: "Semester II",
      range: "Juli s.d. Desember 2026",
      deadline: "-",
      live: false,
      status: "Akan Datang",
      description:
        "Paling lambat 3 (tiga) hari kerja sebelum akhir Desember 2026.",
      surat_dinas: "Menunggu Surat Dinas KPU RI selanjutnya",
      link_surat_dinas: "#",
      link_pengumuman: "", // Field Baru
    },
  },
  dasar_hukum: [
    {
      nama: "Keputusan KPU Nomor 1365 Tahun 2023",
      url: "https://jdih.kpu.go.id/keputusan-kpu/detail/NnaJynNIAzwsYMeFmN2zUEZGc3ZiaXZKR1hFaE5NZkhTSXRxMVE9PQ",
    },
    {
      nama: "Keputusan KPU Nomor 658 Tahun 2024",
      url: "https://jdih.kpu.go.id/data/data_kepkpu/2024kpt658.pdf",
    },
  ],
  cakupan_data: [
    "Kepengurusan Partai Politik",
    "Keterwakilan Perempuan",
    "Keanggotaan Partai Politik",
    "Domisili Kantor Tetap",
  ],
  sop: {
    sop_utama:
      "https://drive.google.com/file/d/1moNb7v8K1B44HY2lvhemmea4qm93XTWA/view?usp=drive_link",
  },
  surveys: [
    {
      id: "q1",
      nama: "Survei Kepuasan Pelayanan - Triwulan I",
      aktif: true,
      link: "https://bit.ly/SKM-Pemutakhiran_data_partai_politik-2026",
      link_qr_code: "", // Berubah dari id_qr_drive ke link_qr_code murni
    },
    {
      id: "q2",
      nama: "Survei Kepuasan Pelayanan - Triwulan II",
      aktif: false,
      link: "https://bit.ly/link-triwulan-2",
      link_qr_code: "", // Berubah dari id_qr_drive ke link_qr_code murni
    },
  ],
};

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("jadwal");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  // 1. Proteksi Halaman & Cek Sesi Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login", { replace: true });
      } else {
        fetchDashboardData();
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // 2. Ambil Data dari Firestore & Jalankan Auto-Seed jika Kosong
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const docRef = doc(db, "landing_page_data", "sipol_info");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setDashboardData(docSnap.data());
      } else {
        console.log("Firestore kosong, menjalankan inisialisasi data JSON...");
        await setDoc(docRef, INITIAL_SIPOL_DATA);
        setDashboardData(INITIAL_SIPOL_DATA);
        toast.success("Inisialisasi database online berhasil di-import!");
      }
    } catch (error) {
      console.error("Error database sync:", error);
      toast.error("Gagal melakukan sinkronisasi database online.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingIndex(index);
      toast.info("Mengompresi & mengunggah gambar QR...");

      const resData = await UploadImage(file);

      if (resData && resData.file_url) {
        const updatedSurveys = [...dashboardData.surveys];
        updatedSurveys[index].link_qr_code = resData.file_url;
        setDashboardData({ ...dashboardData, surveys: updatedSurveys });
        toast.success(
          `Gambar QR ${updatedSurveys[index].id} berhasil diunggah!`,
        );
      } else {
        toast.error("Gagal mendapatkan file URL dari response server bucket.");
      }
    } catch (error) {
      toast.error("Sistem pengunggahan internal bucket error.");
    } finally {
      setUploadingIndex(null);
    }
  };

  // 3. Simpan Perubahan Form ke Firebase
  const handleSaveData = async () => {
    try {
      setIsSaving(true);
      const docRef = doc(db, "landing_page_data", "sipol_info");
      await updateDoc(docRef, dashboardData);
      toast.success("Perubahan berhasil di-publish ke landing page!");
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Gagal menyimpan perubahan.");
    } finally {
      setIsSaving(false);
    }
  };

  // 4. Handle Keluar Sistem
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Berhasil keluar dari sistem.");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error("Gagal melakukan logout.");
    }
  };

  const updateNestedState = (path, value) => {
    setDashboardData((prev) => {
      const keys = path.split(".");
      const updated = { ...prev };
      let current = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-red-500" />
          <span className="font-light tracking-wide text-sm text-slate-400">
            Sinkronisasi Realtime Database...
          </span>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: "jadwal", name: "Jadwal Semester", icon: Calendar },
    { id: "hukum", name: "Dasar Hukum", icon: FileText },
    { id: "cakupan", name: "Cakupan Data", icon: CheckSquare },
    { id: "survei", name: "Survei & SOP", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans antialiased flex">
      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0f172a] text-slate-300 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col justify-between border-r border-slate-800`}
      >
        <div>
          <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <img
                src="https://www.kpu.go.id/img/logo-kpu.png"
                className="w-8 h-auto"
                alt="KPU"
              />
              <div>
                <h1 className="text-sm font-bold text-white tracking-tight">
                  SIPOL CONSOLE
                </h1>
                <p className="text-[10px] text-slate-500">
                  KPU Kabupaten Sekadau
                </p>
              </div>
            </div>
            <button
              className="lg:hidden p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? "bg-red-600 text-white shadow-lg shadow-red-600/10" : "hover:bg-slate-800/60 hover:text-slate-200"}`}
                >
                  <Icon
                    size={18}
                    className={
                      activeTab === item.id ? "text-white" : "text-slate-400"
                    }
                  />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-950/20 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            Keluar Dashboard
          </button>
        </div>
      </aside>

      {/* DASHBOARD CONTAINER CONTENT */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-10 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-white/80">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <LayoutDashboard size={18} className="text-slate-400" />
              Control Panel Landing Page
            </h2>
          </div>

          <button
            onClick={handleSaveData}
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-70"
          >
            {isSaving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {isSaving ? "Publishing..." : "Publish Perubahan"}
          </button>
        </header>

        <main className="p-6 md:p-10 flex-1 max-w-5xl w-full mx-auto space-y-6">
          {/* TAB: JADWAL SEMESTER */}
          {activeTab === "jadwal" && dashboardData?.jadwal && (
            <div className="space-y-6">
              {["semester1", "semester2"].map((semKey) => {
                const sem = dashboardData.jadwal[semKey];
                return (
                  <div
                    key={semKey}
                    className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4"
                  >
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <h3 className="font-bold text-slate-800">
                        {sem.title} ({sem.range})
                      </h3>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sem.live}
                          onChange={(e) =>
                            updateNestedState(
                              `jadwal.${semKey}.live`,
                              e.target.checked,
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                        <span className="ml-2 text-xs font-medium text-slate-500">
                          Status Live
                        </span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-500 block mb-1">
                          Status Teks
                        </label>
                        <input
                          type="text"
                          value={sem.status}
                          onChange={(e) =>
                            updateNestedState(
                              `jadwal.${semKey}.status`,
                              e.target.value,
                            )
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-slate-900 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 block mb-1">
                          Batas Waktu (Deadline)
                        </label>
                        <input
                          type="text"
                          value={sem.deadline}
                          onChange={(e) =>
                            updateNestedState(
                              `jadwal.${semKey}.deadline`,
                              e.target.value,
                            )
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-slate-900 outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-semibold text-slate-500 block mb-1">
                          Keterangan / Deskripsi
                        </label>
                        <textarea
                          value={sem.description}
                          rows={2}
                          onChange={(e) =>
                            updateNestedState(
                              `jadwal.${semKey}.description`,
                              e.target.value,
                            )
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-slate-900 outline-none resize-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 block mb-1">
                          Nama Surat Dinas
                        </label>
                        <input
                          type="text"
                          value={sem.surat_dinas}
                          onChange={(e) =>
                            updateNestedState(
                              `jadwal.${semKey}.surat_dinas`,
                              e.target.value,
                            )
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-slate-900 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 block mb-1">
                          Link URL Dokumen Surat
                        </label>
                        <input
                          type="text"
                          value={sem.link_surat_dinas}
                          onChange={(e) =>
                            updateNestedState(
                              `jadwal.${semKey}.link_surat_dinas`,
                              e.target.value,
                            )
                          }
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:border-slate-900 outline-none text-blue-600 font-mono text-xs"
                        />
                      </div>

                      {/* INPUT FIELD BARU: LINK PENGUMUMAN HASIL */}
                      <div className="md:col-span-2 pt-2 border-t border-dashed border-slate-200">
                        <label className="text-xs font-bold text-red-700 block mb-1">
                          Link URL Pengumuman Hasil Verifikasi Pemutakhiran Data
                        </label>
                        <input
                          type="text"
                          value={sem.link_pengumuman || ""}
                          onChange={(e) =>
                            updateNestedState(
                              `jadwal.${semKey}.link_pengumuman`,
                              e.target.value,
                            )
                          }
                          placeholder="https://drive.google.com/... (Kosongkan jika belum ada)"
                          className="w-full bg-red-50/30 border border-red-200 focus:border-red-600 rounded-xl px-3 py-2.5 text-sm outline-none text-slate-800 placeholder-slate-400 font-medium"
                        />
                        <p className="text-[11px] text-slate-400 mt-1 font-light">
                          Tautan ini akan langsung muncul sebagai tombol unduh
                          hasil verifikasi di landing page periode terkait.
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB: DASAR HUKUM */}
          {activeTab === "hukum" && dashboardData?.dasar_hukum && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800">
                  Daftar Dokumen Regulasi / Dasar Hukum
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const updated = [
                      ...dashboardData.dasar_hukum,
                      { nama: "Regulasi Baru", url: "#" },
                    ];
                    setDashboardData({
                      ...dashboardData,
                      dasar_hukum: updated,
                    });
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:underline"
                >
                  <Plus size={14} /> Tambah Regulasi
                </button>
              </div>
              <div className="space-y-3">
                {dashboardData.dasar_hukum.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-3 items-end bg-slate-50 p-4 rounded-xl border border-slate-200/60"
                  >
                    <div className="flex-1 space-y-3 md:space-y-0 md:flex md:gap-4">
                      <div className="flex-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                          Nama Regulasi
                        </label>
                        <input
                          type="text"
                          value={item.nama}
                          onChange={(e) => {
                            const updated = [...dashboardData.dasar_hukum];
                            updated[index].nama = e.target.value;
                            setDashboardData({
                              ...dashboardData,
                              dasar_hukum: updated,
                            });
                          }}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-slate-900"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                          Link JDIH KPU / URL PDF
                        </label>
                        <input
                          type="text"
                          value={item.url}
                          onChange={(e) => {
                            const updated = [...dashboardData.dasar_hukum];
                            updated[index].url = e.target.value;
                            setDashboardData({
                              ...dashboardData,
                              dasar_hukum: updated,
                            });
                          }}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono outline-none focus:border-slate-900 text-blue-600"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = dashboardData.dasar_hukum.filter(
                          (_, i) => i !== index,
                        );
                        setDashboardData({
                          ...dashboardData,
                          dasar_hukum: updated,
                        });
                      }}
                      className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors bg-white border border-slate-200 shadow-sm"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CAKUPAN DATA */}
          {activeTab === "cakupan" && dashboardData?.cakupan_data && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800">
                  Aspek Cakupan Verifikasi / Pemutakhiran
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const updated = [
                      ...dashboardData.cakupan_data,
                      "Poin Aspek Baru",
                    ];
                    setDashboardData({
                      ...dashboardData,
                      cakupan_data: updated,
                    });
                  }}
                  className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:underline"
                >
                  <Plus size={14} /> Tambah Kategori
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dashboardData.cakupan_data.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-2 items-center bg-slate-50 pl-4 pr-2 py-2 rounded-xl border border-slate-200/60"
                  >
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const updated = [...dashboardData.cakupan_data];
                        updated[index] = e.target.value;
                        setDashboardData({
                          ...dashboardData,
                          cakupan_data: updated,
                        });
                      }}
                      className="w-full bg-transparent font-medium text-slate-700 text-sm border-none outline-none focus:bg-white focus:px-2 focus:py-1 focus:rounded-lg focus:border focus:border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = dashboardData.cakupan_data.filter(
                          (_, i) => i !== index,
                        );
                        setDashboardData({
                          ...dashboardData,
                          cakupan_data: updated,
                        });
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SURVEI & SOP */}
          {activeTab === "survei" && dashboardData && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border p-6 space-y-4">
                <h3 className="font-bold text-slate-800">SOP Pelayanan</h3>
                <input
                  type="text"
                  value={dashboardData.sop.sop_utama}
                  onChange={(e) =>
                    updateNestedState("sop.sop_utama", e.target.value)
                  }
                  className="w-full bg-slate-50 border p-2 text-xs text-blue-600 font-mono rounded-xl"
                />
              </div>

              <div className="bg-white rounded-2xl border p-6 space-y-4">
                <h3 className="font-bold text-slate-800 border-b pb-2">
                  Survei Kepuasan & QR Code Link
                </h3>
                <div className="space-y-4">
                  {dashboardData.surveys.map((survey, index) => (
                    <div
                      key={survey.id}
                      className="p-4 bg-slate-50 rounded-xl border space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold px-2 py-0.5 bg-slate-200 rounded text-slate-700">
                          {survey.id}
                        </span>
                        <input
                          type="checkbox"
                          checked={survey.aktif}
                          onChange={(e) => {
                            const updated = [...dashboardData.surveys];
                            updated[index].aktif = e.target.checked;
                            setDashboardData({
                              ...dashboardData,
                              surveys: updated,
                            });
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={survey.nama}
                          onChange={(e) => {
                            const updated = [...dashboardData.surveys];
                            updated[index].nama = e.target.value;
                            setDashboardData({
                              ...dashboardData,
                              surveys: updated,
                            });
                          }}
                          className="w-full bg-white border p-2 text-sm rounded-lg"
                          placeholder="Nama Survei"
                        />
                        <input
                          type="text"
                          value={survey.link}
                          onChange={(e) => {
                            const updated = [...dashboardData.surveys];
                            updated[index].link = e.target.value;
                            setDashboardData({
                              ...dashboardData,
                              surveys: updated,
                            });
                          }}
                          className="w-full bg-white border p-2 text-xs text-blue-600 rounded-lg"
                          placeholder="Tautan Kuesioner"
                        />

                        {/* INPUT FILE COMPONENT UNTUK UPLOAD IMAGE QR CODE */}
                        <div className="md:col-span-2 flex flex-col sm:flex-row items-center gap-4 p-3 bg-white border border-slate-200 rounded-xl">
                          <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200 flex-shrink-0">
                            {survey.link_qr_code ? (
                              <img
                                src={survey.link_qr_code}
                                className="w-full h-full object-cover"
                                alt="Preview QR"
                              />
                            ) : (
                              <ImageIcon size={24} className="text-slate-300" />
                            )}
                          </div>
                          <div className="flex-1 w-full text-center sm:text-left">
                            <p className="text-xs font-semibold text-slate-700 mb-1">
                              File QR Code Image (.png/.jpg)
                            </p>
                            <input
                              type="text"
                              value={survey.link_qr_code || ""}
                              readOnly
                              placeholder="Belum ada berkas terunggah"
                              className="w-full bg-slate-50 border p-1.5 text-[10px] rounded-lg text-slate-500 mb-2 font-mono"
                            />
                            <label
                              className={`inline-flex items-center gap-2 text-xs font-bold bg-slate-900 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-800 ${uploadingIndex === index ? "opacity-50 pointer-events-none" : ""}`}
                            >
                              {uploadingIndex === index ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <Upload size={12} />
                              )}
                              {uploadingIndex === index
                                ? "Mengunggah..."
                                : "Pilih File & Upload"}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, index)}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
