import React from 'react';
import { ExternalLink, Star, Lock } from 'lucide-react';
import scheduleData from "../data/schedule.json";

const SurveyKepuasaForm = () => {
  const { survey } = scheduleData;

  return (
    <section id="survey-section" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto md:px-6">
        {/* Card Utama */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 md:p-12 shadow-sm flex flex-col md:flex-row items-center gap-10">
          
          {/* Ikon Statis - Berubah berdasarkan status */}
          <div className="flex-shrink-0">
            <div className={`w-24 h-24 rounded-2xl flex items-center justify-center ${survey.aktif ? 'bg-orange-50' : 'bg-slate-100'}`}>
              {survey.aktif ? (
                <Star size={40} className="text-orange-500 fill-orange-500" />
              ) : (
                <Lock size={40} className="text-slate-400" />
              )}
            </div>
          </div>

          {/* Teks & Button */}
          <div className="flex-grow text-center md:text-left">
            <div className={`inline-block px-3 py-1 mb-4 rounded-lg text-[10px] font-bold uppercase tracking-widest ${survey.aktif ? 'bg-orange-100 text-orange-700' : 'bg-slate-200 text-slate-600'}`}>
              {survey.aktif ? "Umpan Balik Layanan" : "Survei Belum Dibuka"}
            </div>
            
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">
              {survey.aktif ? "Suara Anda Membawa Perubahan" : "Survei Kepuasan Belum Tersedia"}
            </h3>

            <p className="text-slate-600 mb-8 leading-relaxed max-w-lg">
              {survey.aktif 
                ? `Bantu kami meningkatkan kualitas layanan KPU Kabupaten Sekadau. Masukan Anda melalui ${survey.nama} sangat berharga untuk perbaikan kami.`
                : "Saat ini periode survei kepuasan pelanggan belum dibuka. Silakan kembali lagi di lain waktu untuk memberikan masukan Anda."
              }
            </p>
            
            {survey.aktif ? (
              <a
                href={survey.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#700D09] text-white px-8 py-4 rounded-xl font-bold transition-colors hover:bg-[#5a0a07]"
              >
                <span>Mulai Isi Survei</span>
                <ExternalLink size={18} />
              </a>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SurveyKepuasaForm;