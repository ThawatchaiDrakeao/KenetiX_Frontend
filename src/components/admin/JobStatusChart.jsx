import { useState } from "react";
import { motion } from "framer-motion";

const LIME = "#C3FF51";
const LIME_TRACK = "rgba(195,255,81,0.10)";
const NEUTRAL = "#CBD5E1";
const NEUTRAL_DIM = "#E2E8F0";

const STATUS_DATA = [
  { label: "Delivered",  count: 52 },
  { label: "In Transit", count: 14 },
  { label: "Return",     count: 18 },
  { label: "Waiting",    count: 6  },
  { label: "Cancelled",  count: 8  },
];

const TOTAL = STATUS_DATA.reduce((s, d) => s + d.count, 0);
const R = 70;
const STROKE = 14;
const CX = 88;
const CY = 88;
const CIRC = 2 * Math.PI * R;
const GAP = 4;

function buildSlices() {
  const usable = CIRC - STATUS_DATA.length * GAP;
  const slices = [];
  let offset = 0;
  STATUS_DATA.forEach((d) => {
    const dash = (d.count / TOTAL) * usable;
    slices.push({ ...d, dash, gap: CIRC - dash, offset });
    offset += dash + GAP;
  });
  return slices;
}

const SLICES = buildSlices();

export default function JobStatusChart() {
  const [hovered, setHovered] = useState(null);
  const active = hovered ? STATUS_DATA.find((d) => d.label === hovered) : null;
  const getSegColor = (label) => hovered === label ? LIME : (hovered ? NEUTRAL_DIM : NEUTRAL);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="rounded-2xl p-6 h-full flex flex-col gap-6"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div>
        <h3 className="font-semibold font-sora text-[14px]" style={{ color: "#0F172A" }}>
          Jobs by Status
        </h3>
        <p className="text-[12px] font-sora mt-0.5" style={{ color: "#64748B" }}>
          Current period
        </p>
      </div>

      <div className="flex justify-center">
        <div className="relative">
          <svg width="176" height="176" viewBox="0 0 176 176">
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="#F1F5F9" strokeWidth={STROKE} />
            {SLICES.map((s) => (
              <circle
                key={s.label}
                cx={CX} cy={CY} r={R}
                fill="none"
                stroke={getSegColor(s.label)}
                strokeWidth={hovered === s.label ? STROKE + 5 : STROKE}
                strokeDasharray={`${s.dash} ${s.gap}`}
                strokeDashoffset={-s.offset + CIRC * 0.25}
                strokeLinecap="round"
                style={{
                  cursor: "pointer",
                  transition: "stroke 180ms ease, stroke-width 180ms ease",
                }}
                onMouseEnter={() => setHovered(s.label)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p
              className="font-extrabold font-sora leading-none"
              style={{
                fontSize: "30px",
                letterSpacing: "-0.02em",
                color: active ? LIME : "#0F172A",
                transition: "color 150ms ease",
              }}
            >
              {active ? active.count : TOTAL}
            </p>
            <p className="text-[11px] font-sora mt-1" style={{ color: "#94A3B8" }}>
              {active ? active.label : "total jobs"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {STATUS_DATA.map((d) => {
          const pct = Math.round((d.count / TOTAL) * 100);
          const isHovered = hovered === d.label;
          return (
            <div
              key={d.label}
              className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-default"
              style={{
                background: isHovered ? LIME_TRACK : "transparent",
                transition: "background 150ms ease",
              }}
              onMouseEnter={() => setHovered(d.label)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  background: isHovered ? LIME : NEUTRAL,
                  transition: "background 150ms ease",
                }}
              />
              <span className="text-[13px] font-sora flex-1" style={{ color: "#64748B" }}>
                {d.label}
              </span>
              <span
                className="text-[12px] font-semibold font-sora w-6 text-right"
                style={{ color: isHovered ? "#0F172A" : "#374151", transition: "color 150ms ease" }}
              >
                {d.count}
              </span>
              <span className="text-[11px] font-sora w-8 text-right" style={{ color: "#94A3B8" }}>
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
