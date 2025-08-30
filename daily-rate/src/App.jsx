// src/App.jsx
import { useState, useMemo, useEffect } from "react";
import ConverterCard from "./components/ConverterCard";
import LiveRatesPanel from "./components/LiveRatesPanel";
import { useSymbols } from "./hooks/useSymbols";
import { useBaseRates } from "./hooks/useBaseRates";
import { usePairRate } from "./hooks/usePairRate";
import {
  detectRegion,
  defaultCurrencyForRegion,
  topSymbolsForRegion,
} from "./utils/locale";

export default function App() {
  // full list + labels/flags for dropdowns
  const {
    codes: currencies,
    meta,
    loading: symbolsLoading,
    error: symbolsError,
  } = useSymbols();

  const region = detectRegion();
  const userCurrency = defaultCurrencyForRegion(region);

  // converter state
  const [from, setFrom] = useState(userCurrency || "NGN");
  const [to, setTo] = useState("EUR");
  const [amount, setAmount] = useState("1500");

  // live pair rate
  const {
    rate: pairRate,
    date: pairDate,
    loading: pairLoading,
    error: pairError,
    refresh: refreshPair,
  } = usePairRate(from, to);

  // ✅ keep 5 editable targets for the panel
  const [panelTargets, setPanelTargets] = useState(() => topSymbolsForRegion(region, from));
 const popularList = useMemo(() => topSymbolsForRegion(region, from), [region, from]);

  // when region/base changes, refresh the defaults
  useEffect(() => {
    setPanelTargets(topSymbolsForRegion(region, from));
  }, [region, from]);

  // daily base->targets rates
  const { rates, date, loading, error, refresh } = useBaseRates(
    from,
    panelTargets
  );

  function handleSwap() {
    setFrom(to);
    setTo(from);
  }

  function handleConvert() {
    refreshPair();
  }

  return (
    <div className="min-h-screen flex flex-col">
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

          <ConverterCard
            from={from}
            to={to}
            amount={amount}
            currencies={currencies}
            meta={meta}
            rate={pairRate}
            date={pairDate}
            loading={pairLoading || symbolsLoading}
            error={pairError || symbolsError || ""}
            onFromChange={setFrom}
            onToChange={setTo}
            onAmountChange={setAmount}
            onSwap={handleSwap}
            onConvert={handleConvert}
          />
        </div>
      </header>
      <main className="flex-1">
        <LiveRatesPanel
          base={from}
          symbols={panelTargets} // ✅ the 5 targets
          rates={rates}
          date={date}
          loading={loading}
          error={error}
          onRefresh={refresh}
          onBaseChange={setFrom} // ✅ base dropdown handler
          onTargetsChange={setPanelTargets} // ✅ per-row dropdown handler
          currencies={currencies} // ✅ options for dropdowns
          meta={meta} // ✅ labels + flags
        />
      </main>
      <footer className="bg-blue-900 px-6 py-6 text-center text-blue-100 md:px-12">
        &copy; Folashade {new Date().getFullYear()}
      </footer>
    </div>
  );
}
