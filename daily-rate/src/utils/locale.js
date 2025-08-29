const REGION_TO_CURRENCY = {
  NG: "NGN",
  US: "USD",
  GB: "GBP",
  CA: "CAD",
  AU: "AUD",
  NZ: "NZD",
  JP: "JPY",
  CN: "CNY",
  IN: "INR",
  AE: "AED",
  SA: "SAR",
  ZA: "ZAR",
  KE: "KES",
  GH: "GHS",
  CH: "CHF",
  NO: "NOK",
  SE: "SEK",
  DK: "DKK",
};

const EU = new Set([
  "IE",
  "DE",
  "FR",
  "ES",
  "IT",
  "NL",
  "BE",
  "PT",
  "AT",
  "FI",
  "GR",
  "SK",
  "SI",
  "EE",
  "LV",
  "LT",
  "LU",
  "MT",
  "CY",
  "HR",
  "BG",
  "RO",
  "CZ",
  "HU",
  "PL",
  "DK",
  "SE",
]);

export function detectRegion() {
  try {
    const lang = navigator.language || "en-US";
    const loc = new Intl.Locale(lang);
    return loc.region || (lang.split("-")[1] ?? null);
  } catch {
    const lang = navigator.language || "en-US";
    return lang.split("-")[1] || null;
  }
}

export function defaultCurrencyForRegion(region) {
  if (!region) return "USD";
  if (EU.has(region)) return "EUR";
  return REGION_TO_CURRENCY[region] || "USD";
}

const DEFAULT_TOP = ["USD", "EUR", "GBP", "JPY", "CAD"];
const TOP_BY_REGION = {
  NG: ["USD", "EUR", "GBP", "CAD", "AED"],
  US: ["EUR", "GBP", "JPY", "CAD", "CNY"],
  GB: ["EUR", "USD", "CAD", "JPY", "AUD"],
  CA: ["USD", "EUR", "GBP", "JPY", "CNY"],
  IN: ["USD", "EUR", "GBP", "AED", "SGD"],
  AE: ["USD", "EUR", "GBP", "INR", "CAD"],
};

export function topSymbolsForRegion(region, base) {
  const list = (TOP_BY_REGION[region] || DEFAULT_TOP).filter((c) => c !== base);
  for (const c of DEFAULT_TOP) {
    if (list.length >= 5) break;
    if (!list.includes(c) && c !== base) list.push(c);
  }
  return list.slice(0, 5);
}
