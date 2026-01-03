export default function DemoPage() {
  return (
    <main style={{ padding: 28, fontFamily: "system-ui, Arial" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26 }}>MyLuxPass Partner Dashboard (Demo)</h1>
          <p style={{ marginTop: 6, color: "#666" }}>
            This is a public demo view. Login will be enabled once auth is fixed.
          </p>
        </div>
        <a
          href="/login"
          style={{
            alignSelf: "center",
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            textDecoration: "none",
            color: "#111",
          }}
        >
          Go to Login
        </a>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 14,
          marginTop: 18,
        }}
      >
        {[
          { title: "Bookings (Today)", value: "18" },
          { title: "Revenue (Today)", value: "€1,260" },
          { title: "Active Services", value: "12" },
          { title: "Customers (7 days)", value: "94" },
        ].map((kpi) => (
          <div
            key={kpi.title}
            style={{
              border: "1px solid #e5e5e5",
              borderRadius: 14,
              padding: 14,
              background: "#fff",
            }}
          >
            <div style={{ fontSize: 13, color: "#777" }}>{kpi.title}</div>
            <div style={{ fontSize: 28, fontWeight: 700, marginTop: 8 }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14, marginTop: 14 }}>
        <div style={{ border: "1px solid #e5e5e5", borderRadius: 14, padding: 14, background: "#fff" }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Bookings Trend (Demo)</div>
          <div
            style={{
              height: 220,
              borderRadius: 12,
              border: "1px dashed #cfcfcf",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#777",
            }}
          >
            Chart placeholder (we’ll add real charts next)
          </div>
        </div>

        <div style={{ border: "1px solid #e5e5e5", borderRadius: 14, padding: 14, background: "#fff" }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Latest Bookings (Demo)</div>
          <div style={{ display: "grid", gap: 10 }}>
            {[
              { name: "Sarah M.", service: "Hair Styling", time: "10:30" },
              { name: "Adam P.", service: "Massage", time: "11:15" },
              { name: "Lea K.", service: "Nails", time: "12:00" },
              { name: "Omar R.", service: "Facial", time: "13:10" },
            ].map((b) => (
              <div
                key={b.name + b.time}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  padding: 10,
                  borderRadius: 12,
                  background: "#fafafa",
                  border: "1px solid #eee",
                }}
              >
                <div>
                  <div style={{ fontWeight: 650 }}>{b.name}</div>
                  <div style={{ color: "#777", fontSize: 13 }}>{b.service}</div>
                </div>
                <div style={{ color: "#111", fontWeight: 650 }}>{b.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
