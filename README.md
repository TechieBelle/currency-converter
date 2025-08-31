#  Currency Converter

A responsive **Currency Converter web application built with **React** and **Tailwind CSS**.  
It allows users to convert between currencies in real time using data from public APIs, with a clean and modern UI design inspired by Figma.  

This project was developed as a **Frontend Capstone Project** to practice integrating external APIs, handling user input, managing state, and deploying applications.

---

##  Features

-  **Currency Conversion**: Select two currencies (From / To) and instantly convert amounts.
-  **Live Exchange Rates**: Fetches real-time exchange rates from [ExchangeRate-API](https://www.exchangerate-api.com/) or [Exchangerate.host](https://exchangerate.host/).
-  **Daily Rates Panel**: Displays conversion from a base currency into 5 other currencies of choice.
-  **Searchable Dropdowns**: Currency selectors with search functionality for over 150 currencies.
-  **Error Handling**: Friendly messages for invalid amounts, network issues, or API errors.
-  **Responsive Design**: Optimized for mobile, tablet, and desktop with Tailwind CSS.
-  **Accessible**: Keyboard navigation and proper label associations for inputs.

---

##  Tech Stack    

- [React](https://react.dev/) (with Vite bundler)
- [Tailwind CSS](https://tailwindcss.com/)
- [Heroicons](https://heroicons.com/) for icons
- Public APIs:
  - [ExchangeRate-API](https://www.exchangerate-api.com/) (with API key)
  - [Exchangerate.host](https://exchangerate.host/) (fallback)

---

##  Project Structure
src/
├── components/
│ ├── AmountInput.jsx
│ ├── ConversionResult.jsx
│ ├── ConverterCard.jsx
│ ├── CurrencySelector.jsx
│ └── LiveRatesPanel.jsx
├── hooks/
│ ├── useBaseRates.js
│ ├── usePairRate.js
│ └── useSymbols.js
├── lib/
│ └── exchangeClient.js
├── App.jsx
└── main.jsx



- **components/** → Reusable UI building blocks  
- **hooks/** → Custom React hooks for API integration and state management  
- **lib/** → API client utilities  

---

##  Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/currency-converter.git
cd currency-converter

2. Install dependencies
npm install

3. Configure environment variables

Create a .env file in the project root:

VITE_EXR_BASE=https://v6.exchangerate-api.com/v6
VITE_EXR_KEY=your_api_key_here
VITE_HOST_BASE=https://api.exchangerate.host


Make sure VITE_EXR_KEY is just the API key, not a full URL.

4. Run the development server
npm run dev

5. Build for production
npm run build

Deployment

The app can be deployed easily on Netlify
 or Vercel
.

Example deployment steps for Vercel:

Push your repo to GitHub.

Import it into Vercel.

Add your .env variables in the Vercel project settings.

Deploy!

 Usage

    Choose a base currency and enter an amount.

    Select a target currency to see the converted amount.

    Use the Live Rates Panel to compare the base against 5 other currencies at once.

    Refresh rates at any time for the latest data.


 Development Notes

    State management is handled with useState, useEffect, and custom hooks.

    Components are modular and reusable across the app.

    API client (exchangeClient.js) abstracts provider differences.

    Error handling and validation ensure the app doesn’t break with invalid input.


Future Improvements

     Historical exchange rate charts

     Save favorite currency pairs

     Alerts for exchange rate thresholds

     Dark mode


👩🏽‍💻 Author

Folashade Bello
Software Engineering Student & Frontend Developer
