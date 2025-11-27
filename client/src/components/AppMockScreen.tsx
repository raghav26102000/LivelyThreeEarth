// components/AppMockScreen.tsx
import React from "react";

/**
 * AppMockScreen
 * - intended to be rendered inside <Html> in PhoneShowcase.
 * - fixed size: 360 x 760 (matches the phone container width/height used earlier).
 */
export default function AppMockScreen() {
  // small circular progress SVG generator
  const Ring = ({ percent = 60, color = "#5FBF6C", label = "Fiber", value = "45%" }: any) => {
    const radius = 28;
    const stroke = 6;
    const normalizedRadius = radius - stroke * 0.5;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <svg height={radius * 2} width={radius * 2}>
          <defs>
            <linearGradient id={`g-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.95" />
              <stop offset="100%" stopColor="#95E6A6" stopOpacity="0.75" />
            </linearGradient>
          </defs>
          <circle
            stroke="#edf7ee"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={`url(#g-${label})`}
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transition: "stroke-dashoffset 0.8s ease" }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            transform={`rotate(-90 ${radius} ${radius})`}
          />
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize={10} fill="#194b31" fontWeight={700}>
            {value}
          </text>
        </svg>
        <div style={{ fontSize: 12, color: "#2f6e42", fontWeight: 700 }}>{label}</div>
      </div>
    );
  };

  return (
    <div
      style={{
        width: 360,
        height: 760,
        borderRadius: 28,
        overflow: "hidden",
        background: "linear-gradient(180deg, #FEFFFC 0%, #F7FFF6 100%)",
        boxShadow: "0 20px 60px rgba(7,18,12,0.18)",
        fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        WebkitFontSmoothing: "antialiased",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* status bar */}
      <div style={{ height: 28, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", color: "#7b8f82", fontSize: 12 }}>
        <div>3:22</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ width: 6, height: 6, borderRadius: 999, background: "#e45c58" }} />
          <div style={{ fontWeight: 600 }}>76%</div>
        </div>
      </div>

      {/* hero / logo */}
      <div style={{ padding: 20, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 56, height: 56, borderRadius: 12, background: "#E6FAEA", display: "flex", alignItems: "center", justifyContent: "center", color: "#2f7a3e", fontWeight: 800, fontSize: 20 }}>
          TL
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#194b31" }}>The Lively Three</div>
          <div style={{ fontSize: 12, color: "#5f836b", marginTop: 4 }}>Smart nutrition, naturally</div>
        </div>
      </div>

      {/* main content card */}
      <div style={{ padding: "0 18px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ borderRadius: 18, background: "white", padding: 16, boxShadow: "0 8px 18px rgba(8,20,12,0.06)" }}>
          <h3 style={{ margin: 0, fontSize: 20, color: "#103824" }}>Daily snapshot</h3>
          <p style={{ marginTop: 8, fontSize: 13, color: "#486a53" }}>Track fiber, protein & micronutrients at a glance.</p>

          <div style={{ display: "flex", gap: 12, marginTop: 14, alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Ring percent={45} color="#5FBF6C" label="Fiber" value="45%" />
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ fontSize: 13, color: "#244f36", fontWeight: 700 }}>Fiber</div>
                <div style={{ fontSize: 12, color: "#5f7a66" }}>25–35 g target</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 1, height: 70, background: "#f1f6ef", borderRadius: 2 }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ width: 68, height: 38, borderRadius: 10, background: "#E8F7EA", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#2f7a3e" }}>
                    +12g
                  </div>
                  <div style={{ width: 68, height: 38, borderRadius: 10, background: "#fff8ec", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#c6872a" }}>
                    42%
                  </div>
                </div>
                <div style={{ fontSize: 12, color: "#6b8768" }}>Today’s impact • Sustainability score</div>
              </div>
            </div>
          </div>

          {/* CTA row */}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button style={{ flex: 1, height: 44, borderRadius: 999, background: "#2F7A3E", color: "white", fontWeight: 800, border: "none" }}>Log meal</button>
            <button style={{ width: 44, height: 44, borderRadius: 12, background: "white", border: "1px solid #eef6ee" }}>⋯</button>
          </div>
        </div>

        {/* Insights row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ borderRadius: 14, background: "#ffffff", padding: 12, boxShadow: "0 6px 14px rgba(8,20,12,0.04)" }}>
            <div style={{ fontSize: 12, color: "#5b7a64", fontWeight: 700 }}>Community</div>
            <div style={{ marginTop: 8, fontSize: 13, color: "#254c2a", fontWeight: 700 }}>Challenges</div>
            <div style={{ marginTop: 8, fontSize: 12, color: "#5f7b66" }}>Join step & fiber challenges</div>
          </div>

          <div style={{ borderRadius: 14, background: "linear-gradient(180deg,#f7fff6,#ffffff)", padding: 12 }}>
            <div style={{ fontSize: 12, color: "#7b8f82", fontWeight: 700 }}>Sustainability</div>
            <div style={{ marginTop: 8, fontSize: 13, color: "#254c2a", fontWeight: 700 }}>Footprint</div>
            <div style={{ marginTop: 8, fontSize: 12, color: "#5f7b66" }}>Your daily impact: <strong>Low</strong></div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* bottom nav */}
      <div style={{ height: 84, display: "flex", alignItems: "center", justifyContent: "space-around", borderTop: "1px solid rgba(10,20,12,0.04)", background: "#fff" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: "#fff", boxShadow: "0 6px 14px rgba(10,30,15,0.06)" }} />
          <div style={{ fontSize: 11, color: "#587765" }}>Home</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: "#E6FAEA", display: "flex", alignItems: "center", justifyContent: "center", color: "#2f7a3e", fontWeight: 800 }}>+ </div>
          <div style={{ fontSize: 11, color: "#587765" }}>Log</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: "#fff", boxShadow: "0 6px 14px rgba(10,30,15,0.06)" }} />
          <div style={{ fontSize: 11, color: "#587765" }}>Profile</div>
        </div>
      </div>
    </div>
  );
}
