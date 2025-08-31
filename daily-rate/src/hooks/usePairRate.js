import { useCallback, useEffect, useState } from "react";
import * as api from "../lib/exchangeClient";

export function usePairRate(from, to) {
  const [rate, setRate] = useState(null);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    const f = (from || "").toUpperCase();
    const t = (to || "").toUpperCase();
    if (!f || !t) return;

    setLoading(true);
    setError("");
    try {
      const { rate, date } = await api.pair(f, t);
      if (typeof rate !== "number") throw new Error("No rate");
      setRate(rate);
      setDate(date || "");
    } catch (e) {
      console.error("Pair fetch failed:", e);
      setError(`Failed to load rate for ${f} → ${t}`);
      setRate(null);
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rate, date, loading, error, refresh };
}
