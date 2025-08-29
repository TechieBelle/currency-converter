// src/hooks/useBaseRates.js
import { useCallback, useEffect, useMemo, useState } from "react";
import * as api from "../lib/exchangeClient";

export function useBaseRates(base, symbols = []) {
  const [rates, setRates] = useState({});
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // stable key for dependency array
  const symbolsKey = useMemo(
    () => (Array.isArray(symbols) && symbols.length ? symbols.join(",") : ""),
    [symbols]
  );

  const refresh = useCallback(async () => {
    if (!base || !symbolsKey) return;
    setLoading(true);
    setError("");
    try {
      const { rates: allRates, date } = await api.latest(base);
      const picked = {};
      for (const s of symbols)
        if (allRates?.[s] != null) picked[s] = allRates[s];
      setRates(picked);
      setDate(date);
    } catch {
      setError("Failed to load rates.");
    } finally {
      setLoading(false);
    }
  }, [base, symbolsKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rates, date, loading, error, refresh };
}
