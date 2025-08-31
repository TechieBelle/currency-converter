// src/components/LiveRatesPanel.jsx
import React, { useEffect, useMemo, useState } from "react";
import CurrencySelector from "./CurrencySelector";

export default function LiveRatesPanel({
  base,
  symbols = [], // 5 target codes to show on the right
  rates = {}, // map: target -> rate (1 base -> target)
  date = "",
  loading = false,
  error = "",
  onRefresh = () => {},
  onBaseChange = null, // (code) => void
  onTargetsChange = null, // (arr[5]) => void
  currencies = [], // all codes (for CurrencySelector)
  highlightCode = "",
  amount = "", // ✅ shared amount from App.jsx
  onAmountChange = () => {}, // ✅ update shared amount
}) {
  const SELECT_W = "w-3/4 md:w-[100px]";
  const AMOUNT_W = "w-3/4 md:w-[200px]";

  const fmt2 = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    []
  );

  // ensure 5 targets and none equals base
  const safeTargets = useMemo(() => {
    const fallback = ["USD", "EUR", "GBP", "CAD", "JPY"];
    const src = (symbols && symbols.length ? symbols : fallback).slice(0, 5);
    return src.map((c) => (c === base ? "USD" : c));
  }, [symbols, base]);

  const [localTargets, setLocalTargets] = useState(safeTargets);

  // ✅ cleaned up dependency — no ESLint underline
  useEffect(() => {
    setLocalTargets(safeTargets);
  }, [safeTargets, base]);

  function changeTarget(i, code) {
    if (!code || code === base) return;
    const next = [...localTargets];
    next[i] = code;
    setLocalTargets(next);
    onTargetsChange?.(next);
  }

  const amt = Number(String(amount).replace(/,/g, "")) || 0;

  return (
    <section
      className="
        md:rounded-2xl bg-emerald-900 text-white shadow
        w-full md:w-[calc(100vw-140px)] md:max-w-none
        md:relative md:left-1/2 md:-translate-x-1/2
        md:mt-[120px] md:mb-[100px]
        p-6 md:p-8
      "
    >
      <h2 className="text-center text-xl md:text-2xl font-semibold md:mb-12">
        Live Exchange Rates
      </h2>

      <div className="mt-5 grid gap-6 md:grid-cols-2 place-items-center md:place-items-start">
        {/* LEFT: Base currency + amount */}
        <div className="w-full">
          <label className="block text-emerald-100 text-sm mb-2">
            Base currency
          </label>

          <div className={`${SELECT_W} mx-auto md:mx-0`}>
            <CurrencySelector
              value={base}
              onChange={(c) => onBaseChange?.(c)}
              options={currencies}
              disabled={loading}
            />
          </div>

          <div className="mt-3">
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              placeholder="Enter amount"
              className={`${AMOUNT_W} block mx-auto md:mx-0 rounded-md md:text-2xl bg-white px-6 py-4 text-slate-800 text-center outline-none`}
            />
          </div>
        </div>

        {/* RIGHT: Five target rows */}
        <div className="w-full">
          <div className="text-emerald-100 text-sm mb-3 mt-4 text-center md:text-left">
            Rates
          </div>

          <div className="space-y-3">
            {localTargets.map((code, idx) => {
              const r = rates?.[code];
              const converted = Number.isFinite(r) ? r * amt : null;
              const highlight = highlightCode === code;

              return (
                <div
                  key={`${code}-${idx}`}
                  className={`flex flex-col items-center sm:flex-row sm:items-center gap-2 sm:gap-3 ${
                    highlight ? "ring-2 ring-white/60 rounded-md p-1" : ""
                  }`}
                >
                  <div className={`${SELECT_W} mx-auto sm:mx-0`}>
                    <CurrencySelector
                      value={code}
                      onChange={(c) => changeTarget(idx, c)}
                      options={currencies}
                      disabled={loading}
                    />
                  </div>

                  <output
                    className={`${AMOUNT_W} mx-auto sm:mx-0 rounded-md bg-white px-3 py-2 text-right text-slate-800`}
                  >
                    {Number.isFinite(converted)
                      ? fmt2.format(converted)
                      : "0.00"}
                  </output>
                </div>
              );
            })}

            {loading && (
              <>
                <div className="h-10 rounded-md bg-emerald-800/60 animate-pulse" />
                <div className="h-10 rounded-md bg-emerald-800/60 animate-pulse" />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 md:mt-8 flex flex-col items-center gap-2 md:flex-row md:justify-end">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="text-sm rounded bg-emerald-700 px-3 py-1.5 hover:bg-emerald-600 transition focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer md:ml-3"
        >
          Refresh
        </button>
        <p className="text-emerald-100 text-xs">Updated: {date || "—"}</p>
      </div>

      {error && (
        <p className="mt-4 text-center text-sm text-rose-200" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
