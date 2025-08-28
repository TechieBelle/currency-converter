export default function ConversionResult({ amount, from, to, rate, date }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 md:mt-10">
      <p className="text-slate-700">
        <span className="font-medium">{amount.toLocaleString()}</span> {from} ={" "}
        <span className="font-semibold text-slate-900">
          {rate ? (amount * rate).toLocaleString() : "—"}
        </span>{" "}
        {to}
      </p>
      <p className="mt-1 text-xs text-slate-500">
        Rate: 1 {from} = {rate ? rate.toLocaleString() : "—"} {to}
        {date ? ` • Updated: ${date}` : ""}
      </p>
    </div>
  );
}