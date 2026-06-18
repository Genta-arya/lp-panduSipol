import React from "react";
import { motion } from "framer-motion";
import InfoSection from "./InfoSection";
import PeriodeSection from "./PeriodeSection";
import SurveyKepuasaForm from "./SurveyKepuasaForm";
import ASK from "./ASK";

const MainSection = () => {
  // Varians untuk Section Umum (Spring)
  const sectionVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 60, damping: 12, duration: 0.8 },
    },
  };

  // Varians khusus untuk Survey Form (Slide Up Elegan)
  const surveyVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "tween", // Menggunakan transisi halus, bukan spring
        ease: "easeOut",
        duration: 1.2,
      },
    },
  };

  return (
    <main className="overflow-hidden">
      {/* InfoSection */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        variants={sectionVariants}
      >
        <InfoSection />
      </motion.div>

      {/* PeriodeSection */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <PeriodeSection />
      </motion.div>
      <div>
        <ASK />
      </div>
      {/* SurveyKepuasaForm - Animasi Berbeda */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={surveyVariants} // Menggunakan varian khusus
      >
        <SurveyKepuasaForm />
      </motion.div>
    </main>
  );
};

export default MainSection;
