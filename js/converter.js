// converter.js
// Grundumrechnungen für ToolsenAI

// Alle Conversion-Funktionen
const conversions = {
  length: {
    label: { de: "Länge", en: "Length" },
    units: {
      meter: { de: "Meter", en: "Meter", factor: 1 },
      kilometer: { de: "Kilometer", en: "Kilometer", factor: 1000 },
      centimeter: { de: "Zentimeter", en: "Centimeter", factor: 0.01 },
      millimeter: { de: "Millimeter", en: "Millimeter", factor: 0.001 },
      mile: { de: "Meile", en: "Mile", factor: 1609.34 },
      yard: { de: "Yard", en: "Yard", factor: 0.9144 },
      foot: { de: "Fuß", en: "Foot", factor: 0.3048 },
      inch: { de: "Zoll", en: "Inch", factor: 0.0254 }
    }
  },
  weight: {
    label: { de: "Gewicht", en: "Weight" },
    units: {
      kilogram: { de: "Kilogramm", en: "Kilogram", factor: 1 },
      gram: { de: "Gramm", en: "Gram", factor: 0.001 },
      milligram: { de: "Milligramm", en: "Milligram", factor: 0.000001 },
      pound: { de: "Pfund", en: "Pound", factor: 0.453592 },
      ounce: { de: "Unze", en: "Ounce", factor: 0.0283495 }
    }
  },
  volume: {
    label: { de: "Volumen", en: "Volume" },
    units: {
      liter: { de: "Liter", en: "Liter", factor: 1 },
      milliliter: { de: "Milliliter", en: "Milliliter", factor: 0.001 },
      cubicMeter: { de: "Kubikmeter", en: "Cubic meter", factor: 1000 },
      gallon: { de: "Gallone", en: "Gallon", factor: 3.78541 },
      pint: { de: "Pint", en: "Pint", factor: 0.473176 }
    }
  },
  temperature: {
    label: { de: "Temperatur", en: "Temperature" },
    units: {
      celsius: { de: "Celsius", en: "Celsius" },
      fahrenheit: { de: "Fahrenheit", en: "Fahrenheit" },
      kelvin: { de: "Kelvin", en: "Kelvin" }
    }
  }
};

// Umrechnen-Funktion
function convert() {
  const cat = document.getElementById("category").value;
  const from = document.getElementById("fromUnit").value;
  const to = document.getElementById("toUnit").value;
  const val = parseFloat(document.getElementById("value").value);
  const resultDiv = document.getElementById("result");

  if (!cat || !from || !to || isNaN(val)) {
    resultDiv.innerText = labels[lang].error;
    return;
  }

  let res, formula;

  if (cat === "temperature") {
    // Temperatur gesondert behandeln
    if (from === "celsius") {
      if (to === "fahrenheit") { res = val * 9/5 + 32; formula = "°F = °C × 9/5 + 32"; }
      else if (to === "kelvin") { res = val + 273.15; formula = "K = °C + 273.15"; }
      else { res = val; formula = "°C = °C"; }
    } else if (from === "fahrenheit") {
      if (to === "celsius") { res = (val - 32) * 5/9; formula = "°C = (°F - 32) × 5/9"; }
      else if (to === "kelvin") { res = (val - 32) * 5/9 + 273.15; formula = "K = (°F - 32) × 5/9 + 273.15"; }
      else { res = val; formula = "°F = °F"; }
    } else if (from === "kelvin") {
      if (to === "celsius") { res = val - 273.15; formula = "°C = K - 273.15"; }
      else if (to === "fahrenheit") { res = (val - 273.15) * 9/5 + 32; formula = "°F = (K - 273.15) × 9/5 + 32"; }
      else { res = val; formula = "K = K"; }
    }
  } else {
    const fromFactor = conversions[cat].units[from].factor;
    const toFactor = conversions[cat].units[to].factor;
    res = val * fromFactor / toFactor;
    formula = `${val} × ${fromFactor} ÷ ${toFactor} = ${res}`;
  }

  resultDiv.innerText = `${res} (${formula})`;
}
