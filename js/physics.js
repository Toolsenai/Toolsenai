// physics.js
// Physik-Berechnungen für ToolsenAI

// Physik-Formeln
const physicsFormulas = {
  ohm: {
    label: { de: "Ohmsches Gesetz", en: "Ohm's Law" },
    variables: ["U", "I", "R"], // Spannung, Strom, Widerstand
    calculate: function(vals) {
      let { U, I, R } = vals;
      let result, formula;
      if (!U) { result = I * R; formula = "U = I × R"; }
      else if (!I) { result = U / R; formula = "I = U ÷ R"; }
      else if (!R) { result = U / I; formula = "R = U ÷ I"; }
      return { result, formula };
    }
  },
  power: {
    label: { de: "Leistung", en: "Power" },
    variables: ["P", "U", "I"],
    calculate: function(vals) {
      let { P, U, I } = vals;
      let result, formula;
      if (!P) { result = U * I; formula = "P = U × I"; }
      else if (!U) { result = P / I; formula = "U = P ÷ I"; }
      else if (!I) { result = P / U; formula = "I = P ÷ U"; }
      return { result, formula };
    }
  },
  kineticEnergy: {
    label: { de: "Kinetische Energie", en: "Kinetic Energy" },
    variables: ["m", "v", "E"],
    calculate: function(vals) {
      let { m, v, E } = vals;
      let result = E || 0.5 * m * v * v;
      let formula = "E = 0.5 × m × v²";
      return { result, formula };
    }
  },
  pressure: {
    label: { de: "Druck", en: "Pressure" },
    variables: ["F", "A", "p"],
    calculate: function(vals) {
      let { F, A, p } = vals;
      let result = p || F / A;
      let formula = "p = F ÷ A";
      return { result, formula };
    }
  }
};

// Beispiel Funktion um physikalische Berechnung aufzurufen
function calculatePhysics(formulaKey, vals) {
  if (!physicsFormulas[formulaKey]) return null;
  return physicsFormulas[formulaKey].calculate(vals);
}
