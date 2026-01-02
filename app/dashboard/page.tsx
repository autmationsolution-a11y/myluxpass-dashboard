"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

type Partner = {
  id: string;
  business_name: string | null;
};

type Service = {
  id: string;
  name: string;
  duration_minutes: number;
  price_cents: number;
  is_active: boolean;
  created_at: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [status, setStatus] = useState("Checking session...");
  const [userEmail, setUserEmail] = useState<string>("");

  const [partner, setPartner] = useState<Partner | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [newName, setNewName] = useState("VIP Beard Trim");
  const [newDuration, setNewDuration] = useState(30);
  const [newPriceCents, setNewPriceCents] = useState(4500);

  const loadData = async () => {
    setLoading(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;

    if (!session) {
      router.replace("/login");
      return;
    }

    setUserEmail(session.user.email || "");
    setStatus("✅ Logged in as: " + (session.user.email || ""));

    // get partner (must be exactly one)
    const { data: partnerRow, error: partnerErr } = await supabase
      .from("partners")
      .select("id,business_name")
      .eq("owner_id", session.user.id)
      .single();

    if (partnerErr) {
      setStatus("❌ Error loading partner: " + partnerErr.message);
      setPartner(null);
      setServices([]);
      setLoading(false);
      return;
    }

    setPartner(partnerRow);

    // get services
    const { data: serviceRows, error: servicesErr } = await supabase
      .from("services")
      .select("id,name,duration_minutes,price_cents,is_active,created_at")
      .eq("partner_id", partnerRow.id)
      .order("created_at", { ascending: false });

    if (servicesErr) {
      setStatus("❌ Error loading services: " + servicesErr.message);
      setServices([]);
      setLoading(false);
      return;
    }

    setServices(serviceRows || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createService = async () => {
    if (!partner) return;

    setStatus("Creating service...");

    const { error } = await supabase.from("services").insert({
      partner_id: partner.id,
      name: newName,
      duration_minutes: newDuration,
      price_cents: newPriceCents,
      is_active: true,
    });

    if (error) {
      setStatus("❌ Create failed: " + error.message);
      return;
    }

    setStatus("✅ Service created!");
    await loadData();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <main style={{ padding: 40, fontFamily: "system-ui" }}>
      <h1 style={{ marginBottom: 6 }}>MyLuxPass Dashboard</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Connected to Supabase — showing real data from your tables.
      </p>

      <p style={{ marginTop: 14, fontWeight: 600 }}>Status: {status}</p>

      <div style={{ marginTop: 14 }}>
        <button onClick={logout} style={{ padding: "8px 12px" }}>
          Logout
        </button>
      </div>

      <hr style={{ margin: "24px 0" }} />

      <h2 style={{ marginBottom: 8 }}>
        Partner: {partner?.business_name || "(no name)"}
      </h2>

      <h2 style={{ marginTop: 24 }}>Services</h2>

      {loading ? (
        <p>Loading...</p>
      ) : services.length === 0 ? (
        <p>No services found yet. Add services in Supabase table services.</p>
      ) : (
        <ul>
          {services.map((s) => (
            <li key={s.id} style={{ marginBottom: 6 }}>
              <strong>{s.name}</strong> — {s.duration_minutes} min — €
              {(s.price_cents / 100).toFixed(2)} —{" "}
              {s.is_active ? "Active" : "Inactive"}
            </li>
          ))}
        </ul>
      )}

      <hr style={{ margin: "24px 0" }} />

      <h2>Create New Service</h2>

      <div style={{ display: "grid", gap: 10, maxWidth: 420 }}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Service name"
          style={{ padding: 10 }}
        />
        <input
          type="number"
          value={newDuration}
          onChange={(e) => setNewDuration(parseInt(e.target.value || "0", 10))}
          placeholder="Duration minutes"
          style={{ padding: 10 }}
        />
        <input
          type="number"
          value={newPriceCents}
          onChange={(e) => setNewPriceCents(parseInt(e.target.value || "0", 10))}
          placeholder="Price cents"
          style={{ padding: 10 }}
        />

        <button onClick={createService} style={{ padding: "10px 16px" }}>
          Create Service
        </button>
      </div>
    </main>
  );
}
