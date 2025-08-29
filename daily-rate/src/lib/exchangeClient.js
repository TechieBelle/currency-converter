// src/lib/exchangeClient.js
const EXR_KEY = import.meta.env.VITE_EXR_KEY;
const EXR_BASE =
  import.meta.env.VITE_EXR_BASE || "https://v6.exchangerate-api.com/v6";
const HOST_BASE =
  import.meta.env.VITE_HOST_BASE || "https://api.exchangerate.host";

const USE_EXR = Boolean(EXR_KEY);

// Latest for a base (return { rates, date })
export async function latest(base) {
  let url;
  if (USE_EXR) {
    url = `${EXR_BASE}/${EXR_KEY}/latest/${encodeURIComponent(base)}`;
    const res = await fetch(url); // <- fetch(url) (not base)
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    return {
      rates: data?.conversion_rates || {},
      date: (data?.time_last_update_utc || "").slice(5, 16),
    };
  } else {
    url = `${HOST_BASE}/latest?base=${encodeURIComponent(base)}`;
    const res = await fetch(url); // <- fetch(url)
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    return { rates: data?.rates || {}, date: data?.date || "" };
  }
}

// Exact pair (return { rate, date })
export async function pair(base, target) {
  let url;
  if (USE_EXR) {
    url = `${EXR_BASE}/${EXR_KEY}/pair/${encodeURIComponent(
      base
    )}/${encodeURIComponent(target)}`;
    const res = await fetch(url); // <- fetch(url)
    const data = await res.json().catch(() => ({}));
    if (!res.ok || typeof data?.conversion_rate !== "number") {
      throw new Error("EXR pair error");
    }
    return {
      rate: data.conversion_rate,
      date: (data?.time_last_update_utc || "").slice(5, 16),
    };
  } else {
    url = `${HOST_BASE}/convert?from=${encodeURIComponent(
      base
    )}&to=${encodeURIComponent(target)}`;
    const res = await fetch(url); // <- fetch(url)
    if (!res.ok) throw new Error("HOST pair error");
    const data = await res.json();
    const r =
      typeof data?.info?.rate === "number"
        ? data.info.rate
        : data?.result ?? null;
    return { rate: r, date: data?.date || "" };
  }
}

// Symbols (return array of codes)
export async function symbols() {
  let url;
  if (USE_EXR) {
    url = `${EXR_BASE}/${EXR_KEY}/codes`;
    const res = await fetch(url); // <- fetch(url)
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    return Array.isArray(data?.supported_codes)
      ? data.supported_codes.map(([code]) => code)
      : [];
  } else {
    url = `${HOST_BASE}/symbols`;
    const res = await fetch(url); // <- fetch(url)
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    return Object.keys(data?.symbols || {});
  }
}
