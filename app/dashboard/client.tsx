"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Service = {
  id: string;
  name: string;
  duration_minutes: number;
  price_cents: number;
  is_active: boolean;
};

export default function DashboardClient() {
  const [status, setStatus] = useState("Loading...");
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        setStatus("Checking session...");

        // 1) Check session first (fast)
        const { data: sessionData, error: sessionErr } =
          await supabase.auth.getSession();

        if (sessionErr) {
          setStatus("❌ Session error: " + sessionErr.message);
          return;
        }

        const session = sessionData.session;

        // If no session, we are not logged in
        if (!session?.user) {
          setStatus("❌ Not logged in (no session). Go to /login.");
          return;
        }

        const userId = session.user.id;

        setStatus("Finding your partner profile...");

        // 2) Find partner by owner_id = current user id
        const { data: partner, error: partnerErr } = await supabase
          .from("partners")
          .select("id")
          .eq("owner_id", userId)
          .maybeSingle();

        if (partnerErr) {
          setStatus("❌ Error loading partner: " + partnerErr.message);
          return;
        }

        if (!partner?.id) {
          setStatus(
            "⚠️ No partner record found for this user. Create a row in partners with owner_id = your user id."
          );
          return;
        }

        setPartnerId(partner.id);

        setStatus("Loading services...");

        const { data: svc, error: svcErr } = await supabase
          .from("services")
          .select("id,name,duration_minutes,price_cents,is_active,created_at")
          .eq("partner_id", partner.id)
          .order("created_at", { ascending: false });

        if (svcErr) {
          setStatus("❌ Error loading services: " + svcErr.message);
          return;
        }

        setServices((svc ?? []) as Service[]);
        setStatus("✅ Loaded services");
      } catch (e: any) {
        setStatus("❌ Unexpected error: " + (e?.message || String(e)));
      }
    };

    run();
  }, []);

  return (
    <div style={{ marginTop: 16 }}>
      <p>
        <b>Status:</b> {status}
      </p>

      {partnerId && (
        <p style={{ opacity: 0.8 }}>
          <b>Partner ID:</b> {partnerId}
        </p>
      )}

      <h2 style={{ marginTop: 20, fontSize: 20, fontWeight: 700 }}>
        Services
      </h2>

      {services.length === 0 ? (
        <p style={{ marginTop: 10 }}>
          No services found yet. Add services in Supabase table <b>services</b>.
        </p>
      ) : (
        <div style={{ marginTop: 10 }}>
          {services.map((s) => (
            <div
              key={s.id}
              style={{
                padding: 12,
                border: "1px solid #ddd",
                borderRadius: 10,
                marginBottom: 10,
              }}
            >
              <div style={{ fontWeight: 700 }}>{s.name}</div>
              <div style={{ opacity: 0.9 }}>
                Duration: {s.duration_minutes} min
              </div>
              <div style={{ opacity: 0.9 }}>
                Price: €{(s.price_cents / 100).toFixed(2)}
              </div>
              <div style={{ opacity: 0.9 }}>
                Active: {s.is_active ? "Yes" : "No"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
