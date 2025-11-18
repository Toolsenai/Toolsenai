// Alle Kategorien & Umrechnungen
const categories = {
  "Länge": { "Meter":1,"Kilometer":1000,"Zentimeter":0.01,"Millimeter":0.001,"Meilen":1609.34,"Fuß":0.3048 },
  "Gewicht": { "Kilogramm":1,"Gramm":0.001,"Pfund":0.453592,"Unze":0.0283495 },
  "Volumen": { "Liter":1,"Milliliter":0.001,"Gallonen":3.78541,"Kubikmeter":1000 },
  "Geschwindigkeit": { "m/s":1,"km/h":0.277778,"mph":0.44704,"Knoten":0.514444 },
  "Energie": { "Joule":1,"Kilojoule":1000,"Kalorie":4.184,"kWh":3600000 },
  "Temperatur": { "Celsius":"C","Fahrenheit":"F","Kelvin":"K" },
  "Druck": { "Pascal":1,"Bar":100000,"Torr":133.322,"atm":101325 },
  "Datenmenge": { "Bit":1,"Byte":8,"Kilobyte":8*1024,"Megabyte":8*1024*1024,"Gigabyte":8*1024*1024*1024 },
  "Licht": { "Lumen":1,"Lux":1,"Footcandle":10.764 },
  "Physik": { "Newton":1,"Kilogramm-Kraft":9.80665,"Pfund-Kraft":4.44822 },
  "Chemie": { "Mol":1,"Millimol":0.001,"Mikromol":0.000001 },
  "Astronomie": { "Astronomische Einheit (AU)":1.496e+11,"Lichtjahr":9.461e+15,"Parsec":3.086e+16 },
  "Spezial": { "Electronvolt":1.60218e-19,"Footcandle":10.764,"Torr":133.322 }
};

// Kurzzeichen
const unitSymbols = {
  "Meter":"m","Kilometer":"km","Zentimeter":"cm","Millimeter":"mm","Meilen":"mi","Fuß":"ft",
  "Kilogramm":"kg","Gramm":"g","Pfund":"lb","Unze":"oz",
  "Liter":"l","Milliliter":"ml","Gallonen":"gal","Kubikmeter":"m³",
  "m/s":"m/s","km/h":"km/h","mph":"mph","Knoten":"kn",
  "Joule":"J","Kilojoule":"kJ","Kalorie":"cal","kWh":"kWh",
  "Celsius":"°C","Fahrenheit":"°F","Kelvin":"K",
  "Pascal":"Pa","Bar":"bar","Torr":"Torr","atm":"atm",
  "Bit":"b","Byte":"B","Kilobyte":"kB","Megabyte":"MB","Gigabyte":"GB",
  "Lumen":"lm","Lux":"lx","Footcandle":"fc",
  "Newton":"N","Kilogramm-Kraft":"kgf","Pfund-Kraft":"lbf",
  "Mol":"mol","Millimol":"mmol","Mikromol":"µmol",
  "Astronomische Einheit (AU)":"AU","Lichtjahr":"ly","Parsec":"pc",
  "Electronvolt":"eV"
};

// Referenzen
const categorySelect = document.getElementById("category");
const fromSelect = document.getElementById("fromUnit");
const toSelect = document.getElementById("toUnit");
const valueInput = document.getElementById("value");
const resultDiv = document.getElementById("result");

// Kategorien füllen
function updateUI() {
  categorySelect.innerHTML="";
  for(let cat in categories){
    const opt=document.createElement("option");
    opt.value=cat; opt.textContent=cat;
    categorySelect.appendChild(opt);
  }
  updateUnits();
}

// Einheiten für Kategorie füllen
function updateUnits(){
  const cat=categorySelect.value;
  const units=Object.keys(categories[cat]);
  fromSelect.innerHTML=""; toSelect.innerHTML="";
  units.forEach(u=>{
    const o1=document.createElement("option"); o1.value=u; o1.textContent=u; fromSelect.appendChild(o1);
    const o2=document.createElement("option"); o2.value=u; o2.textContent=u; toSelect.appendChild(o2);
  });
}

// Umrechnen
function convertAll(){
  const cat=categorySelect.value;
  const from=fromSelect.value;
  const to=toSelect.value;
  const val=parseFloat(valueInput.value);
  if(isNaN(val)){
    resultDiv.textContent="Bitte einen gültigen Wert eingeben";
    return;
  }
  let result, formula="";

  if(cat==="Temperatur"){
    if(from==="Celsius" && to==="Fahrenheit"){ result=val*9/5+32; formula=`${val} °C × 9/5 + 32 = ${result} °F`; }
    else if(from==="Fahrenheit" && to==="Celsius"){ result=(val-32)*5/9; formula=`(${val} °F -32) × 5/9 = ${result} °C`; }
    else if(from==="Celsius" && to==="Kelvin"){ result=val+273.15; formula=`${val} °C + 273.15 = ${result} K`; }
    else if(from==="Kelvin" && to==="Celsius"){ result=val-273.15; formula=`${val} K - 273.15 = ${result} °C`; }
    else if(from==="Fahrenheit" && to==="Kelvin"){ result=(val-32)*5/9+273.15; formula=`(${val} °F -32) ×5/9 +273.15 = ${result} K`; }
    else if(from==="Kelvin" && to==="Fahrenheit"){ result=(val-273.15)*9/5+32; formula=`(${val} K -273.15) ×9/5 +32 = ${result} °F`; }
    else { result=val; formula=`${val} ${from} → ${to}`; }
  } else {
    const fFrom=categories[cat][from], fTo=categories[cat][to];
    result=val*fFrom/fTo;
    formula=`${val} ${from} ÷ ${fTo/fFrom} = ${result} ${to}`;
  }

  const fromSym=unitSymbols[from]||from;
  const toSym=unitSymbols[to]||to;
  resultDiv.innerHTML=`${result} ${toSym} <br><small>Formel: ${formula}</small>`;
}

// Init
window.onload=()=>{ updateUI(); };
