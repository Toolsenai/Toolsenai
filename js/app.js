/* js/app.js
   ToolsenAI – Zentrale Steuerung
   --------------------------------------------------------------- */

(function(){
  const DATA = window.DATA;
  const unitFactors = window.unitFactors || {};

  const langSelect = document.getElementById("langSelect");
  const modeSelect = document.getElementById("modeSelect");
  const categorySelect = document.getElementById("categorySelect");
  const formulaSelect = document.getElementById("formulaSelect");
  const inputFields = document.getElementById("inputFields");
  const resultDisplay = document.getElementById("resultDisplay");

  let currentLang = "de";
  let currentMode = "calculator";
  let currentCategory = "";
  let currentFormula = "";

  // Sprache wechseln
  langSelect.addEventListener("change", e => {
    currentLang = e.target.value;
    populateCategories();
    populateFormulas();
    clearInputs();
  });

  // Modus wechseln
  modeSelect.addEventListener("change", e => {
    currentMode = e.target.value;
    populateCategories();
    populateFormulas();
    clearInputs();
  });

  // Kategorie wechseln
  categorySelect.addEventListener("change", e => {
    currentCategory = e.target.value;
    populateFormulas();
    clearInputs();
  });

  // Formel wechseln
  formulaSelect.addEventListener("change", e => {
    currentFormula = e.target.value;
    buildInputs();
  });

  function populateCategories(){
    categorySelect.innerHTML = `<option value="">-- wählen --</option>`;
    Object.keys(DATA).forEach(cat => {
      if(DATA[cat].type === currentMode){
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
      }
    });
  }

  function populateFormulas(){
    formulaSelect.innerHTML = `<option value="">-- wählen --</option>`;
    if(!currentCategory || !DATA[currentCategory]) return;
    const formulas = DATA[currentCategory].formulas;
    Object.keys(formulas).forEach(f => {
      const option = document.createElement("option");
      option.value = f;
      option.textContent = f;
      formulaSelect.appendChild(option);
    });
  }

  function clearInputs(){
    inputFields.innerHTML = "";
    resultDisplay.textContent = "";
  }

  function buildInputs(){
    clearInputs();
    if(!currentCategory || !currentFormula) return;
    const formulaObj = DATA[currentCategory].formulas[currentFormula];
    formulaObj.vars.forEach(v => {
      const div = document.createElement("div");
      div.className = "inputGroup";

      const label = document.createElement("label");
      label.textContent = v + ":";

      const input = document.createElement("input");
      input.type = "number";
      input.id = `input-${v}`;

      const unitSelect = document.createElement("select");
      (formulaObj.units[v] || []).forEach(u => {
        const opt = document.createElement("option");
        opt.value = u;
        opt.textContent = u;
        unitSelect.appendChild(opt);
      });

      div.appendChild(label);
      div.appendChild(input);
      if(unitSelect.options.length > 0) div.appendChild(unitSelect);

      inputFields.appendChild(div);
    });

    // Target select
    const targetDiv = document.createElement("div");
    targetDiv.className = "inputGroup";
    const label = document.createElement("label");
    label.textContent = "Berechne:";
    const targetSelect = document.createElement("select");
    targetSelect.id = "targetSelect";
    formulaObj.vars.forEach(v => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      targetSelect.appendChild(opt);
    });
    targetDiv.appendChild(label);
    targetDiv.appendChild(targetSelect);
    inputFields.appendChild(targetDiv);

    // Button
    const btn = document.createElement("button");
    btn.textContent = "Berechnen";
    btn.addEventListener("click", runCalculation);
    inputFields.appendChild(btn);
  }

  function runCalculation(){
    const formulaObj = DATA[currentCategory].formulas[currentFormula];
    const values = {};
    formulaObj.vars.forEach(v => {
      const input = document.getElementById(`input-${v}`);
      const val = parseFloat(input.value);
      values[v] = Number.isNaN(val)?null:val;
    });
    const targetSelect = document.getElementById("targetSelect");
    const target = targetSelect.value;

    const result = formulaObj.calc(values,target);
    resultDisplay.textContent = result.formula;
  }

  // Initial
  populateCategories();
})();
