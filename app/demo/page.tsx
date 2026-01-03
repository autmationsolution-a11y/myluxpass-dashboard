"use client";

import { useMemo, useState } from "react";

type Booking = {
  id: string;
  client: string;
  service: string;
  time: string;
  status: "Confirmed" | "Pending" | "Completed" | "Cancelled";
  amount: number;
};

export default function DemoDashboardPage() {
  const [range, setRange] = useState<"7d" | "30d">("7d");

  const kpis = useMemo(() => {
    if (range === "7d") {
      return { revenue: 1840, bookings: 42, newClients: 11, rating: 4.8 };
    }
    return { revenue: 7420, bookings: 168, newClients: 41, rating: 4.7 };
  }, [range]);

  const bookings: Booking[] = useMemo(
    () => [
      { id: "BK-1042", client: "Sara M.", service: "Hair + Styling", time: "Today 17:30", status: "Confirmed", amount: 65 },
      { id: "BK-1041", client: "Mark C.", service: "Massage 60min", time: "Today 16:00", status: "Pending", amount: 80 },
      { id: "BK-1040", client: "Lina A.", service: "Nails (Gel)", time: "Today 14:15", status: "Completed", amount: 45 },
      { id: "BK-1039", client: "Joseph P.", service: "PT Session", time: "Yesterday 19:00", status: "Completed", amount: 50 },
      { id: "BK-1038", client: "Emma R.", service: "Facial", time: "Yesterday 12:30", status: "Cancelled", amount: 0 },
    ],
    []
  );

  const chartData = useMemo(() => {
    const points = range === "7d"
      ? [12, 18, 9, 20, 16, 22, 14]
      : [10, 12, 18, 14, 20, 16, 22, 19, 24, 18, 26, 21, 28, 24, 30, 26, 32, 28, 34, 30, 36, 31, 38, 33, 40, 35, 42, 36, 44, 38];

    const max = Math.max(...points);
    return points.map((v, i) => ({
      x: i,
      y: v,
      yn: max === 0 ? 0 : v / max,
    }));
  }, [range]);

  const StatusPill = ({ s }: { s: Booking["status"] }) => {
    const map: Record<Booking["status"], { bg: string; fg: string; border: string }> = {
      Confirmed: { bg: "#ECFDF5", fg: "#065F46", border: "#A7F3D0" },
      Pending: { bg: "#EFF6FF", fg: "#1E40AF", border: "#BFDBFE" },
      Completed: { bg: "#F5F3FF", fg: "#5B21B6", border: "#DDD6FE" },
      Cancelled: { bg: "#FEF2F2", fg: "#991B1B", border: "#FECACA" },
    };
    const c = map[s];
    return (
      <span
        style={{
          display: "inline-flex",
          padding: "6px 10px",
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 600,
          background: c.bg,
          color: c.fg,
          border: `1px solid ${c.border}`,
          whiteSpace: "nowrap",
        }}
      >
        {s}
      </span>
    );
  };

  const Card = ({ title, value, sub }: { title: string; value: string; sub: string }) => (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: 26, fontWeight: 800, marginTop: 6, color: "#111827" }}>{value}</div>
      <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>{sub}</div>
    </div>
  );

  return (
    <main style={{ background: "#F8FAFC", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 16px 40px" }}>
        {/* Top bar */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#0F172A" }}>MyLuxPass Partner Dashboard (Demo)</div>
            <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>
              This is a live-style demo. Real data and login will be connected after final auth fix.
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <select
              value={range}
              onChange={(e) => setRange(e.target.value as "7d" | "30d")}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid #E2E8F0",
                background: "#fff",
                fontWeight: 600,
              }}
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>

            <a
              href="/login"
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid #E2E8F0",
                background: "#fff",
                fontWeight: 700,
                textDecoration: "none",
                color: "#0F172A",
              }}
            >
              Partner Login
            </a>
          </div>
        </div>

        {/* KPI cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12, marginTop: 16 }}>
          <Card title="Revenue" value={`€${kpis.revenue.toLocaleString()}`} sub={`${range === "7d" ? "Weekly" : "Monthly"} performance`} />
          <Card title="Bookings" value={`${kpis.bookings}`} sub="All channels" />
          <Card title="New clients" value={`${kpis.newClients}`} sub="First-time customers" />
          <Card title="Rating" value={`${kpis.rating.toFixed(1)}★`} sub="Average reviews" />
        </div>

        {/* Chart + table */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 12, marginTop: 12 }}>
          {/* Chart */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: 16,
              padding: 16,
              boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>Bookings trend</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>Auto-updating graph (demo)</div>
            </div>

            <div style={{ marginTop: 10 }}>
              <svg viewBox="0 0 600 220" width="100%" height="220" style={{ display: "block" }}>
                {/* grid */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line key={i} x1="0" y1={20 + i * 40} x2="600" y2={20 + i * 40} stroke="#EEF2F7" strokeWidth="1" />
                ))}

                {/* line */}
                <polyline
                  fill="none"
                  stroke="#0F172A"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={chartData
                    .map((p) => {
                      const x = 20 + (p.x * (560 / Math.max(1, chartData.length - 1)));
                      const y = 200 - p.yn * 160;
                      return `${x},${y}`;
                    })
                    .join(" ")}
                />

                {/* dots */}
                {chartData.map((p, idx) => {
                  const x = 20 + (p.x * (560 / Math.max(1, chartData.length - 1)));
                  const y = 200 - p.yn * 160;
                  return <circle key={idx} cx={x} cy={y} r="4" fill="#0F172A" />;
                })}
              </svg>
            </div>
          </div>

          {/* Quick actions */}
          <div
            style={{
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: 16,
              padding: 16,
              boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>Quick actions</div>
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 6 }}>What partners want to see first</div>

            <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
              {[
                { title: "Create a service", desc: "Add services, prices, duration", tag: "2 min" },
                { title: "Set availability", desc: "Working hours and breaks", tag: "3 min" },
                { title: "View bookings", desc: "Today, week, month", tag: "Instant" },
                { title: "Revenue report", desc: "Daily, weekly, monthly", tag: "Instant" },
              ].map((x) => (
                <div key={x.title} style={{ border: "1px solid #E5E7EB", borderRadius: 14, padding: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ fontWeight: 800, color: "#0F172A" }}>{x.title}</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#0F172A", opacity: 0.7 }}>{x.tag}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>{x.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings table */}
        <div
          style={{
            marginTop: 12,
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: 16,
            padding: 16,
            boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>Recent bookings</div>
              <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>Demo list (replace with live data later)</div>
            </div>
            <div style={{ fontSize: 12, color: "#64748B", fontWeight: 700 }}>Status, client, service, time</div>
          </div>

          <div style={{ overflowX: "auto", marginTop: 10 }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
              <thead>
                <tr style={{ textAlign: "left", fontSize: 12, color: "#64748B" }}>
                  <th style={{ padding: "10px 8px", borderBottom: "1px solid #E5E7EB" }}>Booking</th>
                  <th style={{ padding: "10px 8px", borderBottom: "1px solid #E5E7EB" }}>Client</th>
                  <th style={{ padding: "10px 8px", borderBottom: "1px solid #E5E7EB" }}>Service</th>
                  <th style={{ padding: "10px 8px", borderBottom: "1px solid #E5E7EB" }}>Time</th>
                  <th style={{ padding: "10px 8px", borderBottom: "1px solid #E5E7EB" }}>Status</th>
                  <th style={{ padding: "10px 8px", borderBottom: "1px solid #E5E7EB", textAlign: "right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td style={{ padding: "12px 8px", borderBottom: "1px solid #F1F5F9", fontWeight: 800, color: "#0F172A" }}>
                      {b.id}
                    </td>
                    <td style={{ padding: "12px 8px", borderBottom: "1px solid #F1F5F9", color: "#0F172A" }}>{b.client}</td>
                    <td style={{ padding: "12px 8px", borderBottom: "1px solid #F1F5F9", color: "#0F172A" }}>{b.service}</td>
                    <td style={{ padding: "12px 8px", borderBottom: "1px solid #F1F5F9", color: "#0F172A" }}>{b.time}</td>
                    <td style={{ padding: "12px 8px", borderBottom: "1px solid #F1F5F9" }}>
                      <StatusPill s={b.status} />
                    </td>
                    <td style={{ padding: "12px 8px", borderBottom: "1px solid #F1F5F9", textAlign: "right", fontWeight: 800, color: "#0F172A" }}>
                      {b.amount ? `€${b.amount}` : "–"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ fontSize: 12, color: "#64748B", marginTop: 10 }}>
            Tip: send your partner this link: <b>/demo</b>
          </div>
        </div>
      </div>
    </main>
  );
}
