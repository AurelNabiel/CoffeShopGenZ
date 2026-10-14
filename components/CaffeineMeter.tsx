import { caffeineLevel } from "@/lib/menu";

export default function CaffeineMeter({ mg }: { mg: number }) {
  const lvl = caffeineLevel(mg);
  return (
    <span className="meter" title={mg ? `±${mg} mg kafein` : "Tanpa kafein"}>
      <small>Kafein</small>
      {[1, 2, 3, 4, 5].map((i) => (
        <i key={i} className={i <= lvl ? "on" : ""} />
      ))}
    </span>
  );
}
