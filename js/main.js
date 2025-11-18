/* js/main.js
   Hauptsteuerung: Interface & Berechnung
   --------------------------------------------------------------- */

(function(){
  const DATA = window.DATA || {};

  // Initiale Sprache
  let lang = "de"; // "en" für Englisch

  // Container vorbereiten
  const container = document.getElementById("converter-container");
  if(!container){
    const c=document.createElement("div");
    c.id="converter-container";
    document.body.appendChild(c);
  }

  const converterContainer = document.getElementById("converter-container");

  // Kategorie-Auswahl
  const categorySelect = document.createElement("select");
  categorySelect.id="categorySelect";
  for(const cat in DATA){
    const opt = document.createElement("option");
    opt.value=cat;
    opt.textContent=cat;
    categorySelect.appendChild(opt);
  }
  converterContainer.appendChild(categorySelect);

  // Sprache wechseln
  const langSelect = document.createElement("select");
  langSelect.id="langSelect";
  const optDe=document.createElement("option"); optDe.value="de"; optDe.textContent="Deutsch";
  const optEn=document.createElement("option"); optEn.value="en"; optEn.textContent="English";
  langSelect.appendChild(optDe); langSelect.appendChild(optEn);
  converterContainer.appendChild(langSelect);

  langSelect.addEventListener("change",()=>{ lang=langSelect.value; renderForm(); });
  categorySelect.addEventListener("change",()=>{ renderForm(); });

  // Ziel-Formel Auswahl
  const formulaSelect = document.createElement("select");
  formulaSelect.id="formulaSelect";
  converterContainer.appendChild(formulaSelect);

  formulaSelect.addEventListener("change",()=>{ renderForm(); });

  // Eingabe-Bereich
  const inputDiv = document.createElement("div");
  inputDiv.id="inputDiv";
  converterContainer.appendChild(inputDiv);

  // Ergebnisbereich
  const resultDiv = document.createElement("div");
  resultDiv.id="resultDiv";
  converterContainer.appendChild(resultDiv);

  // Render-Funktion
  function renderForm(){
    const category = categorySelect.value;
    const formulas = DATA[category]?.formulas || {};
    
    // Formel-Liste füllen
    formulaSelect.innerHTML="";
    for(const f in formulas){
      const opt=document.createElement("option");
      opt.value=f;
      opt.textContent=f;
      formulaSelect.appendChild(opt);
    }

    // Eingabefelder erstellen
    const selectedFormula=formulaSelect.value;
    inputDiv.innerHTML="";
    resultDiv.innerHTML="";

    if(!selectedFormula) return;

    const vars=formulas[selectedFormula].vars;
    const units=formulas[selectedFormula].units;

    vars.forEach(v=>{
      const div=document.createElement("div");
      div.style.marginBottom="5px";

      const label=document.createElement("label");
      label.textContent=v+": ";
      div.appendChild(label);

      const input=document.createElement("input");
      input.id="input_"+v;
      input.type="number";
      div.appendChild(input);

      if(units[v]){
        const uSelect=document.createElement("select");
        uSelect.id="unit_"+v;
        units[v].forEach(u=>{
          const uOpt=document.createElement("option"); uOpt.value=u; uOpt.textContent=u;
          uSelect.appendChild(uOpt);
        });
        div.appendChild(uSelect);
      }
      inputDiv.appendChild(div);
    });

    const targetDiv=document.createElement("div");
    targetDiv.style.marginTop="5px";
    const targetLabel=document.createElement("label");
    targetLabel.textContent="Zielvariable: ";
    targetDiv.appendChild(targetLabel);
    const targetSelect=document.createElement("select");
    targetSelect.id="targetSelect";
    vars.forEach(v=>{
      const vOpt=document.createElement("option"); vOpt.value=v; vOpt.textContent=v;
      targetSelect.appendChild(vOpt);
    });
    targetDiv.appendChild(targetSelect);
    inputDiv.appendChild(targetDiv);

    const btn=document.createElement("button");
    btn.textContent="Berechnen";
    btn.style.marginTop="10px";
    btn.addEventListener("click",calculate);
    inputDiv.appendChild(btn);
  }

  function calculate(){
    const category = categorySelect.value;
    const selectedFormula=formulaSelect.value;
    const formulaObj = DATA[category].formulas[selectedFormula];
    const vars=formulaObj.vars;
    const values={};

    vars.forEach(v=>{
      const val=document.getElementById("input_"+v)?.value;
      const unit=document.getElementById("unit_"+v)?.value;
      values[v]=val?parseFloat(val):null;
      // hier können wir später Einheit umrechnen falls nötig
    });

    const target=document.getElementById("targetSelect").value;
    const res=formulaObj.calc(values,target);
    resultDiv.innerHTML=`<strong>Ergebnis:</strong> ${res.res} <br><em>${res.formula}</em>`;
  }

  renderForm();

})();
