/* js/modules/physics.js
   Erweiterung: Physik-, Mechanik- & Elektrik-Formeln + Einheiten
   Diese Datei fügt Einträge zu DATA oder categories hinzu (je nachdem, was vorhanden ist).
   --------------------------------------------------------------- */

(function(){
  // Hilfsfunktion: sichere Referenz auf globale Datenstruktur
  function getGlobalData() {
    if (window.DATA) return window.DATA;
    if (window.categories) {
      // convert short 'categories' into DATA-like structure
      if (!window.DATA) {
        window.DATA = {};
        Object.keys(window.categories).forEach(k => {
          // try to copy simple shape
          try { window.DATA[k] = window.categories[k]; } catch(e){}
        });
      }
      return window.DATA;
    }
    // fallback: create DATA
    window.DATA = {};
    return window.DATA;
  }

  const DATA = getGlobalData();

  // Ensure unitFactors exists (from formula_database.js)
  if (!window.unitFactors) window.unitFactors = {};
  const uf = window.unitFactors;

  // Extend unit factors (lengthy but essential)
  const extraUnits = {
    // length
    "au": 1.495978707e11,      // Astronomical unit (m)
    "ly": 9.4607e15,           // light year (m)
    "pc": 3.085677581e16,      // parsec (m)
    "Å": 1e-10,                // Angström
    // mass
    "u": 1.66053906660e-27,    // atomic mass unit (kg)
    // energy
    "eV": 1.602176634e-19,     // electronvolt to J
    // power/energy aliases (if not present)
    "Wh": 3600,
    // pressure
    "psi": 6894.76
  };
  Object.keys(extraUnits).forEach(k => { if (!uf[k]) uf[k] = extraUnits[k]; });

  // Utility: safe number formatting
  function fmt(v, digits=6) {
    if (v === null || v === undefined || Number.isNaN(v)) return 'NaN';
    // small & big numbers: scientific notation threshold
    const abs = Math.abs(v);
    if ((abs !== 0 && (abs < 1e-6 || abs >= 1e6))) return Number.parseFloat(v).toExponential(6);
    return Number.parseFloat(Math.round((v + Number.EPSILON) * Math.pow(10,digits)) / Math.pow(10,digits)).toString();
  }

  // Now build a physics module to insert into DATA
  const physicsModule = {
    type: "calculator",
    formulas: {
      // ELECTRICITY
      "P = U × I (Leistung)": {
        vars: ["P","U","I"],
        units: { P:["W","kW","MW"], U:["V","kV"], I:["A","mA"] },
        calc: function(values, target) {
          const P = values.P, U = values.U, I = values.I;
          if (target === "P") {
            if (U==null || I==null) return {res:null, formula:"Fehlende Eingabewerte"};
            const r = U*I;
            return {res: r, formula: `${fmt(U)} V × ${fmt(I)} A = ${fmt(r)} W`};
          }
          if (target === "U") {
            if (P==null || I==null) return {res:null, formula:"Fehlende Eingabewerte"};
            const r = P / I;
            return {res: r, formula: `${fmt(P)} W ÷ ${fmt(I)} A = ${fmt(r)} V`};
          }
          if (target === "I") {
            if (P==null || U==null) return {res:null, formula:"Fehlende Eingabewerte"};
            const r = P / U;
            return {res: r, formula: `${fmt(P)} W ÷ ${fmt(U)} V = ${fmt(r)} A`};
          }
          return {res:null, formula:"Ungültiges Ziel"};
        }
      },

      "Ohm: U = R × I": {
        vars: ["U","R","I"],
        units: { U:["V"], R:["Ω","kΩ"], I:["A","mA"] },
        calc: function(values,target){
          const U = values.U, R = values.R, I = values.I;
          if (target==="U") {
            if (R==null || I==null) return {res:null, formula:"Fehlende Eingabewerte"};
            const r = R * I; return {res:r, formula: `${fmt(R)} Ω × ${fmt(I)} A = ${fmt(r)} V`};
          }
          if (target==="R") {
            if (U==null || I==null) return {res:null, formula:"Fehlende Eingabewerte"};
            const r = U / I; return {res:r, formula: `${fmt(U)} V ÷ ${fmt(I)} A = ${fmt(r)} Ω`};
          }
          if (target==="I") {
            if (U==null || R==null) return {res:null, formula:"Fehlende Eingabewerte"};
            const r = U / R; return {res:r, formula: `${fmt(U)} V ÷ ${fmt(R)} Ω = ${fmt(r)} A`};
          }
          return {res:null, formula:"Ungültiges Ziel"};
        }
      },

      "P = I² × R": {
        vars: ["P","I","R"],
        units: { P:["W"], I:["A"], R:["Ω"] },
        calc: function(values,target){
          const P = values.P, I = values.I, R = values.R;
          if (target==="P") {
            if (I==null || R==null) return {res:null, formula:"Fehlende Eingabewerte"};
            const r = I*I*R; return {res:r, formula: `${fmt(I)}² × ${fmt(R)} Ω = ${fmt(r)} W`};
          }
          if (target==="I") {
            if (P==null || R==null) return {res:null, formula:"Fehlende Eingabewerte"};
            const r = Math.sqrt(P/R); return {res:r, formula: `√(${fmt(P)} ÷ ${fmt(R)}) = ${fmt(r)} A`};
          }
          if (target==="R") {
            if (P==null || I==null) return {res:null, formula:"Fehlende Eingabewerte"};
            const r = P / (I*I); return {res:r, formula: `${fmt(P)} ÷ ${fmt(I)}² = ${fmt(r)} Ω`};
          }
          return {res:null, formula:"Ungültiges Ziel"};
        }
      },

      "Transformator: U2 = U1 × N2/N1": {
        vars: ["U1","U2","N1","N2"],
        units: { U1:["V"], U2:["V"], N1:["windings"], N2:["windings"] },
        calc: function(values,target) {
          const U1 = values.U1, U2 = values.U2, N1 = values.N1, N2 = values.N2;
          if (target==="U2") {
            if (U1==null || N1==null || N2==null) return {res:null, formula:"Fehlende Eingabewerte"};
            const r = U1 * (N2 / N1);
            return {res:r, formula: `U2 = ${fmt(U1)} × ${fmt(N2)} ÷ ${fmt(N1)} = ${fmt(r)} V`};
          }
          if (target==="N2") {
            if (U1==null || U2==null || N1==null) return {res:null, formula:"Fehlende Eingabewerte"};
            const r = N1 * (U2 / U1);
            return {res:r, formula: `N2 = ${fmt(N1)} × ${fmt(U2)} ÷ ${fmt(U1)} = ${fmt(r)} turns`};
          }
          if (target==="U1") {
            if (U2==null || N1==null || N2==null) return {res:null, formula:"Fehlende Eingabewerte"};
            const r = U2 * (N1 / N2);
            return {res:r, formula: `U1 = ${fmt(U2)} × ${fmt(N1)} ÷ ${fmt(N2)} = ${fmt(r)} V`};
          }
          if (target==="N1") {
            if (U1==null || U2==null || N2==null) return {res:null, formula:"Fehlende Eingabewerte"};
            const r = N2 * (U1 / U2);
            return {res:r, formula: `N1 = ${fmt(N2)} × ${fmt(U1)} ÷ ${fmt(U2)} = ${fmt(r)} turns`};
          }
          return {res:null, formula:"Ungültiges Ziel"};
        }
      },

      // MECHANICS
      "F = m × a (Kraft)": {
        vars: ["F","m","a"],
        units: { F:["N"], m:["kg"], a:["m/s²"] },
        calc: function(values,target){
          const F = values.F, m = values.m, a = values.a;
          if (target==="F") {
            if (m==null || a==null) return {res:null, formula:"Fehlende Eingabewerte"};
            const r = m * a; return {res:r, formula: `${fmt(m)} kg × ${fmt(a)} m/s² = ${fmt(r)} N`};
          }
          if (target==="m") {
            if (F==null || a==null) return {res:null, formula:"Fehlende Eingabewerte"};
            const r = F / a; return {res:r, formula: `${fmt(F)} N ÷ ${fmt(a)} m/s² = ${fmt(r)} kg`};
          }
          if (target==="a") {
            if (F==null || m==null) return {res:null, formula:"Fehlende Eingabewerte"};
            const r = F / m; return {res:r, formula: `${fmt(F)} N ÷ ${fmt(m)} kg = ${fmt(r)} m/s²`};
          }
          return {res:null, formula:"Ungültiges Ziel"};
        }
      },

      "KE = 1/2 m v² (kin. Energie)": {
        vars: ["E","m","v"],
        units: { E:["J"], m:["kg"], v:["m/s"] },
        calc: function(values,target){
          const E = values.E, m = values.m, v = values.v;
          if (target==="E") {
            if (m==null || v==null) return {res:null, formula:"Fehlende Eingabewerte"};
            const r = 0.5 * m * v * v; return {res:r, formula: `0.5 × ${fmt(m)} × ${fmt(v)}² = ${fmt(r)} J`};
          }
          if (target==="v") {
            if (E==null || m==null) return {res:null, formula:"Fehlende Eingabewerte"};
            const r = Math.sqrt(2 * E / m); return {res:r, formula: `v = √(2×${fmt(E)} ÷ ${fmt(m)}) = ${fmt(r)} m/s`};
          }
          if (target==="m") {
            if (E==null || v==null) return {res:null, formula:"Fehlende Eingabewerte"};
            const r = 2 * E / (v * v); return {res:r, formula: `m = 2×${fmt(E)} ÷ ${fmt(v)}² = ${fmt(r)} kg`};
          }
          return {res:null, formula:"Ungültiges Ziel"};
        }
      },

      "W = F × s (Arbeit / Energie)": {
        vars: ["W","F","s"],
        units: { W:["J"], F:["N"], s:["m"] },
        calc: function(values,target){
          const W = values.W, F = values.F, s = values.s;
          if (target==="W") { if (F==null || s==null) return {res:null, formula:"Fehlende Eingabewerte"}; const r = F*s; return {res:r, formula:`${fmt(F)} N × ${fmt(s)} m = ${fmt(r)} J`}; }
          if (target==="F") { if (W==null || s==null) return {res:null, formula:"Fehlende Eingabewerte"}; const r = W/s; return {res:r, formula:`${fmt(W)} J ÷ ${fmt(s)} m = ${fmt(r)} N`}; }
          if (target==="s") { if (W==null || F==null) return {res:null, formula:"Fehlende Eingabewerte"}; const r = W/F; return {res:r, formula:`${fmt(W)} J ÷ ${fmt(F)} N = ${fmt(r)} m`}; }
          return {res:null, formula:"Ungültiges Ziel"};
        }
      },

      // Kinematics: v = s / t
      "v = s / t (Geschwindigkeit)": {
        vars: ["v","s","t"],
        units: { v:["m/s","km/h"], s:["m","km"], t:["s","h"] },
        calc: function(values,target){
          const v = values.v, s = values.s, t = values.t;
          if (target==="v") { if (s==null || t==null) return {res:null, formula:"Fehlende Eingabewerte"}; const r = s / t; return {res:r, formula:`${fmt(s)} ÷ ${fmt(t)} = ${fmt(r)} m/s`}; }
          if (target==="s") { if (v==null || t==null) return {res:null, formula:"Fehlende Eingabewerte"}; const r = v * t; return {res:r, formula:`${fmt(v)} × ${fmt(t)} = ${fmt(r)} m`}; }
          if (target==="t") { if (s==null || v==null) return {res:null, formula:"Fehlende Eingabewerte"}; const r = s / v; return {res:r, formula:`${fmt(s)} ÷ ${fmt(v)} = ${fmt(r)} s`}; }
          return {res:null, formula:"Ungültiges Ziel"};
        }
      },

      // GEOMETRY
      "Quader: V = l × b × h": {
        vars: ["V","l","b","h"],
        units: { V:["m³","L"], l:["m"], b:["m"], h:["m"] },
        calc: function(values,target){
          const V = values.V, l = values.l, b = values.b, h = values.h;
          if (target==="V") { if (l==null||b==null||h==null) return {res:null, formula:"Fehlende Eingabewerte"}; const r = l*b*h; return {res:r, formula:`${fmt(l)} × ${fmt(b)} × ${fmt(h)} = ${fmt(r)} m³`}; }
          if (target==="l") { if (V==null||b==null||h==null) return {res:null, formula:"Fehlende Eingabewerte"}; const r = V/(b*h); return {res:r, formula:`${fmt(V)} ÷ (${fmt(b)} × ${fmt(h)}) = ${fmt(r)} m`}; }
          if (target==="b") { if (V==null||l==null||h==null) return {res:null, formula:"Fehlende Eingabewerte"}; const r = V/(l*h); return {res:r, formula:`${fmt(V)} ÷ (${fmt(l)} × ${fmt(h)}) = ${fmt(r)} m`}; }
          if (target==="h") { if (V==null||l==null||b==null) return {res:null, formula:"Fehlende Eingabewerte"}; const r = V/(l*b); return {res:r, formula:`${fmt(V)} ÷ (${fmt(l)} × ${fmt(b)}) = ${fmt(r)} m`}; }
          return {res:null, formula:"Ungültiges Ziel"};
        }
      },

      "Zylinder: V = π r² h": {
        vars: ["V","r","h"],
        units: { V:["m³"], r:["m"], h:["m"] },
        calc: function(values,target){
          const V = values.V, r = values.r, h = values.h;
          if (target==="V") { if (r==null||h==null) return {res:null, formula:"Fehlende Eingabewerte"}; const res = Math.PI * r * r * h; return {res:res, formula:`π × ${fmt(r)}² × ${fmt(h)} = ${fmt(res)} m³`}; }
          if (target==="r") { if (V==null||h==null) return {res:null, formula:"Fehlende Eingabewerte"}; const res = Math.sqrt(V/(Math.PI*h)); return {res:res, formula:`r = √(${fmt(V)} ÷ (π × ${fmt(h)})) = ${fmt(res)} m`}; }
          if (target==="h") { if (V==null||r==null) return {res:null, formula:"Fehlende Eingabewerte"}; const res = V/(Math.PI*r*r); return {res:res, formula:`h = ${fmt(V)} ÷ (π × ${fmt(r)}²) = ${fmt(res)} m`}; }
          return {res:null, formula:"Ungültiges Ziel"};
        }
      },

      "Kugel: V = 4/3 π r³": {
        vars: ["V","r"],
        units: { V:["m³"], r:["m"] },
        calc: function(values,target){
          const V = values.V, r = values.r;
          if (target==="V") { if (r==null) return {res:null, formula:"Fehlende Eingabewerte"}; const res = 4/3 * Math.PI * Math.pow(r,3); return {res:res, formula:`4/3 × π × ${fmt(r)}³ = ${fmt(res)} m³`}; }
          if (target==="r") { if (V==null) return {res:null, formula:"Fehlende Eingabewerte"}; const res = Math.cbrt((3*V)/(4*Math.PI)); return {res:res, formula:`r = ³√(3×${fmt(V)} ÷ (4×π)) = ${fmt(res)} m`}; }
          return {res:null, formula:"Ungültiges Ziel"};
        }
      }

      // weitere Formeln können hier ergänzt werden...
    } // end formulas
  }; // end physicsModule

  // Merge physicsModule into DATA (safe)
  if (!DATA["Elektrik"] && !DATA["Elektrik"]) {
    // prefer German key names if not present
    DATA["Elektrik"] = { type: "calculator", formulas: {} };
  }
  // copy formulas into DATA["Elektrik"] and DATA["Mechanik"] etc.
  // We'll split formulas by intuitive groups:
  const elekFormulas = {};
  const mechFormulas = {};
  const geomFormulas = {};
  Object.keys(physicsModule.formulas).forEach(key=>{
    if (key.includes("Leistung") || key.includes("Ohm") || key.includes("Transformator") || key.includes("P =")) {
      elekFormulas[key] = physicsModule.formulas[key];
    } else if (key.includes("F =") || key.includes("KE") || key.includes("W =")) {
      mechFormulas[key] = physicsModule.formulas[key];
    } else {
      geomFormulas[key] = physicsModule.formulas[key];
    }
  });

  // Insert Elektrik
  DATA["Elektrik"] = DATA["Elektrik"] || { type:"calculator", formulas: {} };
  Object.assign(DATA["Elektrik"].formulas, elekFormulas);

  // Insert Mechanik
  DATA["Mechanik"] = DATA["Mechanik"] || { type:"calculator", formulas: {} };
  Object.assign(DATA["Mechanik"].formulas, mechFormulas);

  // Insert Geometrie
  DATA["Geometrie"] = DATA["Geometrie"] || { type:"calculator", formulas: {} };
  Object.assign(DATA["Geometrie"].formulas, geomFormulas);

  // Make DATA globally available for debugging
  window.DATA = DATA;

  console.log("physics.js loaded — Elektrik, Mechanik, Geometrie hinzugefügt.");
})();
