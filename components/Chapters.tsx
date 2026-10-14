"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import Glyph from "./Glyph";
import { CHAPTERS, LABEL, MENU, type MenuItem } from "@/lib/menu";
import { clamp } from "@/lib/anim";

/**
 * Galeri horizontal: scroll vertikal menggeser panel Tea → Coffee → Milk ke samping.
 * rel = posisi panel relatif ke layar (0 = di tengah, ±1 = satu layar ke kanan/kiri),
 * dipakai untuk parallax kata latar, teks, dan kartu.
 */
const N = CHAPTERS.length;
const ROT = [-6, 5, 4, -5];

export default function Chapters() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const trackX = useTransform(p, (v) => `translate3d(${(-v * (N - 1) * 100) / N}%,0,0)`);

  return (
    <section className="hz" id="racikan" aria-label="Tiga racikan" ref={ref}>
      <div className="hz-sticky">
        <motion.div className="hz-track" style={{ transform: trackX, width: `${N * 100}%` }}>
          {CHAPTERS.map((c, k) => (
            <Panel key={c.cat} k={k} p={p} chapter={c} items={MENU[c.cat].slice(0, 4)} />
          ))}
        </motion.div>
        <div className="hz-nav" aria-hidden="true">
          {CHAPTERS.map((c, k) => (
            <NavBar key={c.cat} k={k} p={p} label={LABEL[c.cat]} />
          ))}
        </div>
      </div>
    </section>
  );
}

function NavBar({ k, p, label }: { k: number; p: MotionValue<number>; label: string }) {
  const scaleX = useTransform(p, (v) => clamp(v * N - k + 0.001));
  return (
    <span>
      <motion.i style={{ scaleX }} />
      {label}
    </span>
  );
}

function Panel({
  k, p, chapter, items,
}: {
  k: number;
  p: MotionValue<number>;
  chapter: (typeof CHAPTERS)[number];
  items: MenuItem[];
}) {
  const rel = useTransform(p, (v) => k - v * (N - 1));
  const wordX = useTransform(rel, (r) => `${r * 45}vw`);
  const textX = useTransform(rel, (r) => `${r * 12}vw`);
  const textOpacity = useTransform(rel, (r) => 1 - clamp(Math.abs(r) * 1.2 - 0.1));

  return (
    <article className="panel" data-cat={chapter.cat} style={{ width: `${100 / N}%` }}>
      <motion.div className="bigword" style={{ x: wordX }}>
        {LABEL[chapter.cat].toUpperCase()}
      </motion.div>
      <motion.div className="ptext" style={{ x: textX, opacity: textOpacity }}>
        <p className="eyebrow">{chapter.no} / {LABEL[chapter.cat]}</p>
        <h2>{chapter.title}</h2>
        <p>{chapter.desc}</p>
        <div className="facts">
          {chapter.facts.map(([key, val]) => (
            <span key={key}><b>{key}</b>{val}</span>
          ))}
        </div>
      </motion.div>
      <div className="bento">
        {items.map((it, i) => (
          <PTile key={it.name} i={i} rel={rel} item={it} />
        ))}
      </div>
    </article>
  );
}

function PTile({ i, rel, item }: { i: number; rel: MotionValue<number>; item: MenuItem }) {
  const depth = 1 + (i % 2) * 0.6 + Math.floor(i / 2) * 0.3;
  const transform = useTransform(rel, (r) =>
    `translate(${r * 18 * depth}vw, ${Math.abs(r) * 60 * (i % 2 ? 1 : -1)}px) rotate(${ROT[i] * (0.4 + Math.abs(r) * 2)}deg)`
  );
  return (
    <motion.div className="ptile" style={{ transform }}>
      {item.tag && <span className="sticker">{item.tag}</span>}
      <small>{item.temp.join(" / ")}</small>
      <Glyph name={item.glyph} />
      <b>{item.name}</b>
    </motion.div>
  );
}
