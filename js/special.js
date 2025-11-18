// special.js
// Spezial-Einheiten für ToolsenAI

const specialConversions = {
  pressure: {
    label: { de: "Druck (Spezial)", en: "Pressure (Special)" },
    units: {
      torr: { de: "Torr", en: "Torr", factor: 133.322 },
      pascal: { de: "Pascal", en: "Pascal", factor: 1 },
      bar: { de: "Bar", en: "Bar", factor: 100000 }
    }
  },
  illumination: {
    label: { de: "Beleuchtung", en: "Illumination" },
    units: {
      footcandle: { de: "Footcandle", en: "Footcandle", factor: 10.7639 },
      lux: { de: "Lux", en: "Lux", factor: 1 }
    }
  },
  energy: {
    label: { de: "Energie (Spezial)", en: "Energy (Special)" },
    units: {
      electronvolt: { de: "Elektronvolt", en: "Electronvolt", factor: 1.60218e-19 },
      joule: { de: "Joule", en: "Joule", factor: 1 }
    }
  }
};

// Umrechnen-Funktion für Spezial-Einheiten
function convertSpecial(category, from, to, val) {
  const cat = specialConversions[category];
  if (!cat || !from || !to || isNaN(val)) return { result: null, formula: "Fehler" };

  const fromFactor = cat.units[from].factor;
  const toFactor = cat.units[to].factor;
  const result = val * fromFactor / toFactor;
  const formula = `${val} × ${fromFactor} ÷ ${toFactor} = ${result}`;
  return { result, formula };
}
