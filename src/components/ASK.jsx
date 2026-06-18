import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  X,
  Loader2,
  ChevronDown,
  Bot,
  CircleHelp,
  MessageSquare,
  FileText,
  Sparkles,
} from "lucide-react";
import { toast, Toaster } from "sonner";

const TypingIndicator = () => {
  return (
    <div className="flex gap-1 items-center">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-slate-500 rounded-full"
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};

const ASK = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("ai");
  const [openFaq, setOpenFaq] = useState(null);

  const chatEndRef = useRef(null);

  // Data Rekomendasi Pertanyaan Cepat (Suggestions)
  const questionSuggestions = [
    "Apa syarat pemutakhiran data kepesertaan parpol?",
    "Bagaimana alur verifikasi berkas di SIPOL?",
    "Jadwal batas akhir unggah dokumen perbaikan",
    "Solusi jika akun SIPOL tidak bisa login",
  ];

  // FAQ seputar pemutakhiran data partai politik (SIPOL)
  const faqData = [
    {
      question: "Apa tujuan pemutakhiran data berkelanjutan di SIPOL?",
      answer:
        "Tujuannya adalah untuk menjaga integritas, akuntabilitas, dan transparansi data kepesertaan Pemilu partai politik di seluruh tingkatan wilayah secara berkelanjutan.",
    },
    {
      question: "Apa dasar hukum pemutakhiran data parpol saat ini?",
      answer:
        "Proses pemutakhiran berpedoman pada PKPU terbaru, serta Keputusan KPU Nomor 1365 Tahun 2023 dan Keputusan KPU Nomor 658 Tahun 2024.",
    },
    {
      question:
        "Bagaimana alur verifikasi data jika terjadi perubahan dokumen?",
      answer:
        "Partai politik melakukan unggah dokumen perbaikan mandiri melalui akun SIPOL masing-masing sebelum diverifikasi oleh petugas KPU.",
    },
    {
      question: "Ke mana harus berkoordinasi jika ada kendala teknis SIPOL?",
      answer:
        "Anda dapat berkonsultasi langsung ke Helpdesk KPU Kabupaten Sekadau atau menghubungi kontak admin resmi (Genta/Agung) yang tertera di menu chat.",
    },
  ];

 useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  const handleAiChat = async (text) => {
    const msg = text || prompt;

    if (!msg.trim() || loading) return;

    const userMsg = { role: "user", text: msg };
    
    // Menyusun history terbaru untuk mempertahankan konteks percakapan (Menjawab masalah amnesia AI)
    const updatedHistory = [...chatHistory, userMsg];

    setChatHistory(updatedHistory);
    setPrompt("");
    setLoading(true);
// 
    try {
      const response = await fetch("https://server-lp-pandu-sipol.vercel.app/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: msg,
          history: updatedHistory // Mengirimkan history ke Vercel backend
        }),
      });

      const data = await response.json();

      const aiFullText =
        response.status === 409
          ? "Maaf, pertanyaan di luar cakupan layanan. Silakan hubungi Helpdesk melalui kontak resmi yang tersedia pada website KPU Kabupaten Sekadau."
          : data.reply;

      setChatHistory((prev) => [...prev, { role: "ai", text: "" }]);
      setLoading(false);

      let currentText = "";

      for (let i = 0; i < aiFullText.length; i++) {
        currentText += aiFullText[i];

        setChatHistory((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "ai",
            text: currentText,
          };
          return updated;
        });

        await new Promise((resolve) => setTimeout(resolve, 15));
      }
    } catch (error) {
      console.error(error);
      setLoading(false);

      toast.error("Gagal terhubung ke server!");

      setChatHistory((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Maaf, koneksi ke server terputus.",
        },
      ]);
    }
  };

  
  //   useffect jika modal dibuka dan otomatis scroll chat ke paling akhir
  useEffect(() => {
    if (isModalOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isModalOpen]);

  const clearChat = () => {
    setChatHistory([]);
    toast.success("Riwayat chat dibersihkan");
  };

  return (
    <>
      <Toaster richColors position="top-center" />

      {/* FLOATING CORNER CONTAINER */}
      <div className="fixed bottom-6 right-2 md:right-6 z-[60] flex flex-col items-end gap-4">
        {/* CHAT WINDOW */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white w-[380px] sm:w-[420px] h-[580px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
            >
              {/* HEADER */}
              <div className="p-4 border-b bg-[#700D09] text-white flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm">Asisten KPU Sekadau</h3>
                  <p className="text-[10px] text-slate-200">
                    Helpdesk Pemutakhiran Partai Politik
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={clearChat}
                    className="text-red-200 hover:text-white text-xs bg-red-950/30 px-2 py-1 rounded-md transition-colors"
                  >
                    Hapus
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1 hover:bg-black/10 rounded-full transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* TABS NAVIGATION */}
              <div className="p-2 border-b bg-slate-50">
                <div className="bg-slate-200/70 p-1 rounded-xl flex gap-1">
                  <button
                    onClick={() => setActiveTab("ai")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === "ai"
                        ? "bg-white text-[#700D09] shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Bot size={14} />
                    Asisten AI
                  </button>

                  <button
                    onClick={() => setActiveTab("faq")}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === "faq"
                        ? "bg-white text-[#700D09] shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <CircleHelp size={14} />
                    FAQ Mandiri
                  </button>
                </div>
              </div>

              {/* SCROLLABLE VIEW */}
              <div className="flex-1 overflow-y-auto bg-slate-50">
                {activeTab === "ai" ? (
                  <div className="p-4 space-y-4">
                    {/* Welcome Context (Hanya muncul jika belum ada chat) */}
                    {chatHistory.length === 0 && (
                      <>
                        <div className="bg-white p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-2 shadow-sm animate-fadeIn">
                          <p>
                            Proses pemutakhiran data berkelanjutan melalui{" "}
                            <strong>SIPOL</strong> bertujuan menjaga integritas
                            data kepesertaan Pemilu.
                          </p>
                          <div className="pt-2 border-t border-slate-100 space-y-1">
                            <span className="font-bold text-slate-700 flex items-center gap-1">
                              <FileText size={12} className="text-[#700D09]" />{" "}
                              Regulasi Dasar:
                            </span>
                            <span className="block text-slate-500">
                              • Keputusan KPU No. 1365 / 2023
                            </span>
                            <span className="block text-slate-500">
                              • Keputusan KPU No. 658 / 2024
                            </span>
                          </div>
                        </div>

                        {/* SUGGESTED QUESTIONS REGION */}
                        {/* <div className="space-y-2 pt-1 animate-fadeIn">
                          <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1 px-1">
                            <Sparkles size={12} className="text-[#700D09]" />{" "}
                            Rekomendasi Pertanyaan:
                          </p>
                          <div className="flex flex-col gap-2">
                            {questionSuggestions.map((suggestion, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleAiChat(suggestion)}
                                className="w-full text-left bg-white hover:bg-slate-100/80 border border-slate-200 hover:border-[#700D09] text-xs text-slate-700 p-2.5 rounded-xl transition-all duration-150 shadow-sm font-medium"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div> */}
                      </>
                    )}

                    {chatHistory.map((msg, index) => (
                      <div
                        key={index}
                        className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed shadow-sm ${
                          msg.role === "user"
                            ? "bg-[#700D09] text-white ml-auto rounded-tr-none"
                            : "bg-white border text-slate-800 rounded-tl-none"
                        }`}
                      >
                        {msg.text}

                        {msg.role === "ai" && msg.text !== "" && (
                          <div className="mt-2.5 pt-1.5 border-t text-[9px] text-slate-400 flex gap-1">
                            <span>Informasi Kontak:</span>
                            <a
                              href="https://wa.me/6289618601348"
                              target="_blank"
                              rel="noreferrer"
                              className="underline hover:text-[#700D09]"
                            >
                              Genta
                            </a>
                            <span>/</span>
                            <a
                              href="https://wa.me/6282261247070"
                              target="_blank"
                              rel="noreferrer"
                              className="underline hover:text-[#700D09]"
                            >
                              Agung
                            </a>
                          </div>
                        )}
                      </div>
                    ))}

                    {loading && (
                      <div className="bg-white border p-3 rounded-2xl w-fit rounded-tl-none shadow-sm">
                        <TypingIndicator />
                      </div>
                    )}

                    <div ref={chatEndRef} />
                  </div>
                ) : (
                  <div className="p-4 space-y-2.5">
                    {faqData.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition-all"
                      >
                        <button
                          onClick={() =>
                            setOpenFaq(openFaq === index ? null : index)
                          }
                          className="w-full p-3 flex items-center justify-between text-left text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          <span>{item.question}</span>
                          <ChevronDown
                            size={14}
                            className={`text-slate-400 transition-transform duration-200 flex-shrink-0 ml-2 ${openFaq === index ? "rotate-180 text-[#700D09]" : ""}`}
                          />
                        </button>

                        {openFaq === index && (
                          <div className="p-3 border-t bg-slate-50/50 text-xs text-slate-600 leading-relaxed">
                            {item.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* INPUT FORM (Hanya Aktif di Tab AI) */}
              {activeTab === "ai" && (
                <div className="p-3 border-t bg-white">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAiChat(prompt);
                    }}
                    className="flex gap-2"
                  >
                    <input
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      disabled={loading}
                      className="flex-1 px-3 py-2 border rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#700D09] placeholder-slate-400"
                      placeholder="Tulis pertanyaan seputar SIPOL..."
                    />

                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#700D09] hover:bg-black text-white px-3.5 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                      {loading ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Send size={14} />
                      )}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* FLOATING TOGGLE BUTTON */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsModalOpen(!isModalOpen)}
          className="bg-[#700D09] text-white p-4 rounded-full shadow-2xl hover:bg-black transition-all flex items-center justify-center"
        >
          {isModalOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </motion.button>
      </div>
    </>
  );
};

export default ASK;
