// astronomy.js
// Astronomie-Berechnungen für ToolsenAI

const astronomyFormulas = {
  distance: {
    label: { de: "Entfernung", en: "Distance" },
    units: {
      AU: { de: "Astronomische Einheit", en: "AU", factor: 1 },
      lightYear: { de: "Lichtjahr", en: "Light Year", factor: 63241.1 },
      parsec: { de: "Parsec", en: "Parsec", factor: 206265 }
    }
  },
  wavelengthFrequency: {
    label: { de: "Wellenlänge ↔ Frequenz", en: "Wavelength ↔ Frequency" },
    variables: ["lambda", "f"], // lambda in m, f in Hz
    c: 299792458, // Lichtgeschwindigkeit m/s
    calculate: function(vals) {
      let { lambda, f } = vals;
      let result, formula;
      if (!lambda) { result = this.c / f; formula = "λ = c ÷ f"; }
      else if (!f) { result = this.c / lambda; formula = "f = c ÷ λ"; }
      return { result, formula };
    }
  },
  redshift: {
    label: { de: "Rotverschiebung", en: "Redshift" },
    variables: ["z", "lambdaObserved", "lambdaRest"],
    calculate: function(vals) {
      let { z, lambdaObserved, lambdaRest } = vals;
      let result, formula;
      if (!z) { result = (lambdaObserved - lambdaRest) / lambdaRest; formula = "z = (λ_obs - λ_rest)/λ_rest"; }
      else if (!lambdaObserved) { result = lambdaRest * (1 + z); formula = "λ_obs = λ_rest × (1 + z)"; }
      else if (!lambdaRest) { result = lambdaObserved / (1 + z); formula = "λ_rest = λ_obs ÷ (1 + z)"; }
      return { result, formula };
    }
  }
};

// Funktion um Astronomie-Berechnungen aufzurufen
function calculateAstronomy(formulaKey, vals) {
  if (!astronomyFormulas[formulaKey]) return null;
  return astronomyFormulas[formulaKey].calculate(vals);
}
