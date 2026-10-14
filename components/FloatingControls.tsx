"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { createFileEngine, createLofiEngine, type BgmEngine } from "@/lib/lofi";
import styles from "./FloatingControls.module.css";

/**
 * Tombol melayang kanan bawah:
 *  - Kembali ke atas (muncul setelah lewat hero)
 *  - Musik on/off (BGM cozy)
 *
 * Browser melarang audio berbunyi sebelum ada interaksi, jadi musik mulai
 * pada klik/ketukan/tombol keyboard pertama di halaman. Pilihan mute disimpan
 * di browser pengunjung.
 *
 * Mau pakai lagu sendiri? Taruh file di public/bgm.mp3 — otomatis dipakai.
 */
const STORE_KEY = "comitea-bgm-muted";
const CUSTOM_TRACK = "/bgm.mp3";

function readMuted() {
  try { return localStorage.getItem(STORE_KEY) === "1"; } catch { return false; }
}
function saveMuted(v: boolean) {
  try { localStorage.setItem(STORE_KEY, v ? "1" : "0"); } catch { /* abaikan */ }
}

async function pickEngine(): Promise<BgmEngine> {
  try {
    const res = await fetch(CUSTOM_TRACK, { method: "HEAD" });
    const type = res.headers.get("content-type") || "";
    if (res.ok && type.startsWith("audio")) return createFileEngine(CUSTOM_TRACK);
  } catch { /* pakai generator */ }
  return createLofiEngine();
}

export default function FloatingControls() {
  const engine = useRef<BgmEngine | null>(null);
  const starting = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [mutedPref, setMutedPref] = useState(true); // diisi dari storage setelah mount
  const [ready, setReady] = useState(false);
  const [showTop, setShowTop] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setShowTop(y > window.innerHeight * 0.8));

  const startMusic = useCallback(async () => {
    if (starting.current) return;
    starting.current = true;
    try {
      if (!engine.current) engine.current = await pickEngine();
      await engine.current.start();
      setPlaying(true);
      setMutedPref(false);
      saveMuted(false);
    } catch {
      /* browser menolak memutar — tunggu interaksi berikutnya */
    } finally {
      starting.current = false;
    }
  }, []);

  // baca preferensi, lalu pasang pemicu "interaksi pertama"
  useEffect(() => {
    const m = readMuted();
    setMutedPref(m);
    setReady(true);
    setShowTop(window.scrollY > window.innerHeight * 0.8);
    if (m) return;

    const onFirst = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest?.("[data-bgm-toggle]")) return; // tombol musik punya logikanya sendiri
      startMusic();
      off();
    };
    const evs = ["pointerdown", "keydown", "touchstart"] as const;
    const off = () => evs.forEach((ev) => window.removeEventListener(ev, onFirst));
    evs.forEach((ev) => window.addEventListener(ev, onFirst, { passive: true }));
    return off;
  }, [startMusic]);

  // jeda saat tab disembunyikan
  useEffect(() => {
    const onVis = () => {
      if (!engine.current || !playing) return;
      if (document.hidden) engine.current.suspend();
      else engine.current.resume();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [playing]);

  useEffect(() => () => engine.current?.dispose(), []);

  const toggle = () => {
    if (playing) {
      engine.current?.setMuted(true);
      setPlaying(false);
      setMutedPref(true);
      saveMuted(true);
    } else {
      startMusic();
    }
  };

  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const showHint = ready && !playing && !mutedPref;

  return (
    <div className={styles.dock}>
      <AnimatePresence>
        {showTop && (
          <motion.button
            key="top"
            type="button"
            className={styles.btn}
            onClick={toTop}
            aria-label="Kembali ke atas"
            title="Kembali ke atas"
            initial={{ opacity: 0, y: 20, scale: 0.6 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.6 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      <div className={styles.row}>
        <AnimatePresence>
          {showHint && (
            <motion.span
              key="hint"
              className={styles.hint}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ delay: 1.2, duration: 0.4 }}
            >
              Ketuk di mana saja buat putar musik ♪
            </motion.span>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          data-bgm-toggle
          className={`${styles.btn} ${playing ? styles.on : ""}`}
          onClick={toggle}
          aria-pressed={playing}
          aria-label={playing ? "Matikan musik" : "Nyalakan musik"}
          title={playing ? "Matikan musik" : "Nyalakan musik"}
          whileTap={{ scale: 0.9 }}
        >
          {playing ? (
            <span className={styles.bars} aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <motion.span
                  key={i}
                  animate={{ scaleY: [0.35, 1, 0.5, 0.85, 0.35] }}
                  transition={{ duration: 1.1 + i * 0.17, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }}
                />
              ))}
            </span>
          ) : (
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
              <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
                <path d="M17 9l5 6M22 9l-5 6" />
              </g>
            </svg>
          )}
        </motion.button>
      </div>
    </div>
  );
}
