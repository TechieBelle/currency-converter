export default function AmountInput({ label = "Amount", value, onChange }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-slate-600">{label}</span>
      <input
        type="number"
        inputMode="decimal"
          className="rounded-lg border border-slate-300 bg-white text-slate-800
             placeholder-slate-400 px-3 py-2 outline-none
             focus:ring-2 focus:ring-blue-500"
        placeholder="Enter amount"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min="0"
      />
    </label>
  );
}
