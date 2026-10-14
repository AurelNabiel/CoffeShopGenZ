export type Category = "tea" | "coffee" | "milk";
export type GlyphName = "hot" | "iced" | "tea" | "milk" | "bean" | "leaf";
export type Mood = "melek" | "segar" | "manis" | "santai";

export interface MenuItem {
  name: string;
  desc: string;
  glyph: GlyphName;
  temp: string[];
  ml: number;
  /** perkiraan kafein (mg) per porsi */
  caffeine: number;
  moods: Mood[];
  tag?: string;
}

export const LABEL: Record<Category, string> = { tea: "Tea", coffee: "Coffee", milk: "Milk" };
export const CATEGORIES: Category[] = ["tea", "coffee", "milk"];

export const MENU: Record<Category, MenuItem[]> = {
  tea: [
    { name: "Teh Melati Tubruk", desc: "Teh hitam dan melati Slawi, diseduh tubruk dengan gula batu terpisah.", glyph: "tea", temp: ["Panas"], ml: 250, caffeine: 40, moods: ["santai"] },
    { name: "Lemon Tea Dingin", desc: "Teh pucuk Puncak, perasan lemon segar, sedikit madu.", glyph: "iced", temp: ["Dingin"], ml: 400, caffeine: 35, moods: ["segar"] },
    { name: "Jasmine Peach", desc: "Teh melati cold brew 8 jam dengan sirup persik buatan sendiri.", glyph: "iced", temp: ["Dingin"], ml: 400, caffeine: 30, moods: ["segar", "manis"], tag: "Baru" },
    { name: "Teh Tarik Jahe", desc: "Teh kental, susu, dan jahe merah yang ditarik sampai berbusa.", glyph: "tea", temp: ["Panas"], ml: 300, caffeine: 45, moods: ["santai", "manis"] },
    { name: "Matcha Latte", desc: "Matcha grade upacara dikocok manual, dengan susu segar Lembang.", glyph: "iced", temp: ["Panas", "Dingin"], ml: 350, caffeine: 70, moods: ["melek", "manis"] },
  ],
  coffee: [
    { name: "Kopi Susu Gula Aren", desc: "Espresso, susu segar, dan gula aren cair dari Banten.", glyph: "iced", temp: ["Dingin"], ml: 400, caffeine: 130, moods: ["melek", "manis"], tag: "Favorit" },
    { name: "Cold Brew Jingga", desc: "Cold brew 16 jam dengan kulit jeruk dan soda. Seger, sedikit pahit.", glyph: "iced", temp: ["Dingin"], ml: 350, caffeine: 180, moods: ["segar", "melek"], tag: "Khas" },
    { name: "V60 Gayo Wine", desc: "Arabika Gayo proses wine. Ada rasa anggur merah, nanas, dan madu.", glyph: "hot", temp: ["Panas"], ml: 250, caffeine: 150, moods: ["santai", "melek"] },
    { name: "Espresso", desc: "Double shot house blend. Cokelat pekat dengan akhir yang manis.", glyph: "hot", temp: ["Panas"], ml: 40, caffeine: 130, moods: ["melek"] },
    { name: "Americano", desc: "Double shot di atas air panas atau es. Bersih dan ringan.", glyph: "hot", temp: ["Panas", "Dingin"], ml: 300, caffeine: 130, moods: ["melek", "segar"] },
    { name: "Cappuccino", desc: "Espresso dengan susu bertekstur halus dan busa setebal 1 cm.", glyph: "hot", temp: ["Panas"], ml: 240, caffeine: 130, moods: ["santai"] },
  ],
  milk: [
    { name: "Strawberry Milk", desc: "Selai stroberi Ciwidey buatan sendiri di dasar gelas.", glyph: "milk", temp: ["Dingin"], ml: 350, caffeine: 0, moods: ["manis", "segar"], tag: "Baru" },
    { name: "Chocolate Milk", desc: "Cokelat 60% dari Jember dilelehkan, bukan bubuk instan.", glyph: "iced", temp: ["Panas", "Dingin"], ml: 350, caffeine: 12, moods: ["manis"] },
    { name: "Susu Segar Madu", desc: "Susu Lembang dengan madu hutan Sumbawa.", glyph: "milk", temp: ["Panas", "Dingin"], ml: 300, caffeine: 0, moods: ["santai", "manis"] },
    { name: "Taro Milk", desc: "Talas ungu kukus yang dihaluskan, bukan perisa.", glyph: "iced", temp: ["Dingin"], ml: 350, caffeine: 0, moods: ["manis"] },
    { name: "Banana Milk", desc: "Pisang raja matang diblender dengan susu dan sedikit kayu manis.", glyph: "milk", temp: ["Dingin"], ml: 350, caffeine: 0, moods: ["manis", "santai"] },
  ],
};

