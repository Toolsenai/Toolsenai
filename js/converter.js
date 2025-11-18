// Kategorien und Einheiten + Umrechnungsfaktoren
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
    "Gallonen": 3.78541
  },
  "Temperatur": {
    "Celsius": "C",
    "Fahrenheit": "F",
    "Kelvin": "K"
  },
  "Datenmenge": {
    "Bit": 1,
    "Byte": 8,
    "Kilobyte": 8*1024,
    "Megabyte": 8*1024*1024,
    "Gigabyte": 8*1024*1024*1024
  }
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

// Einheiten für die gewählte Kategorie füllen
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

// Umrechnung durchführen
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
    // Temperatur-Umrechnung mit lesbarer Formel
    if (from === "Celsius" && to === "Fahrenheit") {
      result = val * 9/5 + 32;
      formula = "F = C × 9/5 + 32";
    } else if (from === "Fahrenheit" && to === "Celsius") {
      result = (val - 32) * 5/9;
      formula = "C = (F - 32) × 5/9";
    } else if (from === "Celsius" && to === "Kelvin") {
      result = val + 273.15;
      formula = "K = C + 273.15";
    } else if (from === "Kelvin" && to === "Celsius") {
      result = val - 273.15;
      formula = "C = K - 273.15";
    } else if (from === "Fahrenheit" && to === "Kelvin") {
      result = (val - 32) * 5/9 + 273.15;
      formula = "K = (F - 32) × 5/9 + 273.15";
    } else if (from === "Kelvin" && to === "Fahrenheit") {
      result = (val - 273.15) * 9/5 + 32;
      formula = "F = (K - 273.15) × 9/5 + 32";
    } else {
      result = val;
      formula = `${from} → ${to}`;
    }
  } else {
    // Andere Kategorien mit lesbarer Division
    const factorFrom = categories[cat][from];
    const factorTo = categories[cat][to];

    result = val * factorFrom / factorTo;

    if (factorFrom === factorTo) {
      formula = `${val} ${from} → ${to}`;
    } else if (factorFrom > factorTo) {
      const div = factorFrom / factorTo;
      formula = `${val} ${from} ÷ ${div} = ${result} ${to}`;
    } else {
      const div = factorTo / factorFrom;
      formula = `${val} ${from} ÷ ${div} = ${result} ${to}`;
    }
  }

  resultDiv.innerHTML = `${result} ${to} <br><small>Formel: ${formula}</small>`;
}

// Sprache umschalten
function updateLanguage() {
  // Später: Interface-Texte DE/EN
}

// Initialisierung
window.onload = () => {
  updateUI();
  languageSelect.addEventListener("change", updateLanguage);
};
