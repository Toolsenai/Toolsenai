// chemistry.js
// Chemie-Berechnungen für ToolsenAI

const chemistryFormulas = {
  molarMass: {
    label: { de: "Molare Masse", en: "Molar Mass" },
    variables: ["mass", "n", "M"], // Masse, Stoffmenge, molare Masse
    calculate: function(vals) {
      let { mass, n, M } = vals;
      let result, formula;
      if (!M) { result = mass / n; formula = "M = m ÷ n"; }
      else if (!mass) { result = n * M; formula = "m = n × M"; }
      else if (!n) { result = mass / M; formula = "n = m ÷ M"; }
      return { result, formula };
    }
  },
  energyEVtoJ: {
    label: { de: "Energie: eV → Joule", en: "Energy: eV → Joule" },
    variables: ["eV", "J"],
    calculate: function(vals) {
      let { eV, J } = vals;
      const factor = 1.60218e-19;
      if (!J) { return { result: eV * factor, formula: "J = eV × 1.60218×10⁻¹⁹" }; }
      else { return { result: J / factor, formula: "eV = J ÷ 1.60218×10⁻¹⁹" }; }
    }
  },
  idealGas: {
    label: { de: "Ideales Gasgesetz", en: "Ideal Gas Law" },
    variables: ["P", "V", "n", "R", "T"],
    calculate: function(vals) {
      let { P, V, n, R, T } = vals;
      R = R || 8.314; // Universelle Gaskonstante
      let result, formula;
      if (!P) { result = (n * R * T) / V; formula = "P = n × R × T ÷ V"; }
      else if (!V) { result = (n * R * T) / P; formula = "V = n × R × T ÷ P"; }
      else if (!n) { result = (P * V) / (R * T); formula = "n = P × V ÷ (R × T)"; }
      else if (!T) { result = (P * V) / (n * R); formula = "T = P × V ÷ (n × R)"; }
      return { result, formula };
    }
  }
};

// Funktion um Chemie-Berechnung aufzurufen
function calculateChemistry(formulaKey, vals) {
  if (!chemistryFormulas[formulaKey]) return null;
  return chemistryFormulas[formulaKey].calculate(vals);
}
