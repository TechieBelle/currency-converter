import ConverterCard from "./components/ConverterCard";
import LiveRatesPanel from "./components/LiveRatesPanel";
import { useSymbols } from "./hooks/useSymbols";
import { useState, useMemo } from "react";
import { useBaseRates } from "./hooks/useBaseRates";
import { usePairRate } from "./hooks/usePairRate";
import {
  detectRegion,
  defaultCurrencyForRegion,
  topSymbolsForRegion,
} from "./utils/locale";

export default function App() {
  const { codes: currencies } = useSymbols();
  const region = detectRegion();
  const userCurrency = defaultCurrencyForRegion(region);
console.log("currencies length =", currencies.length, currencies.slice(0, 12));

  // Converter state (UI remains the same)
  const [from, setFrom] = useState(userCurrency || "NGN");
  const [to, setTo] = useState("EUR");
  const [amount, setAmount] = useState("");

  // --- LIVE rate for the converter pair (1 {from} -> {to}) ---
  const {
    rate: pairRate,
    date: pairDate,
    loading: pairLoading,
    error: pairError,
    refresh: refreshPair,
  } = usePairRate(from, to);

  // --- LIVE daily panel: top 5 for user's region (exclude current base) ---
  const symbols = useMemo(
    () => topSymbolsForRegion(region, from),
    [region, from]
  );
  const { rates, date, loading, error, refresh } = useBaseRates(from, symbols);

  // Handlers
  function handleSwap() {
    const prevFrom = from;
    const prevTo = to;
    setFrom(prevTo);
    setTo(prevFrom);
  }

  function handleConvert() {
    // Manual refresh (auto-refresh already happens when from/to change)
    refreshPair();
  }

  return (
    <div className="min-h-full">
      {/* HERO */}
      <header className="bg-blue-900 px-6 py-10 text-white md:px-12">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div>
            <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
              Real-time currency conversion at your fingertips
            </h1>
            <p className="mt-3 text-blue-100">
              Convert over 150 currencies instantly with live, accurate rates.
            </p>
          </div>

          {/* Converter Card (LIVE pair rate) */}
          <ConverterCard
            from={from}
            to={to}
            amount={amount}
            currencies={currencies}
            rate={pairRate} // live
            date={pairDate} // last updated
            loading={pairLoading}
            error={pairError || ""}
            onFromChange={setFrom}
            onToChange={setTo}
            onAmountChange={setAmount}
            onSwap={handleSwap}
            onConvert={handleConvert}
          />
        </div>
      </header>

      {/* Live, location-aware daily panel (styles live inside the component) */}
      <LiveRatesPanel
        base={from}
        symbols={symbols}
        rates={rates}
        date={date}
        loading={loading}
        error={error}
        onRefresh={refresh}
        // Highlight user's local row (or first symbol if base equals local)
        highlightCode={userCurrency !== from ? userCurrency : symbols[0]}
      />

      <footer className="bg-blue-900 px-6 py-6 text-center text-blue-100 md:px-12">
        © Folashade {new Date().getFullYear()}
      </footer>
    </div>
  );
}
