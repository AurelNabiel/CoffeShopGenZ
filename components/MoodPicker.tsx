"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Glyph from "./Glyph";
import CaffeineMeter from "./CaffeineMeter";
import { ALL, LABEL, type FlatItem, type Mood } from "@/lib/menu";

const MOODS: { id: Mood; label: string }[] = [
  { id: "melek", label: "Butuh melek" },
  { id: "segar", label: "Yang seger" },
  { id: "manis", label: "Manis-manis" },
  { id: "santai", label: "Santai sore" },
];

const DEFAULT = ALL.find((x) => x.name === "Kopi Susu Gula Aren")!;

function pickFor(mood: Mood, exclude: string): FlatItem {
  const pool = ALL.filter((it) => it.moods.includes(mood) && it.name !== exclude);
  return pool[Math.floor(Math.random() * pool.length)] ?? DEFAULT;
}

export default function MoodPicker() {
  const [mood, setMood] = useState<Mood>("melek");
  const [item, setItem] = useState<FlatItem>(DEFAULT);

  const choose = (m: Mood) => {
    setMood(m);
    setItem(pickFor(m, item.name));
  };

  return (
    <section className="block mood" id="mood">
      <div className="wrap">
        <div>
          <p className="eyebrow">Bingung pilih?</p>
          <h2>Lagi pengen yang kayak gimana?</h2>
          <p className="lead">Pilih mood kamu, nanti kami kasih satu rekomendasi. Belum cocok? Acak lagi.</p>
          <div className="moods" role="group" aria-label="Pilih mood">
            {MOODS.map((m) => (
              <button key={m.id} aria-pressed={mood === m.id} onClick={() => choose(m.id)}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={item.name}
              className="pick"
              initial={{ rotate: -6, scale: 0.9, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 6, scale: 0.9, opacity: 0, transition: { duration: 0.15 } }}
              transition={{ type: "spring", stiffness: 300, damping: 16 }}
            >
              <motion.div
                className="pick-art"
                initial={{ rotate: -180, scale: 0.4 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 12 }}
              >
                <Glyph name={item.glyph} />
              </motion.div>
              <p className="eyebrow">Rekomendasi · {LABEL[item.cat]}</p>
              <h3>{item.name}</h3>
              <p>{item.desc}</p>
              <div className="meta">
                <span className="temp">
                  {item.temp.map((t) => <span key={t}>{t}</span>)}
                  <span>{item.ml} ml</span>
                </span>
                <CaffeineMeter mg={item.caffeine} />
              </div>
              <button className="again" onClick={() => setItem(pickFor(mood, item.name))}>
                Acak lagi ↻
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
