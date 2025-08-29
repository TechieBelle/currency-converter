// src/hooks/useSymbols.js
import { useEffect, useState } from "react";
import * as api from "../lib/exchangeClient"; // uses your .env if set

export function useSymbols() {
  // Short fallback while loading
  const [codes, setCodes] = useState([
    "NGN",
    "USD",
    "EUR",
    "GBP",
    "CAD",
    "JPY",
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError("");
      try {
        // 1) Preferred: provider-aware call (EXR if key, else host)
        let list = await api.symbols(); // -> ["USD","EUR", ...]
        // 2) Safety: if provider returned too few, try host directly
        if (!Array.isArray(list) || list.length < 10) {
          const res = await fetch("https://api.exchangerate.host/symbols");
          if (!res.ok) throw new Error("host symbols failed");
          const data = await res.json();
          list = Object.keys(data?.symbols || {});
        }
        if (!cancelled && list?.length) {
          setCodes([...new Set(list)].sort());
        }
      } catch (e) {
        if (!cancelled)
          setError("Failed to load currency list (using fallback).");
        console.warn("symbols fetch failed:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return { codes, loading, error };
}
