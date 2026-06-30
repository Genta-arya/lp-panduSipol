import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Config/firebase";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Status cek sesi aktif
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // ─── CHECK ACTIVE SESSION ───────────────────────────────────────
  useEffect(() => {
    // Listener ini mendeteksi jika token/sesi user tersimpan secara lokal
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Jika sudah login, langsung arahkan tanpa memunculkan form login
        navigate("/dashboard", { replace: true });
      } else {
        // Jika tidak ada sesi, matikan loading pengecekan agar form muncul
        setIsCheckingAuth(false);
      }
    });

    return () => unsubscribe(); // Membersihkan listener saat komponen unmount
  }, [navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (errorMsg) setErrorMsg(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
      console.log("Autentikasi Berhasil:", user);
      
      toast.success("Login Berhasil!");
      navigate("/dashboard", { replace: true });
      
    } catch (error) {
      console.error("Autentikasi Gagal:", error.code);
      switch (error.code) {
        case "auth/invalid-email":
          setErrorMsg("Format alamat email kantor tidak valid.");
          break;
        case "auth/user-disabled":
          setErrorMsg("Akun ini telah dinonaktifkan oleh administrator.");
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setErrorMsg("Email atau kata sandi yang Anda masukkan salah.");
          break;
        case "auth/too-many-requests":
          setErrorMsg("Terlalu banyak percobaan gagal. Silakan coba lagi nanti.");
          break;
        default:
          setErrorMsg("Terjadi kesalahan sistem. Silakan coba beberapa saat lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ─── PREMIUM LOADING SCREEN (Saat mengecek sesi) ────────────────
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white">
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="p-4 bg-white/[0.04] backdrop-blur-md rounded-3xl border border-white/[0.08] shadow-2xl animate-pulse">
            <img
              src="https://www.kpu.go.id/img/logo-kpu.png"
              className="w-16 h-auto"
              alt="Logo KPU"
            />
          </div>
          <div className="flex items-center gap-2 mt-2 text-slate-400 text-sm font-light tracking-wide">
            <Loader2 size={16} className="animate-spin text-red-500" />
            Memverifikasi Sesi Aman...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#fafafa] font-sans antialiased selection:bg-red-600 selection:text-white">
      {/* SISI KIRI: ELEGANT CORPORATE BANNER (Desktop Only) */}
      <div className="hidden lg:flex w-[45%] relative bg-[#0f172a] items-center justify-center p-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/20 rounded-full blur-[120px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-900/10 rounded-full blur-[100px] -ml-20 -mb-20" />
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />

        <div className="relative z-10 flex flex-col justify-between h-full w-full max-w-md text-white">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-white/[0.04] backdrop-blur-md rounded-2xl border border-white/[0.08] shadow-inner">
              <img src="https://www.kpu.go.id/img/logo-kpu.png" className="w-10 h-auto" alt="Logo KPU" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Informasi SIPOL</p>
              <p className="text-sm font-bold tracking-tight text-white/90">KPU Kabupaten Sekadau</p>
            </div>
          </div>

          <div className="my-auto py-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
              SIPOL Management Control
            </span>
            <h1 className="text-4xl font-light tracking-tight text-white leading-[1.2]">
              Sistem Informasi <br />
              <span className="font-semibold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Partai Politik (SIPOL)
              </span>
            </h1>
            <p className="mt-4 text-slate-400 text-sm leading-relaxed font-light">
              Dashboard pusat pembaruan informasi landing page KPU Kabupaten Sekadau. Kelola validasi, verifikasi, dan pemutakhiran data partai politik secara berkelanjutan dalam satu ekosistem digital yang terintegrasi.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-light tracking-wide">
            Komisi Pemilihan Umum &bull; Kabupaten Sekadau
          </div>
        </div>
      </div>

      {/* SISI KANAN: MINIMALIST FORM PANEL */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16 bg-white lg:bg-[#fafafa]">
        <div className="w-full max-w-[420px] space-y-8">
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <img src="https://www.kpu.go.id/img/logo-kpu.png" className="w-10 h-auto" alt="Logo KPU" />
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight uppercase">KPU Kabupaten Sekadau</h2>
              <p className="text-xs text-slate-500">Sistem Informasi Digital</p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Sign In</h2>
            <p className="text-slate-500 mt-2 text-sm font-light">Silakan masukkan kredensial terdaftar untuk melanjutkan akses.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-medium text-red-600">
                {errorMsg}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wide text-slate-700 block">Alamat Email Kantor</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="name@kpu.go.id"
                  className="w-full rounded-xl border border-slate-200 pl-11 pr-4 py-3 bg-white text-slate-900 placeholder-slate-400 text-sm font-normal outline-none transition-all duration-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-sm disabled:opacity-60"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold tracking-wide text-slate-700 block">Kata Sandi</label>
                <button type="button" className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors focus:outline-none">Lupa sandi?</button>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 pl-11 pr-11 py-3 bg-white text-slate-900 placeholder-slate-400 text-sm font-normal outline-none transition-all duration-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-sm disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm py-3 px-4 shadow-md shadow-slate-900/10 transition-all duration-200 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:bg-slate-700 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin text-slate-400" />
                  Memproses Autentikasi...
                </>
              ) : (
                <>
                  Autentikasi Aman
                  <ArrowRight size={16} className="text-slate-400" />
                </>
              )}
            </button>
          </form>

          <div className="pt-6 text-center text-xs font-light text-slate-400 tracking-wide">
            &copy; {new Date().getFullYear()} KPU Kabupaten Sekadau. All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;