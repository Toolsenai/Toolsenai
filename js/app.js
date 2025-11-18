/* js/app.js — ToolsenAI core (deutsche Version) */
/* -----------------------------
   Kernfeatures:
   - Kategorien (Converter / Calculator)
   - Viele Einheiten inkl. SI-Präfixe (yocto → yotta)
   - Formeln (elektrik, mechanik, volumen, geometrie, thermodynamik, licht, daten...)
   - Dynamische Eingabefelder für Zielvariable
   - Ergebnis-Einheiten (W→kW etc.)
   - Suchfunktion
   ----------------------------- */

(function(){
  // ---- Hilfsdaten ----
  const yearSpan = document.getElementById('year');
  if(yearSpan) yearSpan.textContent = new Date().getFullYear();

  const LANG = {de:'de', en:'en'};
  let lang = 'de';

  // SI Präfixe (scale factor)
  const SIPrefixes = {
    'y':1e-24,'z':1e-21,'a':1e-18,'f':1e-15,'p':1e-12,'n':1e-9,'µ':1e-6,'u':1e-6,'m':1e-3,
    'c':1e-2,'d':1e-1,'':1,'k':1e3,'M':1e6,'G':1e9,'T':1e12,'P':1e15,'E':1e18,'Z':1e21,'Y':1e24
  };

  // Einheitensymbole & hilfreiche Konstanten
  const unitSymbols = {
    "Meter":"m","Kilometer":"km","Zentimeter":"cm","Millimeter":"mm","Mikrometer":"µm","Nanometer":"nm",
    "Kilogramm":"kg","Gramm":"g","Milligramm":"mg",
    "Liter":"l","Milliliter":"ml","Kubikmeter":"m³",
    "Joule":"J","Kilojoule":"kJ","kWh":"kWh",
    "Watt":"W","Kilowatt":"kW","Milliwatt":"mW",
    "Celsius":"°C","Fahrenheit":"°F","Kelvin":"K",
    "Pascal":"Pa","Bar":"bar","Torr":"Torr","atm":"atm","psi":"psi",
    "Bit":"b","Byte":"B","Kilobyte":"kB","Megabyte":"MB","Gigabyte":"GB","Terabyte":"TB","Petabyte":"PB",
    "Lumen":"lm","Lux":"lx","Candela":"cd","Footcandle":"fc",
    "Newton":"N","Kilogramm-Kraft":"kgf","Pfund-Kraft":"lbf",
    "Mol":"mol","eV":"eV","Astronomische Einheit (AU)":"AU","Lichtjahr":"ly","Parsec":"pc"
  };

  // ------------------------
  // Datendefinition: Kategorien, Unterkategorien/Formeln, Einheiten
  // ------------------------
  const DATA = {
    "Länge": {
      type:"converter",
      units:{
        "Meter":1,"Kilometer":1000,"Zentimeter":0.01,"Millimeter":0.001,"Mikrometer":1e-6,"Nanometer":1e-9,
        "Meilen":1609.344,"Yard":0.9144,"Fuß":0.3048,"Zoll":0.0254
      }
    },
    "Gewicht": {
      type:"converter",
      units:{
        "Kilogramm":1,"Gramm":0.001,"Milligramm":1e-6,"Tonne":1000,"Pfund":0.45359237,"Unze":0.0283495231
      }
    },
    "Volumen": {
      type:"converter",
      units:{
        "Kubikmeter":1,"Liter":0.001,"Milliliter":1e-6,"Gallonen":0.00378541,"Pint":0.000473176
      }
    },
    "Temperatur": {
      type:"converter",
      units:{ "Celsius":"C","Fahrenheit":"F","Kelvin":"K" }
    },
    "Datenmenge": {
      type:"converter",
      units:{
        "Bit":1,"Byte":8,"Kilobyte":8*1024,"Megabyte":8*1024*1024,"Gigabyte":8*1024*1024*1024,
        "Terabyte":8*1024*1024*1024*1024,"Petabyte":8*Math.pow(1024,5)
      }
    },
    "Elektrik": {
      type:"calculator",
      formulas:{
        "P = U × I": {
          vars:["P","U","I"],
          units:{P:["W","kW","mW"], U:["V"], I:["A","mA"]},
          calc:function(values,target){
            // values: object with possibly P,U,I numeric (some may be undefined)
            // target: which variable to compute
            let P=values.P, U=values.U, I=values.I;
            if(target==='P'){ return {res:U*I, formula: `${U} V × ${I} A = ${U*I} W`}; }
            if(target==='U'){ return {res:P/I, formula: `${P} W ÷ ${I} A = ${P/I} V`}; }
            if(target==='I'){ return {res:P/U, formula: `${P} W ÷ ${U} V = ${P/U} A`}; }
          }
        },
        "Ohm: U = R × I": {
          vars:["U","R","I"],
          units:{U:["V"], R:["Ω","kΩ"], I:["A","mA"]},
          calc:function(values,target){
            let U=values.U,R=values.R,I=values.I;
            if(target==='U') return {res:R*I, formula:`${R} Ω × ${I} A = ${R*I} V`};
            if(target==='R') return {res:U/I, formula:`${U} V ÷ ${I} A = ${U/I} Ω`};
            if(target==='I') return {res:U/R, formula:`${U} V ÷ ${R} Ω = ${U/R} A`};
          }
        },
        "P = I² × R": {
          vars:["P","I","R"],
          units:{P:["W"], I:["A"], R:["Ω"]},
          calc:function(values,target){
            let P=values.P,I=values.I,R=values.R;
            if(target==='P') return {res: I*I*R, formula:`${I}² × ${R} = ${I*I*R} W`};
            if(target==='I') return {res: Math.sqrt(P/R), formula:`√(${P} ÷ ${R}) = ${Math.sqrt(P/R)} A`};
            if(target==='R') return {res: P/(I*I), formula:`${P} ÷ ${I}² = ${P/(I*I)} Ω`};
          }
        },
        "Transformator (U2/U1 = N2/N1)": {
          vars:["U1","U2","N1","N2"],
          units:{U1:["V"],U2:["V"],N1:["windings"],N2:["windings"]},
          calc:function(values,target){
            let U1=values.U1,U2=values.U2,N1=values.N1,N2=values.N2;
            if(target==='U2' && U1 && N2 && N1) return {res: U1*(N2/N1), formula:`U2 = U1 × N2/N1 = ${U1} × ${N2}/${N1} = ${U1*(N2/N1)} V`};
            if(target==='U1' && U2 && N1 && N2) return {res: U2*(N1/N2), formula:`U1 = U2 × N1/N2 = ${U2} × ${N1}/${N2} = ${U2*(N1/N2)} V`};
            if(target==='N2' && U1 && U2 && N1) return {res: N1*(U2/U1), formula:`N2 = N1 × U2/U1 = ${N1} × ${U2}/${U1} = ${N1*(U2/U1)} turns`};
            // fallback message
            return {res:null, formula:'Unzureichende Eingabewerte'};
          }
        }
      }
    },
    "Mechanik": {
      type:"calculator",
      formulas:{
        "F = m × a": {
          vars:["F","m","a"],
          units:{F:["N"], m:["kg"], a:["m/s²"]},
          calc:function(values,target){
            let F=values.F,m=values.m,a=values.a;
            if(target==='F') return {res:m*a, formula:`${m} kg × ${a} m/s² = ${m*a} N`};
            if(target==='m') return {res:F/a, formula:`${F} N ÷ ${a} m/s² = ${F/a} kg`};
            if(target==='a') return {res:F/m, formula:`${F} N ÷ ${m} kg = ${F/m} m/s²`};
          }
        },
        "KE = 1/2 m v²": {
          vars:["E","m","v"],
          units:{E:["J"],m:["kg"],v:["m/s"]},
          calc:function(values,target){
            let E=values.E,m=values.m,v=values.v;
            if(target==='E') return {res:0.5*m*v*v, formula:`0.5 × ${m} kg × ${v}² = ${0.5*m*v*v} J`};
            if(target==='v') return {res: Math.sqrt(2*E/m), formula:`v = √(2×${E} ÷ ${m}) = ${Math.sqrt(2*E/m)} m/s`};
            if(target==='m') return {res: 2*E/(v*v), formula:`m = 2×${E} ÷ ${v}² = ${2*E/(v*v)} kg`};
          }
        },
        "W = F × s": {
          vars:["W","F","s"],
          units:{W:["J"],F:["N"],s:["m"]},
          calc:function(values,target){
            let W=values.W,F=values.F,s=values.s;
            if(target==='W') return {res:F*s, formula:`${F} N × ${s} m = ${F*s} J`};
            if(target==='F') return {res:W/s, formula:`${W} J ÷ ${s} m = ${W/s} N`};
            if(target==='s') return {res:W/F, formula:`${W} J ÷ ${F} N = ${W/F} m`};
          }
        }
      }
    },
    "Geometrie": {
      type:"calculator",
      formulas:{
        "Quader: V = l × b × h": {
          vars:["V","l","b","h"],
          units:{V:["m³","L"], l:["m"], b:["m"], h:["m"]},
          calc:function(values,target){
            let V=values.V,l=values.l,b=values.b,h=values.h;
            if(target==='V') return {res:l*b*h, formula:`${l} × ${b} × ${h} = ${l*b*h} m³`};
            if(target==='l') return {res:V/(b*h), formula:`l = ${V} ÷ (${b} × ${h}) = ${V/(b*h)} m`};
            if(target==='b') return {res:V/(l*h), formula:`b = ${V} ÷ (${l} × ${h}) = ${V/(l*h)} m`};
            if(target==='h') return {res:V/(l*b), formula:`h = ${V} ÷ (${l} × ${b}) = ${V/(l*b)} m`};
          }
        },
        "Zylinder: V = π r² h": {
          vars:["V","r","h"],
          units:{V:["m³"], r:["m"], h:["m"]},
          calc:function(values,target){
            let V=values.V,r=values.r,h=values.h;
            if(target==='V') return {res:Math.PI*r*r*h, formula:`π × ${r}² × ${h} = ${Math.PI*r*r*h} m³`};
            if(target==='r') return {res:Math.sqrt(V/(Math.PI*h)), formula:`r = √(${V} ÷ (π × ${h})) = ${Math.sqrt(V/(Math.PI*h))} m`};
            if(target==='h') return {res:V/(Math.PI*r*r), formula:`h = ${V} ÷ (π × ${r}²) = ${V/(Math.PI*r*r)} m`};
          }
        },
        "Kugel: V = 4/3 π r³": {
          vars:["V","r"],
          units:{V:["m³"], r:["m"]},
          calc:function(values,target){
            let V=values.V,r=values.r;
            if(target==='V') return {res:4/3*Math.PI*r*r*r, formula:`4/3 × π × ${r}³ = ${4/3*Math.PI*r*r*r} m³`};
            if(target==='r') return {res: Math.cbrt((3*V)/(4*Math.PI)), formula:`r = ³√(3×${V} ÷ (4×π)) = ${Math.cbrt((3*V)/(4*Math.PI))} m`};
          }
        }
      }
    },
    "Licht": {
      type:"converter",
      units:{
        "Lumen":1,"Lux":1,"Candela":1,"Footcandle":10.764
      }
    },
    "Druck": {
      type:"converter",
      units:{
        "Pascal":1,"kPa":1000,"bar":100000,"Torr":133.322,"atm":101325,"psi":6894.76
      }
    },
    "Chemie": {
      type:"calculator",
      formulas:{
        "n = m / M (Mol)": {
          vars:["n","m","M"],
          units:{n:["mol"],m:["g","kg"],M:["g/mol"]},
          calc:function(values,target){
            let n=values.n,m=values.m,M=values.M;
            if(target==='n') return {res: m / M, formula:`n = ${m} ÷ ${M} = ${m/M} mol`};
            if(target==='m') return {res: n * M, formula:`m = ${n} × ${M} = ${n*M} g`};
            if(target==='M') return {res: m / n, formula:`M = ${m} ÷ ${n} = ${m/n} g/mol`};
          }
        }
      }
    },
    "Spezial": {
      type:"converter",
      units:{
        "Elektronvolt (eV)":1.602176634e-19,"Joule":1,"Torr":133.322,"Footcandle":10.764
      }
    }
  }; // END DATA

  // ---------- UI Elements ----------
  const categoryList = document.getElementById('categoryList');
  const subSelect = document.getElementById('subSelect');
  const targetSelect = document.getElementById('targetSelect');
  const inputForm = document.getElementById('inputForm');
  const calculateBtn = document.getElementById('calculateBtn');
  const resultBox = document.getElementById('resultBox');
  const formulaText = document.getElementById('formulaText');
  const modeSelect = document.getElementById('modeSelect');
  const globalSearch = document.getElementById('globalSearch');
  const resultUnitSelect = document.getElementById('resultUnitSelect');
  const swapBtn = document.getElementById('swapBtn');
  const langSelect = document.getElementById('langSelect');

  // Helper: populate category list
  function buildCategoryList(){
    categoryList.innerHTML='';
    Object.keys(DATA).forEach(cat=>{
      const li=document.createElement('li'); li.textContent=cat;
      li.onclick=()=>{ selectCategory(cat); highlightCategory(cat); };
      categoryList.appendChild(li);
    });
    // highlight first
    highlightCategory(Object.keys(DATA)[0]);
    selectCategory(Object.keys(DATA)[0]);
  }

  function highlightCategory(cat){
    [...categoryList.children].forEach(li=>{
      li.classList.toggle('active', li.textContent===cat);
    });
  }

  // select category and populate subSelect
  let currentCategory = null, currentEntry = null;
  function selectCategory(cat){
    currentCategory=cat;
    const entry = DATA[cat];
    currentEntry = entry;
    subSelect.innerHTML='';
    if(entry.type==='converter'){
      const opt=document.createElement('option'); opt.value='__converter__'; opt.text='Einheiten-Umrechner'; subSelect.appendChild(opt);
      // populate result unit select
      buildUnitResultOptions(Object.keys(entry.units));
      // clear targetSelect
      targetSelect.innerHTML='';
    } else if(entry.type==='calculator'){
      Object.keys(entry.formulas).forEach(fn=>{
        const o=document.createElement('option'); o.value=fn; o.textContent=fn; subSelect.appendChild(o);
      });
      // first formula selected populate target
      populateTargetsForFormula(Object.keys(entry.formulas)[0]);
    }
    // update UI
    updateInputs();
  }

  function buildUnitResultOptions(unitList){
    resultUnitSelect.innerHTML='';
    unitList.forEach(u=>{
      const o=document.createElement('option'); o.value=u; o.textContent= u + (unitSymbols[u]?` (${unitSymbols[u]})`:'' );
      resultUnitSelect.appendChild(o);
    });
  }

  // when formula selected: populate targetSelect with variables
  function populateTargetsForFormula(fnKey){
    targetSelect.innerHTML='';
    const f = currentEntry.formulas[fnKey];
    f.vars.forEach(v=>{
      const o=document.createElement('option'); o.value=v; o.textContent=v; targetSelect.appendChild(o);
    });
    // set default target first var
    targetSelect.value = f.vars[0];
    // update result unit options
    fillResultUnitsForFormula(f);
    updateInputs();
  }

  function fillResultUnitsForFormula(f){
    resultUnitSelect.innerHTML='';
    // try to use f.units for the target variable
    Object.keys(f.units || {}).forEach(k=>{
      // if array provided
      const arr = f.units[k];
      arr.forEach(u=>{
        const o=document.createElement('option'); o.value=u; o.textContent = `${u} ${unitSymbols[u] ? '('+unitSymbols[u]+')':''}`;
        resultUnitSelect.appendChild(o);
      });
    });
  }

  // create input fields for selected formula or converter
  function updateInputs(){
    inputForm.innerHTML='';
    formulaText.textContent='';
    // mode
    const mode = modeSelect.value;
    if(mode === 'converter'){
      // converter: from unit, to unit, value
      const cat = currentCategory;
      const entry = DATA[cat];
      if(!entry || entry.type!=='converter') return;
      createInputRow('value','Wert', 'number');
      // from unit
      const fromSel = document.createElement('select'); fromSel.id='fromUnitSelect';
      Object.keys(entry.units).forEach(u=>{
        const o=document.createElement('option'); o.value=u; o.textContent=u+' '+(unitSymbols[u]?`(${unitSymbols[u]})`:''); fromSel.appendChild(o);
      });
      const row1 = createLabeledElement('Von', fromSel);
      inputForm.appendChild(row1);
      // to unit
      const toSel = document.createElement('select'); toSel.id='toUnitSelect';
      Object.keys(entry.units).forEach(u=>{
        const o=document.createElement('option'); o.value=u; o.textContent=u+' '+(unitSymbols[u]?`(${unitSymbols[u]})`:''); toSel.appendChild(o);
      });
      const row2 = createLabeledElement('Nach', toSel);
      inputForm.appendChild(row2);
    } else {
      // calculator
      const fnKey = subSelect.value;
      const formula = currentEntry.formulas[fnKey];
      if(!formula) return;
      // determine target variable
      const target = targetSelect.value || formula.vars[0];
      // create input rows for all variables except target
      formula.vars.forEach(v=>{
        if(v===target) return;
        const type = 'number';
        createInputRow(v, v, type);
      });
      // show note which variable is calculated
      const note = document.createElement('div'); note.style.color='#0b76ff'; note.style.marginTop='6px';
      note.textContent = `Berechne: ${target}`;
      inputForm.appendChild(note);
    }
  }

  // helper to create input rows
  function createInputRow(id,label,type='text'){
    const div = document.createElement('div'); div.className='input-row';
    const lab = document.createElement('label'); lab.textContent=label;
    let input;
    if(type==='select'){
      input = document.createElement('select');
    } else {
      input = document.createElement('input'); input.type=type;
    }
    input.id = `input_${id}`;
    div.appendChild(lab); div.appendChild(input);
    inputForm.appendChild(div);
    return div;
  }

  function createLabeledElement(labelText, element){
    const div=document.createElement('div'); div.className='input-row';
    const lab=document.createElement('label'); lab.textContent=labelText;
    div.appendChild(lab); div.appendChild(element);
    return div;
  }

  // perform calculation (converter or calculator)
  function performCalculation(){
    const mode = modeSelect.value;
    if(mode==='converter'){
      const cat = currentCategory; const entry = DATA[cat];
      const from = document.getElementById('fromUnitSelect').value;
      const to = document.getElementById('toUnitSelect').value;
      const val = parseFloat(document.getElementById('input_value').value);
      if(isNaN(val)){ showResult('Bitte gültigen Wert eingeben'); return; }
      if(entry.units[from]===undefined || entry.units[to]===undefined){ showResult('Einheit nicht gefunden'); return; }
      // temperature special
      if(cat==='Temperatur'){ // handle temps
        const r = convertTemperature(val,from,to);
        showResultFormatted(r, `${val} ${from} → ${r} ${unitSymbols[to]||to}`, `${val} ${from} → ${r} ${to}`);
        return;
      }
      const baseFrom = entry.units[from];
      const baseTo = entry.units[to];
      const res = val * baseFrom / baseTo;
      const formula = `${val} ${from} ÷ ${baseTo/baseFrom} = ${res} ${to}`;
      showResultFormatted(res + ' ' + (unitSymbols[to]||to), res + ' ' + (unitSymbols[to]||to), formula);
      return;
    } else {
      // calculator
      const fnKey = subSelect.value;
      const formula = currentEntry.formulas[fnKey];
      const target = targetSelect.value;
      // collect values
      const vals = {};
      formula.vars.forEach(v=>{
        const el = document.getElementById('input_'+v);
        if(el) vals[v] = parseFloat(el.value);
        else vals[v] = undefined;
      });
      // call calc
      const out = formula.calc(vals, target);
      if(!out || out.res===null || out.res===undefined){ showResult('Nicht genügend Eingabewerte'); formulaText.textContent = out?out.formula:''; return; }
      // format result with possible unit from formula.units[target]
      let unit = '';
      if(formula.units && formula.units[target] && formula.units[target].length>0) unit = ' ' + formula.units[target][0];
      showResultFormatted(out.res + (unit?(' '+unit):''), out.res + (unit?(' '+unit):''), out.formula);
    }
  }

  function convertTemperature(val, from, to){
    if(from==='Celsius' && to==='Fahrenheit') return (val*9/5+32);
    if(from==='Fahrenheit' && to==='Celsius') return ((val-32)*5/9);
    if(from==='Celsius' && to==='Kelvin') return (val+273.15);
    if(from==='Kelvin' && to==='Celsius') return (val-273.15);
    if(from==='Fahrenheit' && to==='Kelvin') return ((val-32)*5/9+273.15);
    if(from==='Kelvin' && to==='Fahrenheit') return ((val-273.15)*9/5+32);
    return val;
  }

  function showResult(text){
    resultBox.textContent = text;
    formulaText.textContent = '';
  }
  function showResultFormatted(displayText, simpleText, formulaStr){
    resultBox.textContent = displayText;
    formulaText.textContent = formulaStr;
  }

  // event handlers
  subSelect.onchange = function(){
    const entry = currentEntry;
    if(entry && entry.type==='calculator') populateTargetsForFormula(subSelect.value);
    updateInputs();
  };
  targetSelect.onchange = updateInputs;
  modeSelect.onchange = function(){
    // select first category that matches mode
    const first = Object.keys(DATA).find(k=>DATA[k].type===modeSelect.value) || Object.keys(DATA)[0];
    selectCategory(first);
  };
  calculateBtn.onclick = function(e){ e.preventDefault(); performCalculation(); };
  swapBtn.onclick = function(e){
    e.preventDefault();
    // swap from/to units if in converter mode
    if(modeSelect.value==='converter'){
      const f = document.getElementById('fromUnitSelect');
      const t = document.getElementById('toUnitSelect');
      const tmp = f.value; f.value=t.value; t.value=tmp;
    }
  };

  // search function: matches category, formula or unit name
  globalSearch.oninput = function(){
    const q = globalSearch.value.trim().toLowerCase();
    if(!q){ // reset
      buildCategoryList();
      return;
    }
    // search categories & formulas & units
    const hits = [];
    Object.keys(DATA).forEach(cat=>{
      const entry = DATA[cat];
      if(cat.toLowerCase().includes(q)) hits.push(cat);
      if(entry.type==='converter'){
        Object.keys(entry.units).forEach(u=>{
          if(u.toLowerCase().includes(q)) hits.push(cat);
        });
      } else {
        Object.keys(entry.formulas).forEach(fn=>{
          if(fn.toLowerCase().includes(q)) hits.push(cat);
          (entry.formulas[fn].vars || []).forEach(v=>{
            if(v.toLowerCase().includes(q)) hits.push(cat);
          });
        });
      }
    });
    // dedupe
    const unique = [...new Set(hits)];
    if(unique.length>0) {
      // show only matches in sidebar
      categoryList.innerHTML='';
      unique.forEach(cat=>{ const li=document.createElement('li'); li.textContent=cat; li.onclick=()=>{ selectCategory(cat); highlightCategory(cat);} ; categoryList.appendChild(li); });
      // auto-select first
      selectCategory(unique[0]);
      highlightCategory(unique[0]);
    } else {
      categoryList.innerHTML='<li>Keine Treffer</li>';
    }
  };

  // language selection
  langSelect.onchange = function(){ lang = langSelect.value; /* later translate UI */ };

  // initial build
  buildCategoryList();

  // expose for debugging
  window.TOOL = {DATA, SIPrefixes, unitSymbols};
})();
