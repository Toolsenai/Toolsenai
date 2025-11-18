/* ============================================
   ToolsenAI – Formula & Unit Database
   Version 1 – Basis-Einheiten & Präfixe
   ============================================ */

/* ---------------------------------------
   SI-Präfixe (automatisch erkannt)
--------------------------------------- */
window.siPrefixes = {
    "Y": 1e24,   // Yotta
    "Z": 1e21,   // Zetta
    "E": 1e18,   // Exa
    "P": 1e15,   // Peta
    "T": 1e12,   // Tera
    "G": 1e9,    // Giga
    "M": 1e6,    // Mega
    "k": 1e3,    // Kilo
    "h": 1e2,    // Hekto
    "da": 1e1,   // Deka
    "": 1,       // Basis
    "d": 1e-1,   // Dezi
    "c": 1e-2,   // Centi
    "m": 1e-3,   // Milli
    "µ": 1e-6,   // Mikro
    "n": 1e-9,   // Nano
    "p": 1e-12,  // Piko
    "f": 1e-15,  // Femto
    "a": 1e-18,  // Atto
    "z": 1e-21,  // Zepto
    "y": 1e-24   // Yokto
};

/* ---------------------------------------
   Basiseinheiten (Länge, Masse, Zeit ...)
--------------------------------------- */
window.unitFactors = {
    // ----- Länge -----
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    µm: 1e-6,
    nm: 1e-9,

    // ----- Masse -----
    g: 1,
    kg: 1000,
    mg: 0.001,
    µg: 1e-6,

    // ----- Zeit -----
    s: 1,
    min: 60,
    h: 3600,

    // ----- Energie -----
    J: 1,
    kJ: 1000,
    MJ: 1e6,
    Wh: 3600,
    kWh: 3_600_000,

    // ----- Leistung -----
    W: 1,
    kW: 1000,
    MW: 1e6,
    GW: 1e9,

    // ----- Druck -----
    Pa: 1,
    kPa: 1000,
    bar: 100000,
    mbar: 100
};

/* ---------------------------------------------------------
   Universelle Einheitenfunktion:
   Wert von Einheit A in Einheit B umrechnen
--------------------------------------------------------- */
window.convertUnit = function(value, from, to) {
    if (!unitFactors[from] || !unitFactors[to]) return null;
    return value * unitFactors[from] / unitFactors[to];
};

/* ---------------------------------------------------------
   Präfix-Optimierung:
   1000000 W → 1 MW
   0.000001 m → 1 µm
--------------------------------------------------------- */
window.optimizePrefix = function(value, unitBase) {
    let abs = Math.abs(value);

    for (let p in siPrefixes) {
        let v = abs / siPrefixes[p];
        if (v >= 1 && v < 1000) {
            return {value: v, unit: p + unitBase};
        }
    }

    return {value, unit: unitBase};
};
