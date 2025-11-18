/* js/modules/chemistry.js
   ToolsenAI – Chemistry Module
   --------------------------------------------------------------- */

(function(){
  const DATA = window.DATA || (window.DATA = {});
  if (!window.unitFactors) window.unitFactors = {};
  const uf = window.unitFactors;

  // Ergänzung nützlicher chemischer Einheiten
  const extraChemUnits = {
    "mol":1,
    "g":1,
    "kg":1000,
    "mg":0.001,
    "L":1,
    "mL":0.001
  };
  Object.keys(extraChemUnits).forEach(k => { if (!uf[k]) uf[k] = extraChemUnits[k]; });

  function fmt(v,digits=6){
    if(v==null || Number.isNaN(v)) return 'NaN';
    const abs = Math.abs(v);
    if(abs!==0 && (abs<1e-6 || abs>=1e6)) return Number.parseFloat(v).toExponential(6);
    return Number.parseFloat(Math.round((v+Number.EPSILON)*Math.pow(10,digits))/Math.pow(10,digits)).toString();
  }

  const chemModule = {
    type:"calculator",
    formulas: {
      "n = m / M (Molzahl)":{
        vars:["n","m","M"],
        units:{n:["mol"], m:["g","kg","mg"], M:["g/mol","kg/mol"]},
        calc:function(values,target){
          const n=values.n,m=values.m,M=values.M;
          if(target==="n"){ if(m==null||M==null) return {res:null,formula:"Fehlende Werte"}; const r=m/M; return {res:r, formula:`${fmt(m)} ÷ ${fmt(M)} = ${fmt(r)} mol`};}
          if(target==="m"){ if(n==null||M==null) return {res:null,formula:"Fehlende Werte"}; const r=n*M; return {res:r, formula:`${fmt(n)} × ${fmt(M)} = ${fmt(r)} g`};}
          if(target==="M"){ if(m==null||n==null) return {res:null,formula:"Fehlende Werte"}; const r=m/n; return {res:r, formula:`${fmt(m)} ÷ ${fmt(n)} = ${fmt(r)} g/mol`};}
          return {res:null, formula:"Ungültiges Ziel"};
        }
      },
      "c = n / V (Konzentration)":{
        vars:["c","n","V"],
        units:{c:["mol/L"], n:["mol"], V:["L","mL"]},
        calc:function(values,target){
          const c=values.c,n=values.n,V=values.V;
          if(target==="c"){ if(n==null||V==null) return {res:null,formula:"Fehlende Werte"}; const r=n/V; return {res:r, formula:`${fmt(n)} ÷ ${fmt(V)} = ${fmt(r)} mol/L`};}
          if(target==="n"){ if(c==null||V==null) return {res:null,formula:"Fehlende Werte"}; const r=c*V; return {res:r, formula:`${fmt(c)} × ${fmt(V)} = ${fmt(r)} mol`};}
          if(target==="V"){ if(n==null||c==null) return {res:null,formula:"Fehlende Werte"}; const r=n/c; return {res:r, formula:`${fmt(n)} ÷ ${fmt(c)} = ${fmt(r)} L`};}
          return {res:null, formula:"Ungültiges Ziel"};
        }
      },
      "pH = -log10[H+]":{
        vars:["pH","Hplus"],
        units:{pH:[], Hplus:["mol/L"]},
        calc:function(values,target){
          const pH=values.pH,Hplus=values.Hplus;
          if(target==="pH"){ if(Hplus==null) return {res:null,formula:"Fehlende Werte"}; const r=-Math.log10(Hplus); return {res:r,formula:`-log10(${fmt(Hplus)}) = ${fmt(r)}`};}
          if(target==="Hplus"){ if(pH==null) return {res:null,formula:"Fehlende Werte"}; const r=Math.pow(10,-pH); return {res:r,formula:`10^(-${fmt(pH)}) = ${fmt(r)} mol/L`};}
          return {res:null,formula:"Ungültiges Ziel"};
        }
      },
      "Idealgas: pV = nRT":{
        vars:["p","V","n","T"],
        units:{p:["Pa","kPa","bar"], V:["m³","L"], n:["mol"], T:["K","°C"]},
        calc:function(values,target){
          const p=values.p,V=values.V,n=values.n,T=values.T;
          const R=8.314462618; // J/(mol·K)
          if(target==="p"){ if(n==null||T==null||V==null) return {res:null,formula:"Fehlende Werte"}; const r=n*R*T/V; return {res:r,formula:`p = ${fmt(n)} × ${R} × ${fmt(T)} ÷ ${fmt(V)} = ${fmt(r)} Pa`};}
          if(target==="V"){ if(n==null||T==null||p==null) return {res:null,formula:"Fehlende Werte"}; const r=n*R*T/p; return {res:r,formula:`V = ${fmt(n)} × ${R} × ${fmt(T)} ÷ ${fmt(p)} = ${fmt(r)} m³`};}
          if(target==="n"){ if(p==null||V==null||T==null) return {res:null,formula:"Fehlende Werte"}; const r=p*V/(R*T); return {res:r,formula:`n = ${fmt(p)} × ${fmt(V)} ÷ (${R} × ${fmt(T)}) = ${fmt(r)} mol`};}
          if(target==="T"){ if(p==null||V==null||n==null) return {res:null,formula:"Fehlende Werte"}; const r=p*V/(n*R); return {res:r,formula:`T = ${fmt(p)} × ${fmt(V)} ÷ (${fmt(n)} × ${R}) = ${fmt(r)} K`};}
          return {res:null,formula:"Ungültiges Ziel"};
        }
      }
    }
  };

  // Insert into DATA
  DATA["Chemie"] = DATA["Chemie"] || { type:"calculator", formulas:{} };
  Object.assign(DATA["Chemie"].formulas, chemModule.formulas);

  window.DATA = DATA;
  console.log("chemistry.js loaded — Chemie Formeln hinzugefügt.");
})();
