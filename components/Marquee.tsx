const WORDS = ["TEA", "COFFEE", "MILK", "SEDUH SEGAR", "NONGKRONG DULU"];

function Run() {
  return (
    <span>
      {[...WORDS, ...WORDS].map((w, i) => (
        <span key={i}>
          {w}
          <b>✦</b>
        </span>
      ))}
    </span>
  );
}

export default function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        <Run />
        <Run />
      </div>
    </div>
  );
}
