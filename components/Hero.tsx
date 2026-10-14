"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Glyph from "./Glyph";
import { EASE_OUT } from "@/lib/anim";

const LINES = [
  <>Ngopi,</>,
  <>ngeteh,</>,
  <>atau <mark>susu</mark> aja?</>,
];

const FLOATS = [
  { cls: "f1", text: "Wi-Fi kencang", r: -8 },
  { cls: "f2", text: "Colokan tiap meja", r: 6 },
  { cls: "f3", text: "Ramah nugas", r: -4 },
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const cupY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const cupR = useTransform(scrollYProgress, [0, 1], [0, 20]);

  const rise = (i: number) => ({
    initial: { y: 24, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { delay: 0.3 + i * 0.08, duration: 0.6, ease: EASE_OUT },
  });

  return (
    <header className="hero" id="top" ref={ref}>
      <div className="wrap">
        <div>
          <motion.span className="chip" {...rise(0)}>
            <i />Buka 09–21 · Jalan Kecapi, Bekasi
          </motion.span>
          <h1>
            {LINES.map((l, i) => (
              <span className="ln" key={i}>
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ delay: i * 0.1, duration: 0.9, ease: EASE_OUT }}
                >
                  {l}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p className="lead" {...rise(1)}>
            Kedai kecil buat nongkrong, nugas, atau ambil minum segar sebelum ngantor. Tiga Menu: Coffee, Milk dan Tea.
          </motion.p>
          <motion.div className="ctas" {...rise(2)}>
            <a className="btn solid" href="#menu">Jelajahi menu</a>
            <a className="btn" href="#zoom">Masuk ke kedai ↓</a>
          </motion.div>
        </div>

        <motion.div
          className="hero-art"
          aria-hidden="true"
          initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
        >
          <div className="blob" />
          <div className="blob2" />
          <motion.div className="hero-cup" style={{ y: cupY, rotate: cupR }}>
            <Glyph name="hot" />
          </motion.div>
          <svg className="ring" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="58" />
            <defs>
              <path id="ringp" d="M60,60 m-42,0 a42,42 0 1,1 84,0 a42,42 0 1,1 -84,0" />
            </defs>
            <text>
              <textPath href="#ringp">SEDUH SEGAR · TIAP HARI · </textPath>
            </text>
            <circle className="dot" cx="60" cy="60" r="9" />
          </svg>
          {FLOATS.map((f, i) => (
            <motion.span
              key={f.cls}
              className={`chip float ${f.cls}`}
              initial={{ rotate: f.r }}
              animate={{ y: [0, -10, 0], rotate: [f.r, f.r + 3, f.r] }}
              transition={{ duration: 3 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
            >
              <i />{f.text}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </header>
  );
}
