export default function AmountInput({
  label = "Amount",
  value,
  onChange,
  placeholder = "Enter amount",
}) {
  // Helper: format number with commas
  const formatNumber = (val) => {
    if (val === "" || isNaN(val)) return "";
    const [int, dec] = val.split(".");
    const intFormatted = Number(int).toLocaleString();
    return dec !== undefined ? `${intFormatted}.${dec}` : intFormatted;
  };

  // When typing, strip commas and only allow valid numbers
  const handleChange = (e) => {
    let raw = e.target.value.replace(/,/g, ""); // remove commas
    if (raw === "" || parseFloat(raw) >= 0) {
      onChange(raw); // store raw numeric string in state
    }
  };

  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-slate-600">{label}</span>
      <input
        type="text"
        inputMode="decimal"
        className="rounded-lg border border-slate-300 bg-white text-slate-800
             placeholder-slate-400 px-3 py-2 outline-none
             focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
        value={formatNumber(value)} // show formatted version
        onChange={handleChange}
      />
    </label>
  );
}
