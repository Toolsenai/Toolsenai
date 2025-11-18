/* js/modules/astronomy.js
   Erweiterung: Astronomie, Licht & Spezial-Einheiten
   --------------------------------------------------------------- */

(function(){
  function getGlobalData() {
    if (window.DATA) return window.DATA;
    window.DATA = {};
    return window.DATA;
  }

  const DATA = getGlobalData();
  const uf = window.unitFactors || {};

  // Zusatz-Einheiten
  const extraUnits = {
    "AU": 1.495978707e11,  // Astronomical Unit in m
    "ly": 9.4607e15,       // Lichtjahr in m
    "pc": 3.085677581e16,  // Parsec in m
    "lx": 1,               // Lux
    "lm": 1,               // Lumen
    "cd": 1,               // Candela
    "fc": 10.76391          // Footcandle to Lux
  };
  Object.keys(extraUnits).forEach(k => { if(!uf[k]) uf[k]=extraUnits[k]; });

  function fmt(v,digits=6){
    if(v==null || Number.isNaN(v)) return "NaN";
    const abs=Math.abs(v);
    if(abs!==0 && (abs<1e-6 || abs>=1e6)) return Number.parseFloat(v).toExponential(6);
    return Number.parseFloat(Math.round((v+Number.EPSILON)*Math.pow(10,digits))/Math.pow(10,digits)).toString();
  }

  const astronomyModule = {
    type: "calculator",
    formulas: {

      // ENTFERNUNG
      "c = d / t (Lichtgeschwindigkeit)": {
        vars:["c","d","t"],
        units:{c:["m/s"], d:["m","km","AU","ly","pc"], t:["s","h","y"]},
        calc:function(values,target){
          const c=values.c,d=values.d,t=values.t;
          if(target==="c"){ if(d==null||t==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:d/t, formula:`c = ${fmt(d)} ÷ ${fmt(t)} = ${fmt(d/t)} m/s`}; }
          if(target==="d"){ if(c==null||t==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:c*t, formula:`d = ${fmt(c)} × ${fmt(t)} = ${fmt(c*t)} m`}; }
          if(target==="t"){ if(d==null||c==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:d/c, formula:`t = ${fmt(d)} ÷ ${fmt(c)} = ${fmt(d/c)} s`}; }
          return {res:null, formula:"Ungültiges Ziel"};
        }
      },

      // LICHT / HELLIGKEIT
      "L = F / A (Beleuchtungsstärke)": {
        vars:["L","F","A"],
        units:{L:["lx"], F:["lm"], A:["m²"]},
        calc:function(values,target){
          const L=values.L,F=values.F,A=values.A;
          if(target==="L"){ if(F==null||A==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:F/A, formula:`L = ${fmt(F)} ÷ ${fmt(A)} = ${fmt(F/A)} lx`}; }
          if(target==="F"){ if(L==null||A==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:L*A, formula:`F = ${fmt(L)} × ${fmt(A)} = ${fmt(L*A)} lm`}; }
          if(target==="A"){ if(F==null||L==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:F/L, formula:`A = ${fmt(F)} ÷ ${fmt(L)} = ${fmt(F/L)} m²`}; }
          return {res:null, formula:"Ungültiges Ziel"};
        }
      },

      // ENERGY ELECTRONVOLT
      "E(eV) = E(J) / 1.602176634e-19": {
        vars:["E_J","E_eV"],
        units:{E_J:["J"], E_eV:["eV"]},
        calc:function(values,target){
          const J=values.E_J,eV=values.E_eV;
          if(target==="E_eV"){ if(J==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:J/1.602176634e-19, formula:`E = ${fmt(J)} ÷ 1.602176634e-19 = ${fmt(J/1.602176634e-19)} eV`}; }
          if(target==="E_J"){ if(eV==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:eV*1.602176634e-19, formula:`E = ${fmt(eV)} × 1.602176634e-19 = ${fmt(eV*1.602176634e-19)} J`}; }
          return {res:null, formula:"Ungültiges Ziel"};
        }
      }

      // weitere Astronomie-Formeln können hier ergänzt werden...
    }
  };

  // Merge in DATA
  DATA["Astronomie"] = DATA["Astronomie"] || { type:"calculator", formulas:{} };
  Object.assign(DATA["Astronomie"].formulas, astronomyModule.formulas);

  window.DATA = DATA;

  console.log("astronomy.js geladen — Astronomie & Licht/Spezial-Einheiten hinzugefügt");
})();
