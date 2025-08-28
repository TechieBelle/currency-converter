// src/components/LiveRatesPanel.jsx
export default function LiveRatesPanel({
  base,
  symbols = [],
  rates = {},
  date = "",
  loading = false,
  error = "",
  onRefresh,
  highlightCode,
}) {
  const fmt = (n) => (Number.isFinite(n) ? n.toLocaleString() : "—");
  const highlight = highlightCode ? rates?.[highlightCode] : null;

  return (
    <section
      className="
        rounded-2xl bg-emerald-900 p-6 text-white shadow
        w-full
        md:w-[calc(100vw-40px)] md:max-w-none
        md:relative md:left-1/2 md:-translate-x-1/2
        my-[80px]
      "
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Daily Rates</h2>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="text-xs rounded bg-emerald-700 px-2 py-1 hover:bg-emerald-600 transition focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            Refresh
          </button>
        )}
      </div>

      <p className="mt-1 text-emerald-100 text-sm">Updated: {date || "—"}</p>

      {highlightCode && (
        <div className="mt-4 rounded-lg bg-emerald-800/60 p-4">
          <p className="text-base">
            <span className="font-medium">1 {base}</span> ={" "}
            <span className="font-semibold">{fmt(highlight)}</span>{" "}
            {highlightCode}
          </p>
        </div>
      )}

      <ul className="mt-4 space-y-2">
        {symbols.map((code) => (
          <li
            key={code}
            className="flex items-center justify-between rounded-lg bg-emerald-800 px-4 py-2"
          >
            <span className="text-emerald-100">
              1 {base} → {code}
            </span>
            <span className="font-semibold">{fmt(rates?.[code])}</span>
          </li>
        ))}
      </ul>

      {loading && <p className="mt-3 text-emerald-200 text-sm">Loading…</p>}
      {error && (
        <p className="mt-3 text-rose-200 text-sm" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
