const EXR_KEY = import.meta.env.VITE_EXR_KEY; // this imports just the key
const EXR_BASE =
  import.meta.env.VITE_EXR_BASE || "https://v6.exchangerate-api.com/v6";
const HOST_BASE =
  import.meta.env.VITE_HOST_BASE || "https://api.exchangerate.host";

const USE_EXR = Boolean(EXR_KEY);

// Latest rates for a base
export async function latest(base) {
  try {
    if (USE_EXR) {
      const url = `${EXR_BASE}/${EXR_KEY}/latest/${encodeURIComponent(base)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`EXR latest failed for ${base}`);
      const data = await res.json();
      return {
        rates: data?.conversion_rates || {},
        date: new Date(data?.time_last_update_unix * 1000)
          .toISOString()
          .split("T")[0],
      };
    } else {
      const url = `${HOST_BASE}/latest?base=${encodeURIComponent(base)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HOST latest failed for ${base}`);
      const data = await res.json();
      return { rates: data?.rates || {}, date: data?.date || "" };
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Exact pair
export async function pair(base, target) {
  try {
    if (USE_EXR) {
      const url = `${EXR_BASE}/${EXR_KEY}/pair/${encodeURIComponent(
        base
      )}/${encodeURIComponent(target)}`;
      const res = await fetch(url);
      const data = await res.json().catch(() => ({}));
      if (!res.ok || typeof data?.conversion_rate !== "number") {
        throw new Error(`EXR pair error for ${base} → ${target}`);
      }
      return {
        rate: data.conversion_rate,
        date: new Date(data?.time_last_update_unix * 1000)
          .toISOString()
          .split("T")[0],
      };
    } else {
      const url = `${HOST_BASE}/convert?from=${encodeURIComponent(
        base
      )}&to=${encodeURIComponent(target)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HOST pair error for ${base} → ${target}`);
      const data = await res.json();
      const r =
        typeof data?.info?.rate === "number"
          ? data.info.rate
          : data?.result ?? null;
      return { rate: r, date: data?.date || "" };
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// Symbols
export async function symbols() {
  try {
    if (USE_EXR) {
      const url = `${EXR_BASE}/${EXR_KEY}/codes`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("EXR symbols failed");
      const data = await res.json();
      return Array.isArray(data?.supported_codes)
        ? data.supported_codes.map(([code]) => code)
        : [];
    } else {
      const url = `${HOST_BASE}/symbols`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("HOST symbols failed");
      const data = await res.json();
      return Object.keys(data?.symbols || {}); // keep codes only for now
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}
