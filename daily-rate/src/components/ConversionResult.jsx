export default function ConversionResult({ amount, from, to, rate, date }) {
  const valid =
    Number.isFinite(amount) &&
    amount > 0 &&
    typeof rate === "number" &&
    !isNaN(rate);

  const fmt = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const fmtRate = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  });

  return (
    <div
      className="rounded-lg border border-slate-200 bg-slate-50 p-4 md:mt-10"
      aria-live="polite"
    >
      {!valid ? (
        <p className="text-slate-500 text-sm">
          Enter a valid amount to convert.
        </p>
      ) : (
        <>
          <p className="text-slate-700">
            <span className="font-medium">{fmt.format(amount)}</span> {from} ={" "}
            <span className="font-semibold text-slate-900">
              {fmt.format(amount * rate)}
            </span>{" "}
            {to}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Rate: 1 {from} = {fmtRate.format(rate)} {to}
            {date ? ` • Updated: ${date}` : ""}
          </p>
        </>
      )}
    </div>
  );
}
