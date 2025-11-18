// js/modules/physics.js
window.DATA = window.DATA || {};

DATA["Physik"] = {
    type: "calculator",
    formulas: {
        "Elektrische Leistung": {
            vars: ["Spannung (V)", "Strom (A)", "Leistung (W)"],
            units: {
                "Spannung (V)": ["V"],
                "Strom (A)": ["A"],
                "Leistung (W)": ["W", "kW", "mW"]
            },
            calc: function(values, target){
                let res = {};
                if(target === "Leistung (W)"){
                    res.value = values["Spannung (V)"]*values["Strom (A)"];
                    res.formula = `P = ${values["Spannung (V)"]} * ${values["Strom (A)"]} = ${res.value} W`;
                } else if(target === "Spannung (V)"){
                    res.value = values["Leistung (W)"]/values["Strom (A)"];
                    res.formula = `U = ${values["Leistung (W)"]} / ${values["Strom (A)"]} = ${res.value} V`;
                } else if(target === "Strom (A)"){
                    res.value = values["Leistung (W)"]/values["Spannung (V)"];
                    res.formula = `I = ${values["Leistung (W)"]} / ${values["Spannung (V)"]} = ${res.value} A`;
                }
                return res;
            }
        }
    }
};
