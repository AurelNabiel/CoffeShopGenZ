"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import Glyph from "./Glyph";
import { ALL, LABEL, ZOOM_TILES, type ZoomTile } from "@/lib/menu";
import { clamp, easeInOut, lerp } from "@/lib/anim";

/**
 * Scroll grid 2 fase (section di-pin 340vh):
 *  A (0 → 0.40)  grid miring 3D + kartu di kedalaman acak → rata
 *  B (0.42 → 0.84) grid diperbesar ke kotak tengah "KJ" sampai menutupi layar, kartu lain terlempar keluar
 *  lalu teks sambutan muncul di atas layar oranye.
 */
const phaseA = (v: number) => easeInOut(clamp(v / 0.4));
const phaseB = (v: number) => easeInOut(clamp((v - 0.42) / 0.42));

type Metrics = MutableRefObject<{ tw: number; S: number }>;

export default function ZoomGrid() {
  const ref = useRef<HTMLElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const metrics: Metrics = useRef({ tw: 100, S: 10 });
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useEffect(() => {
    const measure = () => {
      const tw = centerRef.current?.offsetWidth || 100;
      metrics.current = { tw, S: (Math.max(window.innerWidth, window.innerHeight) / tw) * 1.15 };
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const gridTransform = useTransform(p, (v) => {
    const a = phaseA(v), b = phaseB(v);
    return `rotateX(${lerp(48, 0, a)}deg) rotateZ(${lerp(-22, 0, a)}deg) scale(${lerp(0.78, 1, a) * lerp(1, metrics.current.S, b)})`;
  });
  const capOpacity = useTransform(p, (v) => 1 - clamp(phaseA(v) * 1.6));
  const capY = useTransform(p, (v) => -phaseA(v) * 40);
  const overOpacity = useTransform(p, (v) => clamp((v - 0.8) / 0.12));
  const overY = useTransform(overOpacity, (o) => (1 - o) * 30);
  const overScale = useTransform(overOpacity, (o) => lerp(0.94, 1, o));

  return (
    <section className="zoom" id="zoom" aria-label="Masuk ke kedai" ref={ref}>
      <div className="zoom-sticky">
        <motion.div className="zcap" style={{ opacity: capOpacity, y: capY }}>
          <p className="eyebrow">Scroll dong gengs!</p>
          <h2>Semua racikan kami, dalam satu meja.</h2>
        </motion.div>

        <motion.div className="zgrid" aria-hidden="true" style={{ transform: gridTransform }}>
          {ZOOM_TILES.map((t, i) => (
            <ZTile key={i} i={i} tile={t} p={p} metrics={metrics} centerRef={i === 12 ? centerRef : undefined} />
          ))}
        </motion.div>

        <motion.div className="zover" style={{ opacity: overOpacity, y: overY, scale: overScale }}>
          <p className="eyebrow">Selamat datang</p>
          <h2>Tiga racikan, satu tongkrongan.</h2>
          <p>Pilih kopi yang bikin melek,susu segar yang manis, atau teh yang adem. Geser terus buat kenalan.</p>
          <div className="row">
            <span>Coffee</span><span>Milk</span><span>Tea</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ZTile({
  i, tile, p, metrics, centerRef,
}: {
  i: number;
  tile: ZoomTile;
  p: MotionValue<number>;
  metrics: Metrics;
  centerRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const dx = (i % 5) - 2;
  const dy = Math.floor(i / 5) - 2;
  const z = (((i * 7) % 9) - 4) * 70;
  const r = (((i * 5) % 7) - 3) * 4;

  const transform = useTransform(p, (v) => {
    const a = phaseA(v), b = phaseB(v);
    const push = b * metrics.current.tw * 0.9;
    return `translate3d(${dx * push}px, ${dy * push}px, ${lerp(z, 0, a)}px) rotate(${lerp(r, 0, a)}deg)`;
  });
  const opacity = useTransform(p, (v) => 1 - clamp((phaseB(v) - 0.35) / 0.4));
  const radius = useTransform(p, (v) => lerp(metrics.current.tw * 0.16, 0, phaseB(v)));
  const border = useTransform(p, (v) => lerp(2, 0, phaseB(v)));
  const labelOpacity = useTransform(p, (v) => 1 - clamp(phaseB(v) / 0.45));

  if (tile.kind === "center") {
    return (
      <motion.div ref={centerRef} className="zt center" style={{ borderRadius: radius, borderWidth: border }}>
        <motion.b
          style={{
            opacity: labelOpacity,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <img
            src="/icon2.svg"
            alt="Comitea"
            style={{ width: "100%", height: "100%", maxWidth: "220px", objectFit: "contain" }}
          />
        </motion.b>
      </motion.div>
    );
  }
  const style = { transform, opacity };
  if (tile.kind === "word") return <motion.div className={`zt word ${tile.color}`} style={style}><b>{tile.word}</b></motion.div>;
  if (tile.kind === "glyph") return <motion.div className={`zt word ${tile.color}`} style={style}><Glyph name={tile.glyph} /></motion.div>;
  const it = ALL[tile.index];
  return (
    <motion.div className={`zt c-${it.cat}`} style={style}>
      <small>{LABEL[it.cat]}</small>
      <Glyph name={it.glyph} />
      <b>{it.name}</b>
    </motion.div>
  );
}
