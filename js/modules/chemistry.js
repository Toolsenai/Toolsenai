/* js/modules/chemistry.js
   Erweiterung: Chemie-Berechnungen & Einheiten
   --------------------------------------------------------------- */

(function(){
  // globale Datenstruktur holen
  function getGlobalData() {
    if (window.DATA) return window.DATA;
    window.DATA = {};
    return window.DATA;
  }

  const DATA = getGlobalData();

  // SI Präfixe schon aus formula_database.js
  const uf = window.unitFactors || {};

  // Hilfsfunktion: formatieren
  function fmt(v,digits=6){
    if(v==null || Number.isNaN(v)) return "NaN";
    const abs=Math.abs(v);
    if(abs!==0 && (abs<1e-6 || abs>=1e6)) return Number.parseFloat(v).toExponential(6);
    return Number.parseFloat(Math.round((v+Number.EPSILON)*Math.pow(10,digits))/Math.pow(10,digits)).toString();
  }

  // Chemie-Module
  const chemistryModule = {
    type: "calculator",
    formulas: {

      // MOLARE MASSE
      "M = m / n (Molare Masse)": {
        vars:["M","m","n"],
        units:{M:["g/mol"], m:["g","kg"], n:["mol"]},
        calc:function(values,target){
          const M=values.M, m=values.m, n=values.n;
          if(target==="M"){ if(m==null||n==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:m/n, formula:`M = ${fmt(m)} ÷ ${fmt(n)} = ${fmt(m/n)} g/mol`}; }
          if(target==="m"){ if(M==null||n==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:M*n, formula:`m = ${fmt(M)} × ${fmt(n)} = ${fmt(M*n)} g`}; }
          if(target==="n"){ if(m==null||M==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:m/M, formula:`n = ${fmt(m)} ÷ ${fmt(M)} = ${fmt(m/M)} mol`}; }
          return {res:null, formula:"Ungültiges Ziel"};
        }
      },

      // MOLARITÄT
      "c = n / V (Molarität)": {
        vars:["c","n","V"],
        units:{c:["mol/L","mol/m³"], n:["mol"], V:["L","m³"]},
        calc:function(values,target){
          const c=values.c,n=values.n,V=values.V;
          if(target==="c"){ if(n==null||V==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:n/V, formula:`c = ${fmt(n)} ÷ ${fmt(V)} = ${fmt(n/V)} mol/L`}; }
          if(target==="n"){ if(c==null||V==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:c*V, formula:`n = ${fmt(c)} × ${fmt(V)} = ${fmt(c*V)} mol`}; }
          if(target==="V"){ if(n==null||c==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:n/c, formula:`V = ${fmt(n)} ÷ ${fmt(c)} = ${fmt(n/c)} L`}; }
          return {res:null, formula:"Ungültiges Ziel"};
        }
      },

      // PH-BERECHNUNG
      "pH = -log10[H⁺]": {
        vars:["pH","H"],
        units:{pH:[], H:["mol/L"]},
        calc:function(values,target){
          const pH=values.pH,H=values.H;
          if(target==="pH"){ if(H==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:-Math.log10(H), formula:`pH = -log10(${fmt(H)}) = ${fmt(-Math.log10(H))}`}; }
          if(target==="H"){ if(pH==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:Math.pow(10,-pH), formula:`[H⁺] = 10^(-${fmt(pH)}) = ${fmt(Math.pow(10,-pH))} mol/L`}; }
          return {res:null, formula:"Ungültiges Ziel"};
        }
      },

      // REAKTIONSENERGIE
      "ΔH = H_produkte - H_reaktanten": {
        vars:["ΔH","Hprod","Hreact"],
        units:{ΔH:["kJ/mol"], Hprod:["kJ/mol"], Hreact:["kJ/mol"]},
        calc:function(values,target){
          const ΔH=values.ΔH,Hprod=values.Hprod,Hreact=values.Hreact;
          if(target==="ΔH"){ if(Hprod==null||Hreact==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:Hprod-Hreact, formula:`ΔH = ${fmt(Hprod)} - ${fmt(Hreact)} = ${fmt(Hprod-Hreact)} kJ/mol`}; }
          if(target==="Hprod"){ if(ΔH==null||Hreact==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:ΔH+Hreact, formula:`Hprod = ${fmt(ΔH)} + ${fmt(Hreact)} = ${fmt(ΔH+Hreact)} kJ/mol`}; }
          if(target==="Hreact"){ if(Hprod==null||ΔH==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:Hprod-ΔH, formula:`Hreact = ${fmt(Hprod)} - ${fmt(ΔH)} = ${fmt(Hprod-ΔH)} kJ/mol`}; }
          return {res:null, formula:"Ungültiges Ziel"};
        }
      }
    } // end formulas
  }; // end chemistryModule

  // Merge in DATA
  DATA["Chemie"] = DATA["Chemie"] || { type:"calculator", formulas:{} };
  Object.assign(DATA["Chemie"].formulas, chemistryModule.formulas);

  window.DATA = DATA;

  console.log("chemistry.js geladen — Chemie-Formeln hinzugefügt");
})();
