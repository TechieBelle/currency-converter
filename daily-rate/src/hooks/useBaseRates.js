// src/hooks/useBaseRates.js
import { useCallback, useEffect, useState } from "react";

const ENDPOINT = "https://api.exchangerate.host/latest";

export function useBaseRates(base, symbols = []) {
  const [rates, setRates] = useState({});
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!base || !symbols.length) return;
    setLoading(true);
    setError("");
    try {
      const url = `${ENDPOINT}?base=${encodeURIComponent(
        base
      )}&symbols=${symbols.join(",")}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Bad response");
      const data = await res.json();
      setRates(data?.rates || {});
      setDate(data?.date || new Date().toISOString().slice(0, 10));
    } catch {
      setError("Failed to load rates.");
    } finally {
      setLoading(false);
    }
  }, [base, symbols.join(",")]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rates, date, loading, error, refresh };
}