export type FlatItem = MenuItem & { cat: Category };
export const ALL: FlatItem[] = CATEGORIES.flatMap((cat) => MENU[cat].map((it) => ({ ...it, cat })));

export const CHAPTERS: {
  cat: Category;
  no: string;
  title: string;
  desc: string;
  facts: [string, string][];
}[] = [
  { cat: "tea", no: "01", title: "Teh yang adem, wanginya awet.", desc: "Daun teh pucuk dari Puncak dan melati Slawi, diseduh pelan supaya sepatnya lembut.", facts: [["Asal", "Puncak & Slawi"], ["Suhu", "85°C"], ["Seduh", "3 menit"]] },
  { cat: "coffee", no: "02", title: "Kopi Nusantara, disangrai tiap Senin.", desc: "Arabika Gayo dan Kintamani untuk manual brew, robusta Temanggung untuk kopi susu.", facts: [["Asal", "Gayo & Kintamani"], ["Rasio", "1 : 15"], ["Sangrai", "Medium"]] },
  { cat: "milk", no: "03", title: "Susu segar, tanpa kopi pun enak.", desc: "Susu sapi Lembang dikirim tiap pagi, dipadukan dengan madu, cokelat, stroberi, atau taro.", facts: [["Asal", "Lembang"], ["Kirim", "Tiap pagi"], ["Kafein", "0 mg"]] },
];

/** Isi grid 5×5 di section zoom. Index 12 = kotak tengah (brand). */
export type ZoomTile =
  | { kind: "center" }
  | { kind: "word"; color: string; word: string }
  | { kind: "glyph"; color: string; glyph: GlyphName }
  | { kind: "product"; index: number };

export const ZOOM_TILES: ZoomTile[] = [
  { kind: "word", color: "c-sun", word: "TEH" }, { kind: "product", index: 0 }, { kind: "glyph", color: "c-coffee", glyph: "bean" }, { kind: "product", index: 6 }, { kind: "word", color: "c-milk", word: "SUSU" },
  { kind: "product", index: 1 }, { kind: "word", color: "c-coffee", word: "KOPI" }, { kind: "product", index: 11 }, { kind: "glyph", color: "c-tea", glyph: "leaf" }, { kind: "product", index: 7 },
  { kind: "product", index: 12 }, { kind: "product", index: 2 }, { kind: "center" }, { kind: "product", index: 5 }, { kind: "word", color: "c-sun", word: "SEGAR" },
  { kind: "glyph", color: "c-milk", glyph: "milk" }, { kind: "product", index: 8 }, { kind: "product", index: 13 }, { kind: "word", color: "c-coffee", word: "NGOPI?" }, { kind: "product", index: 3 },
  { kind: "product", index: 9 }, { kind: "word", color: "c-tea", word: "SANTAI" }, { kind: "product", index: 4 }, { kind: "glyph", color: "c-sun", glyph: "hot" }, { kind: "product", index: 14 },
];

export const caffeineLevel = (mg: number) =>
  mg === 0 ? 0 : mg <= 40 ? 1 : mg <= 70 ? 2 : mg <= 130 ? 3 : mg <= 150 ? 4 : 5;
