import Logo from "./assets/logowhite.svg?react";
import { useState, useEffect } from "react";

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
  // All available currencies
  const {
    codes: currencies = [],
    meta = {},
    loading: symbolsLoading,
    error: symbolsError,
  } = useSymbols();

  const region = detectRegion();
  const userCurrency = defaultCurrencyForRegion(region) || "NGN";

  // Converter state 
  const [from, setFrom] = useState(userCurrency);
  const [to, setTo] = useState("EUR");
  const [amount, setAmount] = useState();   

  // Single pair rate (for the converter)
  const {
    rate: pairRate,
    date: pairDate,
    loading: pairLoading,
    error: pairError,
    refresh: refreshPair,
  } = usePairRate(from, to);

  // Panel target currencies (5 symbols)
  const [panelTargets, setPanelTargets] = useState(() =>
    topSymbolsForRegion(region, from)
  );
  useEffect(() => {
    setPanelTargets(topSymbolsForRegion(region, from));
  }, [region, from]);

  // Daily base -> targets rates (for the panel)
  const {
    rates,
    date,
    loading,
    error,
    refresh,
  } = useBaseRates(from, panelTargets);

  function handleSwap() {
    setFrom(to);
    setTo(from);
  }

  function handleConvert() {
       refreshPair();
  }

  
  const errorMsg =
    symbolsError
      ? "Failed to load currencies."
      : pairError
      ? "Failed to fetch conversion rate."
      : error
      ? "Failed to load daily rates."
      : "";

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-900 px-6 py-10 text-white md:px-12">
        <div className="mb-4">
          <Logo className="h-10 w-auto md:h-12 text-white [&_*]:fill-current [&_*]:stroke-current" />
        </div>
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
            error={errorMsg}
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
          symbols={panelTargets}
          rates={rates}
          date={date}
          loading={loading}
          error={errorMsg}
          onRefresh={refresh}
          onBaseChange={setFrom}
          onTargetsChange={setPanelTargets}
          currencies={currencies}
          meta={meta}
          amount={amount}
          onAmountChange={setAmount}
        />
      </main>

      <footer className="bg-blue-900 px-6 py-6 text-center text-blue-100 md:px-12">
        &copy; Folashade Bello {new Date().getFullYear()}
      </footer>
    </div>
  );
}
