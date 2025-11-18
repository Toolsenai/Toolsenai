// translations.js
// Labels für Deutsch / Englisch
const labels = {
  de: {
    category: "Kategorie wählen",
    fromUnit: "Von Einheit",
    toUnit: "Zu Einheit",
    value: "Wert eingeben",
    result: "Ergebnis",
    formula: "Formel",
    error: "Bitte alle Felder korrekt ausfüllen!"
  },
  en: {
    category: "Select category",
    fromUnit: "From unit",
    toUnit: "To unit",
    value: "Enter value",
    result: "Result",
    formula: "Formula",
    error: "Please fill in all fields correctly!"
  }
};

let lang = 'de'; // Standard Sprache

// Sprache umschalten
function updateUI() {
  lang = document.getElementById('language').value;
  updateCategories();
  updateUnits();
  document.getElementById('value').placeholder = labels[lang].value;
}

// Kategorie Dropdown füllen
function updateCategories() {
  const category = document.getElementById('category');
  category.innerHTML = `<option value="">${labels[lang].category}</option>`;
  for (let key in conversions) {
    let opt = document.createElement('option');
    opt.value = key;
    opt.text = conversions[key].label[lang];
    category.add(opt);
  }
}
