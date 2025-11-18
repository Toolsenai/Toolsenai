(function(){
  const DATA = window.DATA || {};
  const TRANSLATIONS = window.TRANSLATIONS || {};
  let lang = "de";

  const container = document.getElementById("converter-container");

  // Kategorie
  const categorySelect = document.createElement("select");
  categorySelect.id="categorySelect";
  container.appendChild(categorySelect);

  // Sprache
  const langSelect = document.createElement("select");
  langSelect.id="langSelect";
  const optDe=document.createElement("option"); optDe.value="de"; optDe.textContent="Deutsch";
  const optEn=document.createElement("option"); optEn.value="en"; optEn.textContent="English";
  langSelect.appendChild(optDe); langSelect.appendChild(optEn);
  container.appendChild(langSelect);

  // Formel
  const formulaSelect = document.createElement("select");
  formulaSelect.id="formulaSelect";
  container.appendChild(formulaSelect);

  // Eingabe + Ergebnis
  const inputDiv = document.createElement("div");
  inputDiv.id="inputDiv";
  container.appendChild(inputDiv);

  const resultDiv = document.createElement("div");
  resultDiv.id="resultDiv";
  container.appendChild(resultDiv);

  langSelect.addEventListener("change", ()=>{ lang=langSelect.value; renderForm(); });
  categorySelect.addEventListener("change", ()=>{ renderForm(); });
  formulaSelect.addEventListener("change", ()=>{ renderForm(); });

  function renderForm(){
    const T = TRANSLATIONS[lang] || {};
    // Kategorie Dropdown füllen
    categorySelect.innerHTML="";
    for(const cat in DATA){
      const opt = document.createElement("option");
      opt.value=cat;
      opt.textContent=cat;
      categorySelect.appendChild(opt);
    }

    // Formeln Dropdown füllen
    const category = categorySelect.value;
    const formulas = DATA[category]?.formulas || {};
    formulaSelect.innerHTML="";
    for(const f in formulas){
      const opt = document.createElement("option");
      opt.value=f;
      opt.textContent=T.formulas && T.formulas[f] ? T.formulas[f] : f;
      formulaSelect.appendChild(opt);
    }

    // Eingabefelder
    inputDiv.innerHTML="";
    resultDiv.innerHTML="";
    const selectedFormula = formulaSelect.value;
    if(!selectedFormula) return;

    const vars = formulas[selectedFormula].vars;
    const units = formulas[selectedFormula].units;

    vars.forEach(v=>{
      const div = document.createElement("div");
      const label = document.createElement("label");
      label.textContent=v + ": "; div.appendChild(label);

      const input = document.createElement("input");
      input.id="input_"+v; input.type="number"; div.appendChild(input);

      if(units[v]){
        const uSelect = document.createElement("select");
        uSelect.id="unit_"+v;
        units[v].forEach(u=>{
          const uOpt=document.createElement("option"); uOpt.value=u; uOpt.textContent=u; uSelect.appendChild(uOpt);
        });
        div.appendChild(uSelect);
      }
      inputDiv.appendChild(div);
    });

    // Zielvariable
    const targetDiv=document.createElement("div");
    const targetLabel=document.createElement("label");
    targetLabel.textContent = T.targetVariable || "Zielvariable" + ": ";
    targetDiv.appendChild(targetLabel);

    const targetSelect = document.createElement("select");
    targetSelect.id="targetSelect";
    vars.forEach(v=>{
      const opt = document.createElement("option");
      opt.value=v; opt.textContent=v;
      targetSelect.appendChild(opt);
    });
    targetDiv.appendChild(targetSelect);
    inputDiv.appendChild(targetDiv);

    // Button
    const btn=document.createElement("button");
    btn.textContent = T.calculate || "Berechnen";
    btn.addEventListener("click", calculate);
    inputDiv.appendChild(btn);
  }

  function calculate(){
    const category = categorySelect.value;
    const selectedFormula=formulaSelect.value;
    const formulaObj = DATA[category].formulas[selectedFormula];
    const vars = formulaObj.vars;
    const values = {};

    vars.forEach(v=>{
      const val = document.getElementById("input_"+v)?.value;
      values[v] = val ? parseFloat(val) : null;
    });

    const target = document.getElementById("targetSelect").value;
    const res = formulaObj.calc(values, target);
    resultDiv.innerHTML=`<strong>Ergebnis:</strong> ${res.res} <br><em>${res.formula}</em>`;
  }

  renderForm();
})();
