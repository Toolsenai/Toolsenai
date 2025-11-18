/* js/modules/math.js
   Erweiterung: Mathematik & Volumen/Flächen/Formeln
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

  const mathModule = {
    type: "calculator",
    formulas: {

      // RECHTECK / QUADER
      "A = l × b (Fläche Rechteck)": {
        vars:["A","l","b"],
        units:{A:["m²"], l:["m"], b:["m"]},
        calc:function(values,target){
          const A=values.A,l=values.l,b=values.b;
          if(target==="A"){ if(l==null||b==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:l*b, formula:`A = ${fmt(l)} × ${fmt(b)} = ${fmt(l*b)} m²`}; }
          if(target==="l"){ if(A==null||b==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:A/b, formula:`l = ${fmt(A)} ÷ ${fmt(b)} = ${fmt(A/b)} m`}; }
          if(target==="b"){ if(A==null||l==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:A/l, formula:`b = ${fmt(A)} ÷ ${fmt(l)} = ${fmt(A/l)} m`}; }
          return {res:null, formula:"Ungültiges Ziel"};
        }
      },

      // KREIS
      "A = π × r²": {
        vars:["A","r"],
        units:{A:["m²"], r:["m"]},
        calc:function(values,target){
          const A=values.A,r=values.r;
          if(target==="A"){ if(r==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:Math.PI*r*r, formula:`A = π × ${fmt(r)}² = ${fmt(Math.PI*r*r)} m²`}; }
          if(target==="r"){ if(A==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:Math.sqrt(A/Math.PI), formula:`r = √(${fmt(A)} ÷ π) = ${fmt(Math.sqrt(A/Math.PI))} m`}; }
          return {res:null, formula:"Ungültiges Ziel"};
        }
      },

      // KUGEL VOLUME
      "V = 4/3 π r³": {
        vars:["V","r"],
        units:{V:["m³"], r:["m"]},
        calc:function(values,target){
          const V=values.V,r=values.r;
          if(target==="V"){ if(r==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:(4/3)*Math.PI*r*r*r, formula:`V = 4/3 × π × ${fmt(r)}³ = ${fmt((4/3)*Math.PI*r*r*r)} m³`}; }
          if(target==="r"){ if(V==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:Math.cbrt((3/4)*V/Math.PI), formula:`r = ³√(${fmt(V)} × 3/4 ÷ π) = ${fmt(Math.cbrt((3/4)*V/Math.PI))} m`}; }
          return {res:null, formula:"Ungültiges Ziel"};
        }
      },

      // GLEICHUNG LINEAR
      "y = m x + b": {
        vars:["y","m","x","b"],
        units:{y:[], m:[], x:[], b:[]},
        calc:function(values,target){
          const y=values.y,m=values.m,x=values.x,b=values.b;
          if(target==="y"){ if(m==null||x==null||b==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:m*x+b, formula:`y = ${fmt(m)} × ${fmt(x)} + ${fmt(b)} = ${fmt(m*x+b)}`}; }
          if(target==="x"){ if(m==null||y==null||b==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:(y-b)/m, formula:`x = (${fmt(y)} - ${fmt(b)}) ÷ ${fmt(m)} = ${fmt((y-b)/m)}`}; }
          if(target==="m"){ if(x==null||y==null||b==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:(y-b)/x, formula:`m = (${fmt(y)} - ${fmt(b)}) ÷ ${fmt(x)} = ${fmt((y-b)/x)}`}; }
          if(target==="b"){ if(m==null||x==null||y==null) return {res:null, formula:"Fehlende Eingabewerte"}; return {res:y-m*x, formula:`b = ${fmt(y)} - ${fmt(m)} × ${fmt(x)} = ${fmt(y-m*x)}`}; }
          return {res:null, formula:"Ungültiges Ziel"};
        }
      }

      // Weitere Mathematik/Volumen/Formeln können hier ergänzt werden...
    }
  };

  // Merge in DATA
  DATA["Mathematik"] = DATA["Mathematik"] || { type:"calculator", formulas:{} };
  Object.assign(DATA["Mathematik"].formulas, mathModule.formulas);

  window.DATA = DATA;

  console.log("math.js geladen — Mathematik & Flächen/Volumen hinzugefügt");
})();
