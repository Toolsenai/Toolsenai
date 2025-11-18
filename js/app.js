(function(){
  const DATA = window.DATA;

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

  langSelect.addEventListener("change", e => { currentLang = e.target.value; populateCategories(); populateFormulas(); clearInputs(); });
  modeSelect.addEventListener("change", e => { currentMode = e.target.value; populateCategories(); populateFormulas(); clearInputs(); });
  categorySelect.addEventListener("change", e => { currentCategory = e.target.value; populateFormulas(); clearInputs(); });
  formulaSelect.addEventListener("change", e => { currentFormula = e.target.value; buildInputs(); });

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
      label.textContent = v+":";

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
      if(unitSelect.options.length>0) div.appendChild(unitSelect);

      const unitDisplay = document.createElement("span");
      unitDisplay.id = `unitDisplay-${v}`;
      unitDisplay.style.marginLeft = "8px";
      unitDisplay.style.fontWeight = "bold";
      unitDisplay.textContent = unitSelect.value || "";
      div.appendChild(unitDisplay);

      unitSelect.addEventListener("change", () => { unitDisplay.textContent = unitSelect.value; });

      inputFields.appendChild(div);
    });

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

  populateCategories();
})();
