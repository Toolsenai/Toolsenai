// js/modules/chemistry.js
window.DATA = window.DATA || {};

DATA["Chemie"] = {
    type: "calculator",
    formulas: {
        "Molmasse": {
            vars: ["Masse (g)", "Mol (mol)", "Molmasse (g/mol)"],
            units: {
                "Masse (g)": ["g"],
                "Mol (mol)": ["mol"],
                "Molmasse (g/mol)": ["g/mol"]
            },
            calc: function(values, target){
                let res = {};
                if(target === "Molmasse (g/mol)"){
                    res.value = values["Masse (g)"]/values["Mol (mol)"];
                    res.formula = `M = ${values["Masse (g)"]} / ${values["Mol (mol)"]} = ${res.value} g/mol`;
                } else if(target === "Masse (g)"){
                    res.value = values["Molmasse (g/mol)"]*values["Mol (mol)"];
                    res.formula = `m = ${values["Molmasse (g/mol)"]} * ${values["Mol (mol)"]} = ${res.value} g`;
                } else if(target === "Mol (mol)"){
                    res.value = values["Masse (g)"]/values["Molmasse (g/mol)"];
                    res.formula = `n = ${values["Masse (g)"]} / ${values["Molmasse (g/mol)"]} = ${res.value} mol`;
                }
                return res;
            }
        }
    }
};
