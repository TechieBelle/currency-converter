import { useCallback, useEffect, useState } from "react";
import * as api from "../lib/exchangeClient";

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
      const { rates: allRates, date } = await api.latest(base);
      const picked = {};
      for (const s of symbols) {
        if (allRates?.[s] != null) picked[s] = allRates[s];
      }
      setRates(picked);
      setDate(date);
    } catch {
      setError("Failed to load daily rates.");
    } finally {
      setLoading(false);
    }
  }, [base, symbols]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rates, date, loading, error, refresh };
}
