import { useState, useMemo } from "react";
import LiveRatesPanel from "./components/LiveRatesPanel";
import { useBaseRates } from "./hooks/useBaseRates";
import {
  detectRegion,
  defaultCurrencyForRegion,
  topSymbolsForRegion,
} from "./utils/locale";
import ConverterCard from "./components/ConverterCard";

// You can keep this list for the selects
const currencies = ["NGN", "USD", "EUR", "GBP", "CAD", "JPY"];

export default function App() {
  // 1) Default "From" to user location currency (e.g., "NG" -> "NGN")
  const region = detectRegion();
  const userCurrency = defaultCurrencyForRegion(region);

  // UI state (your styles/layout unchanged)
  const [from, setFrom] = useState(userCurrency || "NGN");
  const [to, setTo] = useState("EUR");
  const [amount, setAmount] = useState("1500");

  // 2) --- Live rate for the converter pair (1 {from} -> {to}) ---
  // Reuse the hook, but ask only for the current "to" symbol.
  const {
    rates: pairRates,
    date: pairDate,
    loading: pairLoading,
    error: pairError,
    refresh: refreshPair,
  } = useBaseRates(from, [to]);

  // The actual pair rate the card needs:
  const pairRate = pairRates?.[to] ?? null;

  // 3) --- LiveRatesPanel: top 5 symbols for the region (exclude base) ---
  const symbols = useMemo(
    () => topSymbolsForRegion(region, from),
    [region, from]
  );

  const { rates, date, loading, error, refresh } = useBaseRates(from, symbols);

  // Handlers for the Converter Card
  function handleSwap() {
    setFrom(to);
    setTo(from);
  }

  // Optional "Convert" button triggers a refresh for the current pair.
  function handleConvert() {
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

          {/* Converter Card (now uses LIVE rates for the pair) */}
          <ConverterCard
            from={from}
            to={to}
            amount={amount}
            currencies={currencies}
            rate={pairRate} // ← live pair rate
            date={pairDate} // ← API updated date
            loading={pairLoading} // ← disable UI while fetching
            error={pairError || ""} // ← show any API error
            onFromChange={setFrom}
            onToChange={setTo}
            onAmountChange={setAmount}
            onSwap={handleSwap}
            onConvert={handleConvert} // ← refresh on click (also auto-refreshes when from/to change)
          />
        </div>
      </header>

      {/* Live, location-aware daily panel (your styles preserved inside component) */}
      <LiveRatesPanel
        base={from}
        symbols={symbols}
        rates={rates}
        date={date}
        loading={loading}
        error={error}
        onRefresh={refresh}
        // Highlight your local currency row (or the first symbol if base equals local)
        highlightCode={userCurrency !== from ? userCurrency : symbols[0]}
      />

      <footer className="bg-blue-900 px-6 py-6 text-center text-blue-100 md:px-12">
        © Folashade {new Date().getFullYear()}
      </footer>
    </div>
  );
}
