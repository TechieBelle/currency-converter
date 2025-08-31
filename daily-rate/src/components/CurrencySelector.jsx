import { useEffect, useMemo, useRef, useState, useId } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function CurrencySelector({
  label,
  value,
  onChange,
  options = [], // e.g. ["USD","EUR","NGN"]
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef(null);
  const inputRef = useRef(null);
  const id = useId();

  // Unique, sorted codes
  const allCodes = useMemo(
    () => [...new Set(options.map((c) => (c || "").toUpperCase()))].sort(),
    [options]
  );

  // Filter list
  const filtered = useMemo(() => {
    const q = query.trim().toUpperCase();
    if (!q) return allCodes;
    return allCodes.filter((c) => c.includes(q));
  }, [query, allCodes]);

  // Close on outside click
  useEffect(() => {
    function onDoc(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Reset query when closing
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  function pick(code) {
    onChange(code);
    setOpen(false);
    setQuery("");
  }

  const displayValue = value || "";

  return (
    <div ref={wrapRef} className="w-full relative">
      {label && (
        <label
          htmlFor={id}
          className="mb-1 block text-sm font-medium text-slate-600"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {/* Searchable input */}
        <input
          id={id}
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
          onClick={() => {
            setOpen((o) => !o);
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

        {/* Dropdown */}
        {open && !disabled && (
          <div className="absolute z-20 mt-1 w-full rounded-lg border border-slate-300 bg-white shadow-xl">
            <div className="max-h-64 overflow-auto py-1">
              {filtered.length === 0 ? (
                <div className="px-3 py-3 text-sm text-slate-500">
                  No results
                </div>
              ) : (
                filtered.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => pick(code)}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-slate-100 ${
                      code === value ? "bg-slate-50 font-semibold" : ""
                    }`}
                  >
                    <span className="text-slate-800">{code}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
