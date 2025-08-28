export default function CurrencySelector({
  label = "Currency",
  value,
  onChange,
  options = [],
  disabled = false,
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-slate-700">{label}</span>
      <select
        className="rounded-lg border border-slate-300 text-gray-700 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {options.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </label>
  );
}
