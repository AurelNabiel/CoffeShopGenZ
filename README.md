<div align="center">

# Comitea

### Coffee shop one-page dengan scroll yang bikin betah.
**Coffee Milk Tea ** - dibangun dengan Next.js 15 dan animasi [motion.dev](https://motion.dev)

<br />

![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Motion](https://img.shields.io/badge/Motion-12-FE6B03?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

<!-- Tambahkan screenshot / GIF demo di sini:
<img src="docs/preview.gif" alt="Preview Comitea" width="800" />
-->

</div>

---

## Highlight

| | Fitur | Deskripsi |
|---|---|---|
| 🎞️ | **Zoom Grid 3D** | Scroll grid 3D lalu zoom masuk ke kotak tengah "KJ" |
| 📖 | **Chapters** | Galeri horizontal bergulir: Tea → Coffee → Milk |
| 🍵 | **Menu Interaktif** | Tab kategori dan kartu produk dengan transisi `layoutId` |
| 🎭 | **Mood Picker** | Rekomendasi minuman sesuai mood kamu hari ini |
| 🎧 | **BGM Lo-fi Generatif** | Musik cozy dibuat langsung di browser lewat Web Audio API |
| ♿ | **Ramah Aksesibilitas** | Mendukung *reduce motion* di OS pengunjung |
| 🎨 | **Palet Berani** | Oranye `#FE6B03` dan putih `#FFFFFF` |

---

## Tech Stack

- **[Next.js 15](https://nextjs.org)** (App Router) + **React 19** + **TypeScript**
- **[`motion`](https://motion.dev) 12** - `useScroll`, `useTransform`, spring, `layoutId`, `AnimatePresence`
- **`next/font/google`** — Unbounded, Plus Jakarta Sans, DM Mono
- **CSS biasa** di `app/globals.css` (tanpa Tailwind)

---

## Mulai Cepat

```bash
# 1. Install dependensi
npm install

# 2. Jalankan mode development
npm run dev
# buka http://localhost:3000

# 3. (Opsional) Build & jalankan mode production
npm run build && npm start
```

> **Catatan**
> - Butuh **Node.js 18.18+** (disarankan 20+).
> - Saat build, Next.js mengunduh font dari Google Fonts, jadi perlu koneksi internet.

---

## Struktur Proyek

```
app/
├── layout.tsx          # font, metadata, MotionConfig
├── page.tsx            # susunan section
├── globals.css         # semua style + token warna
└── icon.svg            # favicon

components/
├── Hero.tsx            # judul animasi, chip melayang, cangkir parallax
├── Marquee.tsx         # pita teks berjalan
├── ZoomGrid.tsx        # ★ scroll grid 3D → zoom ke kotak "KJ"
├── Chapters.tsx        # ★ galeri horizontal Tea → Coffee → Milk
├── MenuSection.tsx     # tab kategori + kartu produk (tanpa harga)
├── MoodPicker.tsx      # rekomendasi minuman berdasarkan mood
└── Brew.tsx, Visit.tsx, Nav.tsx, Glyph.tsx, CaffeineMeter.tsx

lib/
├── menu.ts             # SEMUA data menu, chapter, dan isi grid
└── anim.ts             # helper clamp / lerp / easing
```

---

## Mengubah Konten

| Yang ingin diubah | Lokasi |
|---|---|
| **Menu** (nama, deskripsi, suhu, ml, kafein, mood, tag) | `MENU` di `lib/menu.ts` |
| **Isi grid zoom** (25 kotak, index 12 = kotak tengah) | `ZOOM_TILES` di `lib/menu.ts` |
| **Alamat & kontak** | `components/Visit.tsx` |
| **Warna** | variabel `:root` di `app/globals.css` |

---

## Background Music

Musik lo-fi cozy dibuat **langsung di browser** dengan Web Audio API: tanpa file audio dan tanpa urusan lisensi.

- Musik mulai pada **klik/ketukan pertama** (browser tidak mengizinkan audio otomatis sebelum ada interaksi).
- Tombol musik di **kanan bawah** untuk mute/unmute, dan pilihan mute diingat di browser pengunjung.
- Musik **otomatis berhenti** saat tab ditinggalkan dan lanjut saat kembali.
- Tombol **panah ke atas** muncul setelah melewati hero dan membawa kembali ke awal.

### Mau pakai lagu sendiri?

Taruh file MP3 di `public/bgm.mp3`. Komponen otomatis memakainya menggantikan musik buatan.

> Pastikan lagunya **bebas royalti** atau kamu punya lisensinya.

---

## ♿ Aksesibilitas

Jika pengunjung mengaktifkan **"reduce motion"** di OS, animasi dimatikan dan section scroll tampil sebagai konten biasa.

---

## Deploy

Siap deploy ke **[Vercel](https://vercel.com)**:

1. Push proyek ke GitHub
2. Import repository di Vercel
3. Klik **Deploy**, tanpa environment variable

---

<div align="center">

dibuat oleh : Aurelio Nabiel

**Comitea** - *Coffe, Milk, Tea.*

</div>
