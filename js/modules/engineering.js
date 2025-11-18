/* js/modules/engineering.js
   Erweiterung: Technik & Spezial-Einheiten
   --------------------------------------------------------------- */

(function(){
  function getGlobalData() {
    if (window.DATA) return window.DATA;
    window.DATA = {};
    return window.DATA;
  }

  const DATA = getGlobalData();
  const uf = window.unitFactors || {};

  function fmt(v,digits=6){
    if(v==null || Number.isNaN(v)) return "NaN";
    const abs=Math.abs(v);
    if(abs!==0 && (abs<1e-6 || abs>=1e6)) return Number.parseFloat(v).toExponential(6);
    return Number.parseFloat(Math.round((v+Number.EPSILON)*Math.pow(10,digits))/Math.pow(10,digits)).toString();
  }

  const engineeringModule = {
    type: "calculator",
    formulas: {

      // DRUCK
      "P = F / A": {
        vars:["P","F","A"],
        units:{P:["Pa","bar","atm","Torr","psi"], F:["N"], A:["m²"]},
        calc:function(values,target){
          const P=values.P,F=values.F,A=values.A;
          if(target==="P"){ if(F==null||A==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:F/A, formula:`P = ${fmt(F)} ÷ ${fmt(A)} = ${fmt(F/A)} Pa`}; }
          if(target==="F"){ if(P==null||A==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:P*A, formula:`F = ${fmt(P)} × ${fmt(A)} = ${fmt(P*A)} N`}; }
          if(target==="A"){ if(F==null||P==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:F/P, formula:`A = ${fmt(F)} ÷ ${fmt(P)} = ${fmt(F/P)} m²`}; }
          return {res:null, formula:"Ungültiges Ziel"};
        }
      },

      // TEMPERATUR
      "Temperaturumrechnung": {
        vars:["C","F","K"],
        units:{C:["°C"], F:["°F"], K:["K"]},
        calc:function(values,target){
          const C=values.C,F=values.F,K=values.K;
          if(target==="C"){
            if(F!=null) return {res:(F-32)/1.8, formula:`C = (${fmt(F)} - 32) ÷ 1.8 = ${fmt((F-32)/1.8)} °C`};
            if(K!=null) return {res:K-273.15, formula:`C = ${fmt(K)} - 273.15 = ${fmt(K-273.15)} °C`};
          }
          if(target==="F"){
            if(C!=null) return {res:C*1.8+32, formula:`F = ${fmt(C)} × 1.8 + 32 = ${fmt(C*1.8+32)} °F`};
            if(K!=null) return {res:(K-273.15)*1.8+32, formula:`F = (${fmt(K)} - 273.15) × 1.8 + 32 = ${fmt((K-273.15)*1.8+32)} °F`};
          }
          if(target==="K"){
            if(C!=null) return {res:C+273.15, formula:`K = ${fmt(C)} + 273.15 = ${fmt(C+273.15)} K`};
            if(F!=null) return {res:(F-32)/1.8+273.15, formula:`K = (${fmt(F)} - 32) ÷ 1.8 + 273.15 = ${fmt((F-32)/1.8+273.15)} K`};
          }
          return {res:null, formula:"Ungültige Eingabewerte"};
        }
      },

      // DATENMENGEN
      "Datenmenge": {
        vars:["value","fromUnit","toUnit"],
        units:{value:["B","KB","MB","GB","TB","PB"], fromUnit:["B","KB","MB","GB","TB","PB"], toUnit:["B","KB","MB","GB","TB","PB"]},
        calc:function(values,target){
          if(target!=="value") return {res:null, formula:"Nur value unterstützt"};
          const val=values.value, from=values.fromUnit, to=values.toUnit;
          if(val==null||!uf[from]||!uf[to]) return {res:null, formula:"Fehlende Eingabe oder unbekannte Einheit"};
          return {res:val*uf[from]/uf[to], formula:`${fmt(val)} ${from} = ${fmt(val*uf[from]/uf[to])} ${to}`};
        }
      },

      // LEISTUNG / STROM / SPANNUNG
      "P = U × I": {
        vars:["P","U","I"],
        units:{P:["W","kW","mW"], U:["V"], I:["A","mA"]},
        calc:function(values,target){
          const P=values.P,U=values.U,I=values.I;
          if(target==="P"){ if(U==null||I==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:U*I, formula:`P = ${fmt(U)} × ${fmt(I)} = ${fmt(U*I)} W`}; }
          if(target==="U"){ if(P==null||I==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:P/I, formula:`U = ${fmt(P)} ÷ ${fmt(I)} = ${fmt(P/I)} V`}; }
          if(target==="I"){ if(P==null||U==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:P/U, formula:`I = ${fmt(P)} ÷ ${fmt(U)} = ${fmt(P/U)} A`}; }
          return {res:null, formula:"Ungültiges Ziel"};
        }
      },

      // WIDERSTAND
      "R = U / I": {
        vars:["R","U","I"],
        units:{R:["Ω"], U:["V"], I:["A"]},
        calc:function(values,target){
          const R=values.R,U=values.U,I=values.I;
          if(target==="R"){ if(U==null||I==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:U/I, formula:`R = ${fmt(U)} ÷ ${fmt(I)} = ${fmt(U/I)} Ω`}; }
          if(target==="U"){ if(R==null||I==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:R*I, formula:`U = ${fmt(R)} × ${fmt(I)} = ${fmt(R*I)} V`}; }
          if(target==="I"){ if(R==null||U==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:U/R, formula:`I = ${fmt(U)} ÷ ${fmt(R)} = ${fmt(U/R)} A`}; }
          return {res:null, formula:"Ungültiges Ziel"};
        }
      }

      // Weitere Technik-Formeln können hier ergänzt werden...
    }
  };

  // Merge in DATA
  DATA["Technik"] = DATA["Technik"] || { type:"calculator", formulas:{} };
  Object.assign(DATA["Technik"].formulas, engineeringModule.formulas);

  window.DATA = DATA;

  console.log("engineering.js geladen — Technik & Spezial-Einheiten hinzugefügt");
})();
