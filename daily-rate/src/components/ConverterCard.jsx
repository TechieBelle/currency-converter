import CurrencySelector from "./CurrencySelector";
import AmountInput from "./AmountInput";
import ConversionResult from "./ConversionResult";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";

export default function ConverterCard({
  from,
  to,
  amount,
  currencies = [],
  rate,
  date,
  loading = false,
  error = "",
  onFromChange,
  onToChange,
  onAmountChange,
  onSwap,
  onConvert,
}) {
  const amountNumber = Number(amount) || 0;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-xl md:translate-y-[96px] md:min-h-[480px]">
      {/* Top row: selectors */}
      <div className="grid grid-cols-2 gap-3">
        <CurrencySelector
          label="From"
          value={from}
          onChange={onFromChange}
          options={currencies}
          disabled={loading}
        />
        <CurrencySelector
          label="To"
          value={to}
          onChange={onToChange}
          options={currencies}
          disabled={loading}
        />
      </div>

      {/* Swap */}
      <div className="mt-5 flex items-center justify-center ">
        <button
          onClick={onSwap}
          className="rounded-full border border-slate-300 text-slate-600 px-5 py-2 text-sm
          hover:bg-blue-700 hover:text-white focus:outline-none transition-transform duration-200 ease-out hover:scale-110 cursor-pointer md:mb-3"
          title="Swap currencies"
          disabled={loading}
        >
          <ArrowsRightLeftIcon className="h-5 w-5" aria-hidden />
        </button>
      </div>

      {/* Amount + Action + Result */}
      <div className="mt-3 grid gap-3">
        <AmountInput
          label="Enter Amount"
          value={amount}
          onChange={onAmountChange}
        />

        <button
          onClick={onConvert}
          disabled={loading}
          className="rounded-lg bg-blue-700 px-4 py-2 font-medium text-white transition-transform duration-200 ease-out hover:scale-105 active:scale-95 focus:outline-none cursor-pointer md:mt-8"
          aria-label="Swap currencies"
        >
          {loading ? "Loading…" : "Convert"}
        </button>

        <ConversionResult
          amount={amountNumber}
          from={from}
          to={to}
          rate={rate}
          date={date}
        />

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
