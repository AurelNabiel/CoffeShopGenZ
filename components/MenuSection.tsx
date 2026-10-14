"use client";

import { useState, type PointerEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import Glyph from "./Glyph";
import CaffeineMeter from "./CaffeineMeter";
import { CATEGORIES, LABEL, MENU, type Category } from "@/lib/menu";
import { EASE_OUT } from "@/lib/anim";

const list = { show: { transition: { staggerChildren: 0.05 } } };
const card = {
  hidden: { y: 50, opacity: 0, rotate: -3 },
  show: { y: 0, opacity: 1, rotate: 0, transition: { duration: 0.55, ease: EASE_OUT } },
};

function tilt(e: PointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const rx = ((e.clientY - r.top) / r.height - 0.5) * -10;
  const ry = ((e.clientX - r.left) / r.width - 0.5) * 10;
  el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  el.style.boxShadow = "8px 8px 0 var(--ink)";
}
function untilt(e: PointerEvent<HTMLElement>) {
  e.currentTarget.style.transform = "";
  e.currentTarget.style.boxShadow = "";
}

export default function MenuSection() {
  const [cat, setCat] = useState<Category>("coffee");

  return (
    <section className="block" id="menu">
      <div className="wrap">
        <div className="head">
          <div>
            <p className="eyebrow">Menu kami</p>
            <h2>Pilih lemarimu.</h2>
          </div>
          <div className="tabs" role="tablist" aria-label="Kategori menu">
            {CATEGORIES.map((c) => (
              <button key={c} className="tab" role="tab" aria-selected={cat === c} onClick={() => setCat(c)}>
                {cat === c && (
                  <motion.span layoutId="tab-pill" className="tab-pill" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                )}
                <span className="tab-label">{LABEL[c]}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={cat}
            className="cards"
            role="tabpanel"
            variants={list}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: 20, transition: { duration: 0.15 } }}
          >
            {MENU[cat].map((it) => (
              <motion.article key={it.name} className="card" variants={card} onPointerMove={tilt} onPointerLeave={untilt}>
                <div className="card-art">
                  {it.tag && <span className="sticker">{it.tag}</span>}
                  <Glyph name={it.glyph} />
                </div>
                <div className="card-body">
                  <h3>{it.name}</h3>
                  <p>{it.desc}</p>
                  <div className="meta">
                    <span className="temp">
                      {it.temp.map((t) => <span key={t}>{t}</span>)}
                      <span>{it.ml} ml</span>
                    </span>
                    <CaffeineMeter mg={it.caffeine} />
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
