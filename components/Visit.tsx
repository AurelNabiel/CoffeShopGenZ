"use client";

import { motion } from "motion/react";
import { EASE_OUT } from "@/lib/anim";

const INFO: [string, string][] = [
  ["Alamat", "Jalan Pasar Kecapi No 4, Jatiwarna, Bekasi"],
  ["Jam buka", "Setiap hari, 09.00–21.00 WIB"],
  ["WhatsApp", "0812-0000-2026"],
  ["Instagram", "@comiteaid"],
];

export default function Visit() {
  return (
    <section className="block visit" id="kunjungi">
      <div className="wrap">
        <div>
          <p className="eyebrow">Mampir yuk</p>
          <motion.h2
            initial={{ y: 40, opacity: 0.2 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
          >
            Duduk dulu, pesan satu lagi.
          </motion.h2>
        </div>
        <motion.dl
          className="info"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
        >
          {INFO.map(([k, v]) => (
            <motion.div
              key={k}
              variants={{ hidden: { x: 40, opacity: 0 }, show: { x: 0, opacity: 1, transition: { duration: 0.5, ease: EASE_OUT } } }}
            >
              <dt>{k}</dt>
              <dd>{v}</dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
