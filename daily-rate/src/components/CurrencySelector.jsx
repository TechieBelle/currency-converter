import { useEffect, useMemo, useRef, useState } from "react";

export default function CurrencySelector({
  label,
  value,
  onChange,
  options = [],
  popular = [], // <- optional list to feature at the top
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  // Normalize + de-dup
  const allCodes = useMemo(
    () => [...new Set(options.map((c) => (c || "").toUpperCase()))].sort(),
    [options]
  );
  const popularSet = useMemo(() => {
    const norm = popular.map((c) => (c || "").toUpperCase());
    return new Set(norm.filter((c) => allCodes.includes(c)));
  }, [popular, allCodes]);

  // Filtered list (by query)
  const filtered = useMemo(() => {
    const q = query.trim().toUpperCase();
    if (!q) return allCodes;
    return allCodes.filter((c) => c.includes(q));
  }, [query, allCodes]);

  // Click outside -> close
  useEffect(() => {
    function onDoc(e) {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Keep query synced with current value when closed
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  function pick(code) {
    onChange(code);
    setOpen(false);
    // focus back to input for accessibility
    inputRef.current?.focus();
  }

  return (
    <div ref={wrapRef} className="w-full relative">
      {label && (
        <label className="mb-1 block text-sm font-medium text-slate-600">
          {label}
        </label>
      )}

      {/* Trigger / input (keeps your form styles) */}
      <div className="relative">
        <input
          ref={inputRef}
          value={open ? query : value}
          onChange={(e) => setQuery(e.target.value.toUpperCase())}
          onFocus={() => setOpen(true)}
          disabled={disabled}
          placeholder="Search (e.g. USD)"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-none"
        />

        {/* Dropdown panel */}
        {open && !disabled && (
          <div
            className="absolute z-20 mt-1 w-full rounded-lg border border-slate-300 bg-white shadow-xl"
            role="listbox"
          >
            {/* Popular group (only when no query and there are items) */}
            {!query && popularSet.size > 0 && (
              <div className="max-h-56 overflow-auto py-1">
                <div className="px-3 py-1 text-xs font-semibold text-slate-500">
                  Popular
                </div>
                {Array.from(popularSet).map((code) => (
                  <button
                    key={`pop-${code}`}
                    onClick={() => pick(code)}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left hover:bg-slate-100 ${
                      code === value ? "bg-slate-50 font-semibold" : ""
                    }`}
                    type="button"
                  >
                    <span className="text-slate-800">{code}</span>
                    {code === value && (
                      <span className="text-xs text-blue-600">selected</span>
                    )}
                  </button>
                ))}
                <div className="my-1 border-t border-slate-200" />
              </div>
            )}

            {/* All currencies (filtered) */}
            <div className="max-h-64 overflow-auto py-1">
              {filtered.length === 0 ? (
                <div className="px-3 py-3 text-sm text-slate-500">
                  No results
                </div>
              ) : (
                filtered.map((code) => (
                  <button
                    key={code}
                    onClick={() => pick(code)}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left hover:bg-slate-100 ${
                      code === value ? "bg-slate-50 font-semibold" : ""
                    }`}
                    type="button"
                  >
                    <span className="text-slate-800">{code}</span>
                    {code === value && (
                      <span className="text-xs text-blue-600">selected</span>
                    )}
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
