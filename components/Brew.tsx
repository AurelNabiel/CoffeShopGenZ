"use client";

import { motion } from "motion/react";
import { EASE_OUT } from "@/lib/anim";

const STEPS = [
  { t: "Sangrai", d: "Biji disangrai di Bekasi tiap Senin, lalu diistirahatkan dulu sebelum dipakai.", s: "Medium · istirahat 5 hari" },
  { t: "Giling", d: "Digiling per pesanan, ukurannya beda untuk espresso, V60, dan cold brew.", s: "Espresso 18 g · V60 15 g" },
  { t: "Seduh", d: "Air ditimbang, suhu diukur, waktu dihitung. Rasanya sama tiap kali kamu datang.", s: "93°C · 1:15 · 2:45 menit" },
  { t: "Sajikan", d: "Sampai di meja kamu selagi aromanya paling wangi.", s: "< 60 detik ke meja" },
];

export default function Brew() {
  return (
    <section className="block brew" id="seduh">
      <div className="wrap">
        <p className="eyebrow">Dari biji ke gelas</p>
        <motion.h2
          initial={{ y: 40, opacity: 0.2 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          Empat langkah yang nggak kami buru-buru.
        </motion.h2>
        <motion.ol
          className="steps"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        >
          {STEPS.map((s) => (
            <motion.li
              key={s.t}
              variants={{
                hidden: { y: 60, rotate: 4 },
                show: { y: 0, rotate: 0, transition: { duration: 0.6, ease: EASE_OUT } },
              }}
            >
              <h3>{s.t}</h3>
              <p>{s.d}</p>
              <span className="spec">{s.s}</span>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
