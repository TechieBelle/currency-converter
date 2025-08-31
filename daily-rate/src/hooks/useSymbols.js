import { useEffect, useState } from "react";
import * as api from "../lib/exchangeClient";

export function useSymbols() {
  const [codes, setCodes] = useState(["USD", "EUR", "GBP", "NGN", "JPY"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError("");
      try {
        let list = await api.symbols();
        if (!Array.isArray(list) || list.length < 10) {
          const res = await fetch("https://api.exchangerate.host/symbols");
          if (!res.ok) throw new Error("host symbols failed");
          const data = await res.json();
          list = Object.keys(data?.symbols || {});
        }
        if (!cancelled && list?.length) {
          setCodes([...new Set(list)].sort());
        }
      } catch {
        if (!cancelled) setError("Failed to load currencies.");
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
