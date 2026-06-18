import React from 'react';

const Header = () => {
  return (
    <header className="relative  overflow-hidden">
      {/* Gambar Background */}
      <img 
        src="https://eppid.kpu-sekadau.my.id/assets/slider-DClTSnZf.png" 
        alt="Header KPU Sekadau" 
        className="w-full h-full object-cover"
      />
      
      {/* Overlay Tipis (Memberikan kesan senada dengan warna brand) */}
      <div className="absolute inset-0 bg-black/50" />
    </header>
  );
};

export default Header;