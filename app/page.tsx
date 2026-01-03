"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/dashboard");
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) router.replace("/dashboard");
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, [router]);

  const sendLink = async () => {
    setStatus("Sending login link...");

    const redirectTo = `${window.location.origin}/auth/callback`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) setStatus("❌ " + error.message);
    else setStatus("✅ Check your email for the login link");
  };

  return (
    <main style={{ padding: 40 }}>
      <h1>Login</h1>

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email"
        style={{ padding: 10, width: 320, marginTop: 10 }}
      />

      <div style={{ marginTop: 10 }}>
        <button onClick={sendLink} style={{ padding: "10px 16px" }}>
          Send magic link
        </button>
      </div>

      <p style={{ marginTop: 10 }}>{status}</p>
    </main>
  );
}
