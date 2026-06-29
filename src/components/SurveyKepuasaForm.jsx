import React from 'react';
import { ExternalLink, Star, Lock } from 'lucide-react';
import scheduleData from "../data/schedule.json";

const SurveyKepuasaForm = () => {
  // Mengambil array "surveys" yang baru dari JSON
  const { surveys } = scheduleData;

  return (
    <section id="survey-section" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight mb-4">
            Survei Kepuasan Pelayanan
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Bantu kami meningkatkan kualitas layanan KPU Kabupaten Sekadau. Masukan dan penilaian Anda sangat berharga untuk perbaikan berkelanjutan kami.
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
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${item.aktif ? 'bg-orange-50' : 'bg-slate-100'}`}>
                  {item.aktif ? (
                    <Star size={28} className="text-orange-500 fill-orange-500" />
                  ) : (
                    <Lock size={28} className="text-slate-400" />
                  )}
                </div>
              </div>

              {/* Konten Teks & Tombol */}
              <div className="flex-grow text-center sm:text-left flex flex-col h-full justify-between">
                <div>
                  <div className={`inline-block px-3 py-1 mb-3 rounded-lg text-[10px] font-bold uppercase tracking-widest ${item.aktif ? 'bg-orange-100 text-orange-700' : 'bg-slate-200 text-slate-600'}`}>
                    {item.aktif ? "Umpan Balik" : "Belum Dibuka"}
                  </div>
                  
                  <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                    {item.nama}
                  </h3>

                  <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                    {item.aktif 
                      ? "Silakan berikan penilaian Anda mengenai kualitas pelayanan kami selama periode triwulan ini."
                      : "Saat ini periode pengisian survei untuk triwulan ini belum dibuka atau telah berakhir."
                    }
                  </p>
                </div>
                
                {/* Tombol Aksi */}
                <div>
                  {item.aktif ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#700D09] text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors hover:bg-[#5a0a07] w-full sm:w-auto"
                    >
                      <span>Isi Survei</span>
                      <ExternalLink size={16} />
                    </a>
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
    </section>
  );
};

export default SurveyKepuasaForm;