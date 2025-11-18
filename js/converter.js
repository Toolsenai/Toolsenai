// Kategorien & Umrechnungsfaktoren
const categories = {
  "Länge": {
    "Meter": 1,
    "Kilometer": 1000,
    "Zentimeter": 0.01,
    "Millimeter": 0.001,
    "Meilen": 1609.34,
    "Fuß": 0.3048
  },
  "Gewicht": {
    "Kilogramm": 1,
    "Gramm": 0.001,
    "Pfund": 0.453592,
    "Unze": 0.0283495
  },
  "Volumen": {
    "Liter": 1,
    "Milliliter": 0.001,
    "Gallonen": 3.78541,
    "Kubikmeter": 1000
  },
  "Temperatur": {
    "Celsius": "C",
    "Fahrenheit": "F",
    "Kelvin": "K"
  }
  // andere Kategorien können später ergänzt werden
};

// Kurzzeichen für Anzeige
const unitSymbols = {
  "Meter": "m",
  "Kilometer": "km",
  "Zentimeter": "cm",
  "Millimeter": "mm",
  "Meilen": "mi",
  "Fuß": "ft",
  "Kilogramm": "kg",
  "Gramm": "g",
  "Pfund": "lb",
  "Unze": "oz",
  "Liter": "l",
  "Milliliter": "ml",
  "Gallonen": "gal",
  "Kubikmeter": "m³",
  "Celsius": "°C",
  "Fahrenheit": "°F",
  "Kelvin": "K"
};

// Referenzen
const categorySelect = document.getElementById("category");
const fromSelect = document.getElementById("fromUnit");
const toSelect = document.getElementById("toUnit");
const valueInput = document.getElementById("value");
const resultDiv = document.getElementById("result");
const languageSelect = document.getElementById("language");

// Kategorien füllen
function updateUI() {
  categorySelect.innerHTML = "";
  for (let cat in categories) {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  }
  updateUnits();
}

// Einheiten für Kategorie füllen
function updateUnits() {
  const cat = categorySelect.value;
  const units = Object.keys(categories[cat]);
  fromSelect.innerHTML = "";
  toSelect.innerHTML = "";
  units.forEach(u => {
    const opt1 = document.createElement("option");
    opt1.value = u;
    opt1.textContent = u;
    fromSelect.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = u;
    opt2.textContent = u;
    toSelect.appendChild(opt2);
  });
}

// Umrechnen
function convertAll() {
  const cat = categorySelect.value;
  const from = fromSelect.value;
  const to = toSelect.value;
  const val = parseFloat(valueInput.value);
  if (isNaN(val)) {
    resultDiv.textContent = languageSelect.value === "de" ? "Bitte einen gültigen Wert eingeben" : "Please enter a valid number";
    return;
  }

  let result;
  let formula = "";

  if (cat === "Temperatur") {
    // Temperatur-Umrechnungen wie vorher
    if (from === "Celsius" && to === "Fahrenheit") {
      result = val * 9/5 + 32;
      formula = `${val} °C × 9/5 + 32 = ${result} °F`;
    } else if (from === "Fahrenheit" && to === "Celsius") {
      result = (val - 32) * 5/9;
      formula = `(${val} °F - 32) × 5/9 = ${result} °C`;
    } else if (from === "Celsius" && to === "Kelvin") {
      result = val + 273.15;
      formula = `${val} °C + 273.15 = ${result} K`;
    } else if (from === "Kelvin" && to === "Celsius") {
      result = val - 273.15;
      formula = `${val} K - 273.15 = ${result} °C`;
    } else {
      result = val;
      formula = `${val} ${from} → ${to}`;
    }
  } else {
    const factorFrom = categories[cat][from];
    const factorTo = categories[cat][to];

    result = val * factorFrom / factorTo;

    // Formel im Lehrbuchstil
    formula = `${val} ${from} ÷ ${factorTo/factorFrom} = ${result} ${to}`;
  }

  // Ergebnis mit Kurzzeichen anzeigen
  const fromSymbol = unitSymbols[from] || from;
  const toSymbol = unitSymbols[to] || to;
  resultDiv.innerHTML = `${result} ${toSymbol} <br><small>Formel: ${formula}</small>`;
}

// Initialisierung
window.onload = () => {
  updateUI();
};
