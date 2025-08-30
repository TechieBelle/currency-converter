// src/components/CurrencySelector.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function CurrencySelector({
  label,
  value,
  onChange,
  options = [], // array of codes
  meta = {}, // { CODE: { label, flag } }
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  // Normalize + sort
  const allCodes = useMemo(
    () => [...new Set(options.map((c) => (c || "").toUpperCase()))].sort(),
    [options]
  );

  // Filter by code or label
  const filtered = useMemo(() => {
    const q = query.trim().toUpperCase();
    if (!q) return allCodes;
    return allCodes.filter((c) => {
      const name = meta[c]?.label || "";
      return c.includes(q) || name.toUpperCase().includes(q);
    });
  }, [query, allCodes, meta]);

  // Close on click outside
  useEffect(() => {
    function onDoc(e) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Reset query when closing
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const displayValue = (() => {
    const m = meta[value];
    if (!m) return value || "";
    return `${m.flag || ""} ${value} ${m.label || ""}`.trim();
  })();

  function pick(code) {
    onChange(code);
    setOpen(false);
    setQuery("");
    // Do not refocus to avoid reopening
  }

  return (
    <div ref={wrapRef} className="w-full relative">
      {label && (
        <label className="mb-1 block text-sm font-medium text-slate-600">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          value={open ? query : displayValue}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          disabled={disabled}
          placeholder="Search currency"
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
            if (e.key === "Enter" && filtered.length) {
              e.preventDefault();
              pick(filtered[0]);
            }
          }}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 pr-9 py-2 text-slate-800 focus:outline-none"
        />

        {/* Chevron */}
        <button
          type="button"
          disabled={disabled}
          onMouseDown={(e) => {
            e.preventDefault();
            if (!open) setOpen(true);
            inputRef.current?.focus();
          }}
          aria-label="Open currency list"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700 disabled:opacity-50"
        >
          <ChevronDownIcon
            className={`h-4 w-4 transition-transform ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden
          />
        </button>

        {/* Dropdown panel (no Popular section) */}
        {open && !disabled && (
          <div className="absolute z-20 mt-1 w-full rounded-lg border border-slate-300 bg-white shadow-xl">
            <div className="max-h-64 overflow-auto py-1">
              {filtered.length === 0 ? (
                <div className="px-3 py-3 text-sm text-slate-500">
                  No results
                </div>
              ) : (
                filtered.map((code) => {
                  const m = meta[code] || {};
                  return (
                    <button
                      key={code}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        pick(code);
                      }} // close immediately
                      onClick={() => pick(code)} // keyboard support
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-slate-100 ${
                        code === value ? "bg-slate-50 font-semibold" : ""
                      }`}
                    >
                      <span className="text-lg">{m.flag || ""}</span>
                      <span className="text-slate-800">{code}</span>
                      <span className="text-slate-500">{m.label || ""}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
