import type { GlyphName } from "@/lib/menu";

const common = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 3.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export default function Glyph({ name, className }: { name: GlyphName; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <g {...common}>
        {name === "hot" && (
          <>
            <path d="M12 28h34v8a17 17 0 0 1-34 0z" />
            <path d="M46 31h4a6 6 0 0 1 0 12h-5" />
            <path d="M8 58h44" />
            <g className="steam">
              <path d="M22 20c-3-4 3-6 0-11" />
              <path d="M30 20c-3-4 3-6 0-11" />
              <path d="M38 20c-3-4 3-6 0-11" />
            </g>
          </>
        )}
        {name === "iced" && (
          <>
            <path d="M16 14h32l-4 44H20z" />
            <path d="M38 14 44 4" />
            <rect x="22" y="24" width="8" height="8" rx="2" />
            <rect x="32" y="30" width="8" height="8" rx="2" />
            <path d="M18 40h28" />
          </>
        )}
        {name === "tea" && (
          <>
            <path d="M10 26h36a18 18 0 0 1-36 0z" />
            <path d="M46 30h4a5 5 0 0 1 0 10h-6" />
            <path d="M28 26V10" />
            <rect x="24" y="10" width="8" height="8" rx="1.5" fill="currentColor" />
            <path d="M14 56h32" />
          </>
        )}
        {name === "milk" && (
          <>
            <path d="M24 4h16v8l6 10v34a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4V22l6-10z" />
            <path d="M24 12h16" />
            <path d="M18 34c6-4 10 4 16 0s8-4 12-2" />
          </>
        )}
        {name === "bean" && (
          <>
            <ellipse cx="32" cy="32" rx="16" ry="23" transform="rotate(30 32 32)" />
            <path d="M24 14c10 10 0 26 16 36" />
          </>
        )}
        {name === "leaf" && (
          <>
            <path d="M12 52C10 26 26 10 54 10c0 28-16 44-42 42z" />
            <path d="M12 52 38 26" />
          </>
        )}
      </g>
    </svg>
  );
}
