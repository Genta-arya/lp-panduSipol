import React, { useState } from "react";
import {
  Menu,
  X,
  BookOpen,
  Calendar,
  Home,
  MessageSquareHeart,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Fungsi Scroll Stabil
  const handleScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);

    if (element) {
      // 1. Eksekusi Scroll
      element.scrollIntoView({ behavior: "smooth", block: "start" });

      // 2. Tutup sidebar setelah jeda singkat agar transisi scroll terlihat
      setTimeout(() => {
        setIsOpen(false);
      }, 500);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#700D09] border-b-4 border-orange-500 shadow-xl">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center gap-3"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <img
              src="https://www.kpu.go.id/img/logo-kpu.png"
              alt="Logo KPU"
              className="h-14 w-14    object-contain"
            />
            <div className="flex flex-col text-white">
              <span className="text-lg font-bold leading-tight">
                PanduSIPOL
              </span>
              <span className="text-[11px] uppercase tracking-widest font-semibold opacity-80">
                KPU Kabupaten Sekadau
              </span>
            </div>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <NavButton
              label="Beranda"
              icon={<Home size={16} />}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            />
            <NavButton
              label="Panduan"
              icon={<BookOpen size={16} />}
              onClick={(e) => handleScroll(e, "panduan-qr")}
            />
            <NavButton
              label="Jadwal"
              icon={<Calendar size={16} />}
              onClick={(e) => handleScroll(e, "jadwal-pemutakhiran")}
            />
            <NavButton
              label="Survei"
              icon={<MessageSquareHeart size={16} />}
              onClick={(e) => handleScroll(e, "survey-section")}
            />
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Melayang */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden absolute w-full top-20  bg-[#700D09] rounded-b-3xl shadow-2xl overflow-hidden border border-white/10 z-50"
          >
            <div className="p-4 space-y-1 text-white">
              <MobileLink
                label="Beranda"
                icon={<Home size={18} />}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setIsOpen(false);
                }}
              />
              <MobileLink
                label="Panduan"
                icon={<BookOpen size={18} />}
                onClick={(e) => handleScroll(e, "panduan-qr")}
              />
              <MobileLink
                label="Jadwal"
                icon={<Calendar size={18} />}
                onClick={(e) => handleScroll(e, "jadwal-pemutakhiran")}
              />
              <MobileLink
                label="Survei"
                icon={<MessageSquareHeart size={18} />}
                onClick={(e) => handleScroll(e, "survey-section")}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const NavButton = ({ label, icon, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/90 hover:bg-[#8a120c] transition-all font-medium text-sm"
  >
    {icon} {label}
  </button>
);

const MobileLink = ({ label, icon, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#8a120c] font-medium"
  >
    {icon} {label}
  </button>
);

export default Navbar;
