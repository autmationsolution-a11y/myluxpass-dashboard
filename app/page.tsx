'use client';

import { supabase } from './lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function Home() {
  const [status, setStatus] = useState('Checking Supabase connection...');

  useEffect(() => {
    const check = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) setStatus('❌ Supabase error');
      else setStatus('✅ Supabase connected');
    };
    check();
  }, []);

  return (
    <main style={{ padding: 40, fontSize: 20 }}>
      {status}
    </main>
  );
}
