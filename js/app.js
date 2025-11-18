/* ============================================
   ToolsenAI - Universal Converter & Calculator
   Version 1 – Grundsystem
   ============================================ */

/* --------------------
   Kategorien / Module
-------------------- */
const categories = {
    electricity: {
        name: "Elektrik",
        formulas: {
            "Leistung (P)": {
                calcOptions: {
                    P: { need: ["U", "I"], formula: d => d.U * d.I, unit: "W" },
                    U: { need: ["P", "I"], formula: d => d.P / d.I, unit: "V" },
                    I: { need: ["P", "U"], formula: d => d.P / d.U, unit: "A" }
                }
            },
            "Widerstand (R)": {
                calcOptions: {
                    R: { need: ["U", "I"], formula: d => d.U / d.I, unit: "Ω" },
                    U: { need: ["R", "I"], formula: d => d.R * d.I, unit: "V" },
                    I: { need: ["U", "R"], formula: d => d.U / d.R, unit: "A" }
                }
            }
        }
    },

    length: {
        name: "Länge",
        formulas: {
            "Längenumrechnung": {
                calcOptions: {
                    convert: {
                        need: ["value", "from", "to"],
                        formula: d => d.value * lengthFactors[d.from] / lengthFactors[d.to],
                        unit: ""
                    }
                }
            }
        }
    }
};

/* --------------------------------
   Einheitenfaktoren – Länge
--------------------------------- */
const lengthFactors = {
    km: 1_000,
    m: 1,
    dm: 0.1,
    cm: 0.01,
    mm: 0.001,
    µm: 0.000001,
    nm: 0.000000001
};

/* -----------------------------
   DOM Elemente
------------------------------ */
const categorySelect = document.getElementById("categorySelect");
const formulaSelect = document.getElementById("formulaSelect");
const targetSelect = document.getElementById("targetSelect");
const inputForm = document.getElementById("inputForm");
const resultBox = document.getElementById("resultBox");
const formulaDetail = document.getElementById("formulaDetail");

/* ------------------------------------
   Kategorien laden
------------------------------------ */
Object.keys(categories).forEach(key => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = categories[key].name;
    categorySelect.appendChild(opt);
});

/* ------------------------------------
   Formeln laden nach Kategorie
------------------------------------ */
categorySelect.addEventListener("change", () => {
    formulaSelect.innerHTML = "<option value=''>Formel wählen</option>";
    targetSelect.innerHTML = "<option value=''>Zielgröße</option>";
    inputForm.innerHTML = "";
    resultBox.textContent = "";
    formulaDetail.textContent = "";

    const cat = categories[categorySelect.value];
    if (!cat) return;

    Object.keys(cat.formulas).forEach(f => {
        const opt = document.createElement("option");
        opt.value = f;
        opt.textContent = f;
        formulaSelect.appendChild(opt);
    });
});

/* ------------------------------------
   Zielgrößen laden
------------------------------------ */
formulaSelect.addEventListener("change", () => {
    targetSelect.innerHTML = "<option value=''>Welche Größe berechnen?</option>";
    inputForm.innerHTML = "";
    resultBox.textContent = "";
    formulaDetail.textContent = "";

    const cat = categories[categorySelect.value];
    const formula = cat.formulas[formulaSelect.value];
    if (!formula) return;

    Object.keys(formula.calcOptions).forEach(target => {
        const opt = document.createElement("option");
        opt.value = target;
        opt.textContent = target;
        targetSelect.appendChild(opt);
    });
});

/* ------------------------------------
   Eingabefelder je Zielgröße bauen
------------------------------------ */
targetSelect.addEventListener("change", () => {
    inputForm.innerHTML = "";
    resultBox.textContent = "";
    formulaDetail.textContent = "";

    const cat = categories[categorySelect.value];
    const formula = cat.formulas[formulaSelect.value];
    const target = formula.calcOptions[targetSelect.value];

    target.need.forEach(n => {
        const div = document.createElement("div");
        div.classList.add("input-field");

        div.innerHTML = `
            <label>${n}</label>
            <input type="number" step="any" id="in_${n}">
        `;

        inputForm.appendChild(div);
    });
});

/* ------------------------------------
   Berechnung
------------------------------------ */
document.getElementById("calcBtn").addEventListener("click", () => {
    const cat = categories[categorySelect.value];
    const formula = cat.formulas[formulaSelect.value];
    const target = formula.calcOptions[targetSelect.value];

    let data = {};
    target.need.forEach(n => {
        data[n] = parseFloat(document.getElementById("in_" + n).value);
    });

    if (Object.values(data).some(v => isNaN(v))) {
        resultBox.textContent = "Bitte alle Eingaben machen!";
        return;
    }

    const result = target.formula(data);

    resultBox.textContent = `${targetSelect.value} = ${result} ${target.unit}`;

    formulaDetail.textContent = `Benutzt: ${targetSelect.value} = f(${target.need.join(", ")})`;
});
