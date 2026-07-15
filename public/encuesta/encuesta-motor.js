// ============================================================
// encuesta-motor.js — Motor de encuesta compartido (recolección)
// Extraído VERBATIM de ATLAS_v7.html (código compilado, React global).
// Contiene: T (tema), DATA_INICIAL, componentes UI, D0–D8,
// ConsentimientoScreen y QMAP_ENC. NO incluye la lógica clínica
// (ModEncuesta/resultados) — esa se queda en ATLAS.
// Fuente única de verdad para el consentimiento + dominios D0–D8.
// ============================================================

// Shim: el código compilado usa `_react` (alias de React en ATLAS).
// En este módulo standalone lo mapeamos a la React global.
window._react = window._react || window.React;

const T = {
  bg: "#f7f5f2",
  surface: "#ffffff",
  border: "#e2ddd8",
  accent: "#1a6b5a",
  accent2: "#e8813a",
  text: "#1c1917",
  muted: "#78716c",
  dim: "#a8a29e",
  danger: "#dc2626",
  warn: "#d97706",
  success: "#16a34a",
  D1: "#2d6a4f",
  D2: "#7c3aed",
  D3: "#1d4ed8",
  D4: "#b45309",
  D5: "#065f46",
  D6: "#991b1b",
  D7: "#0e7490",
  D8: "#4d7c0f"
};

// ─── TOKENS MOTOR (oscuro) ────────────────────────────────────
const M = {
  bg: "#ffffff",
  surface: "#f8fafc",
  card: "#f1f5f9",
  border: "#e2e8f0",
  accent: "#10b981",
  accent2: "#06b6d4",
  orange: "#f59e0b",
  red: "#ef4444",
  purple: "#8b5cf6",
  blue: "#3b82f6",
  text: "#0f172a",
  muted: "#64748b",
  dim: "#94a3b8"
};

// ─── SCROLL HELPER ────────────────────────────────────────────
const SCROLL = () => setTimeout(() => {
  try {
    (document.scrollingElement || document.documentElement || document.body).scrollTop = 0;
  } catch (e) {}
}, 30);

// ─── UTILIDADES ───────────────────────────────────────────────
const calcEdad = fechaNac => {
  if (!fechaNac) return null;
  const hoy = new Date(),
    nac = new Date(fechaNac);
  let e = hoy.getFullYear() - nac.getFullYear();
  if (hoy.getMonth() - nac.getMonth() < 0 || hoy.getMonth() === nac.getMonth() && hoy.getDate() < nac.getDate()) e--;
  return e > 0 && e < 130 ? e : null;
};
const DATA_INICIAL = () => ({
  profesional: "",
  tipoProfesionalConsulta: "",
  fechaConsulta: new Date().toISOString().split("T")[0],
  pais: "",
  ciudad: "",
  motivo: [],
  nombre: "",
  tipoDoc: "",
  documento: "",
  sexo: "",
  fechaNac: "",
  telefono: "",
  email: "",
  etnia: "",
  educacion: "",
  ocupacion: "",
  estadoCivil: "",
  estrato: "",
  firmaNombre: "",
  fechaConsentimiento: new Date().toISOString().split("T")[0],
  consentimientoAceptado: false,
  // D1 — Patrón Usual
  d1_1_i: null,
  d1_2_i: null,
  d1_3_i: null,
  d1_4_i: null,
  d1_5_i: null,
  d1_6_i: null,
  d1_7_i: null,
  d1_8_i: null,
  d1_9_i: null,
  d1_10_i: null,
  d1_11_i: null,
  d1_12_i: null,
  d1_13_i: null,
  d1_14_i: null,
  d1f_sal_i: null,
  d1f_des_i: null,
  d1f_noche_i: null,
  // D2
  d2_19: "",
  d2_20: "",
  d2_21: [],
  d2_22: "",
  // D3
  d3_23: "",
  d3_24: "",
  d3_25: [],
  d3_26: "",
  d3_27: "",
  d3_28: "",
  d3_29: null,
  d3_30: "",
  d3_31: "",
  // D4
  d4_32: "",
  d4_33: "",
  d4_34: [],
  d4_35: [],
  d4_35_otro: "",
  // D5
  d5_36: "",
  d5_37: "",
  d5_38: [],
  d5_39: [],
  d5_39_otro: "",
  d5_40: [],
  d5_40_otro: "",
  d5_41: "",
  d5_42: [],
  // D6
  d6_43: [],
  d6_43_otro: "",
  d6_44: [],
  d6_qx: [],
  d6_qx_otro: "",
  d6_45: "",
  d6_46: "",
  d6_47: "",
  d6_48: "",
  d6_49: "",
  d6_50: "",
  d6_51: "",
  // D7
  d7_52: null,
  d7_53: null,
  d7_54: null,
  d7_55: null,
  d7_agua: null,
  d7_56: null,
  d7_57: "",
  d7_58: "",
  // D8
  d8_59: "",
  d8_60: "",
  d8_61: "",
  d8_62: "",
  // Peso y talla (para Motor)
  peso: 0,
  talla: 0,
  edad: 0
});

// ═══════════════════════════════════════════════════════════════
// SECCIÓN 1: COMPONENTES DE LA ENCUESTA
// ═══════════════════════════════════════════════════════════════

function Pills({
  options,
  value,
  onChange,
  multi = false,
  warn = []
}) {
  const sel = multi ? Array.isArray(value) ? value : [] : value;
  const toggle = o => {
    if (multi) {
      const arr = Array.isArray(value) ? value : [];
      onChange(arr.includes(o) ? arr.filter(x => x !== o) : [...arr, o]);
    } else onChange(o);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 10,
      marginTop: 8
    }
  }, options.map(o => {
    const active = multi ? sel.includes(o) : sel === o;
    const isW = warn.includes(o);
    return /*#__PURE__*/React.createElement("button", {
      key: o,
      onClick: () => toggle(o),
      style: {
        padding: "10px 20px",
        borderRadius: 50,
        border: `2px solid ${active ? isW ? T.danger : T.accent : T.border}`,
        background: active ? isW ? "#fef2f2" : T.accent : "white",
        color: active ? isW ? T.danger : "white" : T.muted,
        fontSize: 15,
        fontWeight: active ? 700 : 400,
        cursor: "pointer",
        transition: "all 0.15s"
      }
    }, o);
  }));
}
function Counter({
  value,
  onChange,
  max = 20,
  unit = ""
}) {
  const v = Number(value) || 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onChange(Math.max(0, v - 1)),
    style: {
      width: 44,
      height: 44,
      background: "white",
      border: `2px solid ${T.border}`,
      fontSize: 20,
      cursor: "pointer",
      fontWeight: 700,
      color: T.text
    }
  }, "\u2212"), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 60,
      textAlign: "center",
      fontSize: 24,
      fontWeight: 800,
      color: T.accent,
      background: "#f0fdf4",
      border: `2px solid ${T.border}`,
      borderLeft: "none",
      borderRight: "none",
      padding: "8px 4px"
    }
  }, v), /*#__PURE__*/React.createElement("button", {
    onClick: () => onChange(Math.min(max, v + 1)),
    style: {
      width: 44,
      height: 44,
      background: "white",
      border: `2px solid ${T.border}`,
      borderLeft: "none",
      fontSize: 20,
      cursor: "pointer",
      fontWeight: 700,
      color: T.text
    }
  }, "+"), unit && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 12,
      fontSize: 13,
      color: T.muted
    }
  }, unit));
}
function Slider({
  value,
  onChange,
  min = 1,
  max = 10
}) {
  const v = value || min;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: min,
    max: max,
    step: 1,
    value: v,
    onChange: e => onChange(Number(e.target.value)),
    style: {
      flex: 1,
      accentColor: T.accent,
      height: 6,
      cursor: "pointer"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 52,
      height: 52,
      borderRadius: 26,
      background: T.accent,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 22,
      fontWeight: 900,
      color: "white"
    }
  }, v)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 12,
      color: T.muted,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDE0C Sin estr\xE9s"), /*#__PURE__*/React.createElement("span", null, "\uD83D\uDE30 M\xE1ximo")));
}
const TI = ({
  value,
  onChange,
  placeholder = "",
  type = "text"
}) => /*#__PURE__*/React.createElement("input", {
  type: type,
  value: value || "",
  onChange: e => onChange(e.target.value),
  placeholder: placeholder,
  style: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 16px",
    border: `2px solid ${T.border}`,
    borderRadius: 12,
    fontSize: 15,
    color: T.text,
    background: "white",
    outline: "none",
    fontFamily: "inherit",
    marginTop: 8
  }
});
const SI = ({
  value,
  onChange,
  options,
  placeholder = "Seleccionar..."
}) => /*#__PURE__*/React.createElement("select", {
  value: value || "",
  onChange: e => onChange(e.target.value),
  style: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 16px",
    border: `2px solid ${T.border}`,
    borderRadius: 12,
    fontSize: 15,
    color: value ? T.text : T.muted,
    background: "white",
    outline: "none",
    fontFamily: "inherit",
    marginTop: 8,
    cursor: "pointer"
  }
}, /*#__PURE__*/React.createElement("option", {
  value: "",
  disabled: true
}, placeholder), options.map(o => /*#__PURE__*/React.createElement("option", {
  key: o,
  value: o
}, o)));
function Q({
  num,
  label,
  sub,
  warn,
  isNew,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 0",
      borderBottom: `1px solid ${T.border}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 32,
      height: 32,
      borderRadius: 8,
      background: `${T.accent}15`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 12,
      fontWeight: 800,
      color: T.accent,
      marginTop: 2
    }
  }, num), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      color: T.text,
      fontWeight: 500,
      lineHeight: 1.5
    }
  }, label), isNew && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 800,
      background: "#dcfce7",
      color: T.success,
      borderRadius: 4,
      padding: "2px 7px"
    }
  }, "NUEVO"), warn && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 800,
      background: "#fef2f2",
      color: T.danger,
      borderRadius: 4,
      padding: "2px 7px"
    }
  }, "\u26A0 TCA")), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.muted,
      marginTop: 3
    }
  }, sub), children)));
}
function DCard({
  title,
  icon,
  color,
  children,
  badge
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "white",
      borderRadius: 20,
      overflow: "hidden",
      boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
      marginBottom: 24,
      border: `1px solid ${T.border}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 24px",
      background: `${color}12`,
      borderBottom: `2px solid ${color}33`,
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 24
    }
  }, icon), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 17,
      fontWeight: 800,
      color
    }
  }, title), badge && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      background: `${color}18`,
      color,
      border: `1px solid ${color}44`,
      borderRadius: 20,
      padding: "3px 12px"
    }
  }, badge)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 24px 16px"
    }
  }, children));
}

// ─── CONSTANTES ENCUESTA ──────────────────────────────────────
const PAISES = ["Colombia", "México", "Argentina", "Chile", "Perú", "Ecuador", "Venezuela", "Bolivia", "Uruguay", "Paraguay", "Brasil", "Costa Rica", "Panamá", "Guatemala", "Otro"];
const MOTIVOS = ["Control de peso / composición corporal", "Evaluación nutricional de rutina", "Manejo de enfermedad crónica", "Detección de sarcopenia", "Rendimiento deportivo", "Envejecimiento saludable / longevidad", "Seguimiento (consulta previa en CNV)", "Otro"];
const TIPO_DOC = ["Cédula de ciudadanía", "Cédula de extranjería", "Pasaporte", "Tarjeta de identidad", "Otro"];
const ETNIAS = ["Mestizo/a", "Blanco/a", "Afrodescendiente", "Indígena", "Mulato/a", "Otro", "Prefiero no indicar"];
const EDUCACION = ["Primaria incompleta", "Primaria completa", "Secundaria incompleta", "Secundaria completa", "Técnico / Tecnólogo", "Universitario incompleto", "Universitario completo", "Posgrado"];
const ESTADO_CIVIL = ["Soltero/a", "Casado/a", "Unión libre", "Divorciado/a", "Viudo/a"];

// ─── D1 v2.0 — Patrón Usual de Consumo ──────────────────────
const FREQ_GROUPS = [
// PROTECTORES
{
  n: 1,
  cat: "protector",
  label: "Verduras y hortalizas",
  sub: "tomate, zanahoria, ahuyama, espinaca, brócoli, pepino, remolacha",
  anc: "📏 Un puño cerrado"
}, {
  n: 2,
  cat: "protector",
  label: "Frutas enteras",
  sub: "banano, mango, papaya, guayaba, naranja, lulo, tomate de árbol",
  anc: "📏 1 fruta mediana o un pocillo"
}, {
  n: 3,
  cat: "protector",
  label: "Leguminosas",
  sub: "frijol, lenteja, garbanzo, arveja, soya",
  anc: "📏 Un pocillo arriero cocido"
}, {
  n: 4,
  cat: "protector",
  label: "Pescado y mariscos",
  sub: "atún, sardina, salmón, merluza, camarón",
  anc: "📏 Tamaño de su celular"
}, {
  n: 5,
  cat: "protector",
  label: "Grasas saludables",
  sub: "aguacate, aceite de oliva, nueces, almendras, maní",
  anc: "📏 ¼ aguacate o 1 cdta aceite o un puñado de nueces"
}, {
  n: 6,
  cat: "protector",
  label: "Lácteos bajos en grasa / fermentados",
  sub: "leche descremada, yogur natural, kumis, queso fresco",
  anc: "📏 1 vaso o 2 cucharadas de queso"
}, {
  n: 7,
  cat: "protector",
  label: "Huevos",
  sub: "huevo entero, clara, omelet",
  anc: "📏 1 unidad"
},
// NEUTROS / MODERADOS
{
  n: 8,
  cat: "neutro",
  label: "Cereales integrales",
  sub: "arroz integral, avena, pan integral, quinua, maíz",
  anc: "📏 ½ pocillo cocido o 1 tajada de pan"
}, {
  n: 9,
  cat: "neutro",
  label: "Tubérculos y raíces",
  sub: "papa, yuca, plátano, ñame, arracacha",
  anc: "📏 1 papa mediana o ½ plátano"
}, {
  n: 10,
  cat: "neutro",
  label: "Carnes magras",
  sub: "pollo sin piel, cerdo lomo, res magra",
  anc: "📏 Tamaño de su celular (~90g)"
},
// DE RIESGO
{
  n: 11,
  cat: "riesgo",
  label: "Cereales refinados y harinas",
  sub: "pan blanco, arroz blanco, galletas, pasta blanca, arepa",
  anc: "📏 ½ pocillo o 1 unidad mediana"
}, {
  n: 12,
  cat: "riesgo",
  label: "Carnes rojas y procesadas",
  sub: "res, cerdo, embutidos, salchicha, chorizo, tocineta",
  anc: "📏 Tamaño de su celular (~90g)"
}, {
  n: 13,
  cat: "riesgo",
  label: "Azúcares y dulces",
  sub: "gaseosa, jugos caja, chocolates, galletas dulces, postres",
  anc: "📏 1 vaso o 1 unidad"
}, {
  n: 14,
  cat: "riesgo",
  label: "Comida ultraprocesada",
  sub: "paquetes, papas fritas, hamburguesas, pizza, perros calientes",
  anc: "📏 1 paquete o 1 porción"
}];
const FREQ_OPC = ["Nunca", "1–2 días", "3–4 días", "5–6 días", "Todos los días"];
const catColor = {
  protector: "#2d6a4f",
  neutro: "#1d4ed8",
  riesgo: "#dc2626"
};
const catLabel = {
  protector: "✅ Protectores",
  neutro: "⚖️ Moderados",
  riesgo: "⚠️ De riesgo"
};
const FREQ_SUP = [{
  key: "d1f_sal_i",
  label: "¿Con qué frecuencia añade sal extra a la comida ya servida?",
  opts: ["Nunca", "Rara vez", "Con frecuencia", "Siempre"],
  alertIdx: 2
}, {
  key: "d1f_des_i",
  label: "¿Desayuna regularmente (antes de las 10 am)?",
  opts: ["Sí, todos los días", "A veces (3–4 días)", "Rara vez o nunca"],
  alertIdx: 2
}, {
  key: "d1f_noche_i",
  label: "¿A qué hora suele cenar?",
  opts: ["Antes de las 7 pm", "Entre 7 y 8 pm", "Entre 8 y 9 pm", "Después de las 9 pm"],
  alertIdx: 3
}];
// ─── SECCIONES D0–D8 ─────────────────────────────────────────


function D0({
  data,
  set
}) {
  const edad = calcEdad(data.fechaNac);
  const _profsD0 = (() => {
    const base = ["Gildardo de Jesús Uribe Gil"];
    try {
      const ints = JSON.parse(localStorage.getItem("atlas:admin:integrantes")||"[]");
      const fromAdmin = ints.filter(m=>m.estado==="activo").map(m=>m.nombre).filter(Boolean);
      if (fromAdmin.length > 0) return [...new Set([...base, ...fromAdmin])];
      const extra = JSON.parse(localStorage.getItem("atlas:profesionales")||"[]");
      return [...new Set([...base, ...extra.filter(Boolean)])];
    } catch(e) { return base; }
  })();
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DCard, {
    title: "Datos de la consulta",
    icon: "\uD83C\uDFE5",
    color: T.accent
  }, /*#__PURE__*/React.createElement(Q, {
    num: "\u2014",
    label: "Profesional tratante"
  }, /*#__PURE__*/React.createElement("select", {
    value: data.profesional || "",
    onChange: e => set("profesional", e.target.value),
    style: { width:"100%", padding:"10px 14px", borderRadius:10, border:"2px solid "+T.accent, fontSize:14, outline:"none", boxSizing:"border-box", background:"white" }
  },
    /*#__PURE__*/React.createElement("option", { value:"", disabled:true }, "Seleccionar profesional..."),
    _profsD0.map(p => /*#__PURE__*/React.createElement("option", { key:p, value:p }, p))
  )), /*#__PURE__*/React.createElement(Q, {
    num: "\u2014",
    label: "Especialidad del profesional"
  }, /*#__PURE__*/React.createElement("select", {
    value: data.tipoProfesionalConsulta || "",
    onChange: e => set("tipoProfesionalConsulta", e.target.value),
    style: { width:"100%", padding:"10px 14px", borderRadius:10, border:"2px solid "+T.accent, fontSize:14, outline:"none", boxSizing:"border-box", background:"white" }
  },
    /*#__PURE__*/React.createElement("option", { value:"", disabled:true }, "Seleccionar especialidad..."),
    ["Nutricionista","Médico","Psicólogo"].map(t => /*#__PURE__*/React.createElement("option", { key:t, value:t }, t))
  )), /*#__PURE__*/React.createElement(Q, {
    num: "\u2014",
    label: "Fecha de consulta"
  }, /*#__PURE__*/React.createElement(TI, {
    type: "date",
    value: data.fechaConsulta,
    onChange: v => set("fechaConsulta", v)
  })), /*#__PURE__*/React.createElement(Q, {
    num: "\u2014",
    label: "Pa\xEDs"
  }, /*#__PURE__*/React.createElement(SI, {
    value: data.pais,
    onChange: v => set("pais", v),
    options: PAISES
  })), /*#__PURE__*/React.createElement(Q, {
    num: "\u2014",
    label: "Ciudad"
  }, (() => {
    const CXPAIS = {
      "Colombia":   ["Bogot\u00E1","Medell\u00EDn","Barranquilla","Cali","Pereira","Bucaramanga","Manizales","C\u00FAcuta","Ibagu\u00E9","Riohacha","Santa Marta","Otra"],
      "M\u00E9xico": ["Ciudad de M\u00E9xico","Guadalajara","Monterrey","Puebla","Tijuana","Le\u00F3n","Ju\u00E1rez","M\u00E9rida","Otra"],
      "Argentina":  ["Buenos Aires","C\u00F3rdoba","Rosario","Mendoza","Tucum\u00E1n","Mar del Plata","Otra"],
      "Chile":      ["Santiago","Valpara\u00EDso","Concepci\u00F3n","Antofagasta","Vi\u00F1a del Mar","Otra"],
      "Per\u00FA":   ["Lima","Arequipa","Trujillo","Chiclayo","Piura","Otra"],
      "Ecuador":    ["Quito","Guayaquil","Cuenca","Ambato","Otra"],
      "Venezuela":  ["Caracas","Maracaibo","Valencia","Barquisimeto","Otra"],
      "Bolivia":    ["La Paz","Santa Cruz","Cochabamba","Otra"],
      "Paraguay":   ["Asunci\u00F3n","Ciudad del Este","Otra"],
      "Uruguay":    ["Montevideo","Salto","Otra"],
      "Costa Rica": ["San Jos\u00E9","Otra"],
      "Panam\u00E1": ["Ciudad de Panam\u00E1","Otra"],
      "Espa\u00F1a": ["Madrid","Barcelona","Valencia","Sevilla","Otra"]
    };
    const opts = CXPAIS[data.pais];
    if (!opts) {
      return /*#__PURE__*/React.createElement(TI, {
        value: data.ciudad,
        onChange: v => set("ciudad", v),
        placeholder: "Ciudad"
      });
    }
    const real    = opts.filter(c => c !== "Otra");
    const dropSel = real.includes(data.ciudad) ? data.ciudad : (data.ciudad ? "Otra" : "");
    const showFree = dropSel === "Otra";
    return /*#__PURE__*/React.createElement(React.Fragment, null,
      /*#__PURE__*/React.createElement("select", {
        value: dropSel,
        onChange: e => set("ciudad", e.target.value === "Otra" ? "Otra" : e.target.value),
        style: { width:"100%", boxSizing:"border-box", padding:"12px 16px", border:"2px solid "+T.border, borderRadius:12, fontSize:15, color:dropSel?T.text:T.muted, background:"white", outline:"none", fontFamily:"inherit", marginTop:8, cursor:"pointer" }
      },
        /*#__PURE__*/React.createElement("option", { value:"", disabled:true }, "Seleccionar ciudad..."),
        opts.map(c => /*#__PURE__*/React.createElement("option", { key:c, value:c }, c))
      ),
      showFree && /*#__PURE__*/React.createElement(TI, {
        value: data.ciudad === "Otra" ? "" : data.ciudad,
        onChange: v => set("ciudad", v || "Otra"),
        placeholder: "Escribe tu ciudad..."
      })
    );
  })()), /*#__PURE__*/React.createElement(Q, {
    num: "\u2014",
    label: "Motivo de consulta",
    sub: "Puede seleccionar varios"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: MOTIVOS,
    value: data.motivo,
    onChange: v => set("motivo", v),
    multi: true
  }))), /*#__PURE__*/React.createElement(DCard, {
    title: "Identificaci\xF3n del paciente",
    icon: "\uD83D\uDC64",
    color: "#1d4ed8"
  }, /*#__PURE__*/React.createElement(Q, {
    num: "\u2014",
    label: "Nombres y apellidos completos"
  }, /*#__PURE__*/React.createElement(TI, {
    value: data.nombre,
    onChange: v => set("nombre", v),
    placeholder: "Nombre completo"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Q, {
    num: "\u2014",
    label: "Tipo documento"
  }, /*#__PURE__*/React.createElement(SI, {
    value: data.tipoDoc,
    onChange: v => set("tipoDoc", v),
    options: TIPO_DOC
  })), /*#__PURE__*/React.createElement(Q, {
    num: "\u2014",
    label: "N\xB0 documento"
  }, /*#__PURE__*/React.createElement(TI, {
    value: data.documento,
    onChange: v => set("documento", v),
    placeholder: "N\xFAmero"
  }))), /*#__PURE__*/React.createElement(Q, {
    num: "\u2014",
    label: "Sexo biol\xF3gico",
    sub: "Usado para GEB y c\xE1lculos BIS"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["Masculino", "Femenino"],
    value: data.sexo,
    onChange: v => set("sexo", v)
  })), /*#__PURE__*/React.createElement(Q, {
    num: "\u2014",
    label: "Fecha de nacimiento",
    sub: "La edad se calcula autom\xE1ticamente"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(TI, {
    type: "date",
    value: data.fechaNac,
    onChange: v => set("fechaNac", v)
  }), edad && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 18px",
      background: "#f0fdf4",
      border: `2px solid ${T.success}44`,
      borderRadius: 12,
      fontSize: 15,
      fontWeight: 700,
      color: T.success,
      whiteSpace: "nowrap"
    }
  }, edad, " a\xF1os"))), /*#__PURE__*/React.createElement(Q, {
    num: "\u2014",
    label: "Tel\xE9fono"
  }, /*#__PURE__*/React.createElement(TI, {
    value: data.telefono,
    onChange: v => set("telefono", v),
    placeholder: "+57 300 000 0000",
    type: "tel"
  })), /*#__PURE__*/React.createElement(Q, {
    num: "\u2014",
    label: "Correo electr\xF3nico"
  }, /*#__PURE__*/React.createElement(TI, {
    value: data.email,
    onChange: v => set("email", v),
    placeholder: "correo@ejemplo.com",
    type: "email"
  }))), /*#__PURE__*/React.createElement(DCard, {
    title: "Contexto sociodemogr\xE1fico",
    icon: "\uD83C\uDF0D",
    color: "#7c3aed"
  }, /*#__PURE__*/React.createElement(Q, {
    num: "\u2014",
    label: "Etnia / grupo poblacional"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ETNIAS,
    value: data.etnia,
    onChange: v => set("etnia", v)
  })), /*#__PURE__*/React.createElement(Q, {
    num: "\u2014",
    label: "Nivel educativo"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: EDUCACION,
    value: data.educacion,
    onChange: v => set("educacion", v)
  })), /*#__PURE__*/React.createElement(Q, {
    num: "\u2014",
    label: "Ocupaci\xF3n"
  }, (() => {
    const OCUPACIONES = ["Docente / Profesor(a)","Profesional de la salud","Ingeniero(a)","Abogado(a)","Empleado(a) administrativo(a)","Empleado(a) dom\xE9stico(a)","Desempleado(a)","Jubilado(a) / Pensionado(a)","Independiente / Freelance","Empresario(a) / Emprendedor(a)","Militar","Deportista","Entrenador(a)","Arte y cultura","Otra"];
    const base = OCUPACIONES.slice(0, -1);
    const dropVal = base.includes(data.ocupacion) ? data.ocupacion : (data.ocupacion ? "Otra" : "");
    const showFree = dropVal === "Otra";
    return /*#__PURE__*/React.createElement(React.Fragment, null,
      /*#__PURE__*/React.createElement("select", {
        value: dropVal,
        onChange: e => set("ocupacion", e.target.value === "Otra" ? "Otra" : e.target.value),
        style: { width:"100%", boxSizing:"border-box", padding:"12px 16px", border:"2px solid "+T.border, borderRadius:12, fontSize:15, color:dropVal?T.text:T.muted, background:"white", outline:"none", fontFamily:"inherit", marginTop:8, cursor:"pointer" }
      },
        /*#__PURE__*/React.createElement("option", { value:"", disabled:true }, "Seleccionar ocupaci\xF3n..."),
        OCUPACIONES.map(o => /*#__PURE__*/React.createElement("option", { key:o, value:o }, o))
      ),
      showFree && /*#__PURE__*/React.createElement(TI, {
        value: data.ocupacion === "Otra" ? "" : data.ocupacion,
        onChange: v => set("ocupacion", v || "Otra"),
        placeholder: "Especifique su ocupaci\xF3n..."
      })
    );
  })()), /*#__PURE__*/React.createElement(Q, {
    num: "\u2014",
    label: "Estado civil"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ESTADO_CIVIL,
    value: data.estadoCivil,
    onChange: v => set("estadoCivil", v)
  })), /*#__PURE__*/React.createElement(Q, {
    num: "\u2014",
    label: "Estrato socioecon\xF3mico"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["1", "2", "3", "4", "5", "6", "No aplica"],
    value: data.estrato,
    onChange: v => set("estrato", v)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 16px",
      background: "#fffbeb",
      border: `1px dashed ${T.warn}`,
      borderRadius: 12,
      fontSize: 13,
      color: T.warn
    }
  }, "\u2139\uFE0F ", /*#__PURE__*/React.createElement("strong", null, "Peso y talla"), " son registrados por el profesional en el M\xF3dulo de Antropometr\xEDa y BIS \u2014 no se solicitan aqu\xED."));
}
function D1({
  data,
  set
}) {
  const cats = ["protector", "neutro", "riesgo"];
  return /*#__PURE__*/React.createElement(DCard, {
    title: "D1 \xB7 Patr\xF3n Usual de Consumo",
    icon: "\uD83C\uDF7D\uFE0F",
    color: T.D1,
    badge: "14 \xEDtems"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "12px 0 16px",
      padding: "11px 13px",
      background: "#f0fdf4",
      borderRadius: 9,
      border: "1px solid #bbf7d0",
      fontSize: 13,
      color: "#166534",
      lineHeight: 1.7
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Piensa en c\xF3mo comes habitualmente"), ", no en lo que comiste ayer.", /*#__PURE__*/React.createElement("br", null), "Para cada alimento, elige con qu\xE9 frecuencia lo consumes en una ", /*#__PURE__*/React.createElement("em", null, "semana t\xEDpica"), ".", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12
    }
  }, "\uD83D\uDCCF La referencia te ayuda a imaginar la cantidad usual.")), cats.map(cat => {
    const grupo = FREQ_GROUPS.filter(g => g.cat === cat);
    const esRiesgo = cat === "riesgo";
    return /*#__PURE__*/React.createElement("div", {
      key: cat,
      style: {
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "6px 14px",
        background: catColor[cat] + "18",
        borderLeft: `4px solid ${catColor[cat]}`,
        borderRadius: "0 8px 8px 0",
        fontSize: 13,
        fontWeight: 700,
        color: catColor[cat],
        marginBottom: 10
      }
    }, catLabel[cat]), grupo.map(g => {
      const val = data[`d1_${g.n}_i`] ?? null;
      return /*#__PURE__*/React.createElement(Q, {
        key: g.n,
        num: g.n,
        label: g.label,
        sub: g.sub
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12,
          color: "#92400e",
          background: "#fffbeb",
          padding: "3px 10px",
          borderRadius: 6,
          display: "inline-block",
          marginBottom: 6
        }
      }, g.anc), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          marginTop: 4
        }
      }, FREQ_OPC.map((op, i) => {
        const sel = val === i;
        const esAlerta = esRiesgo && i >= 2;
        const bg = sel ? esAlerta ? "#fef2f2" : catColor[g.cat] : undefined;
        const col = sel ? esAlerta ? "#dc2626" : "white" : undefined;
        const bc = sel ? esAlerta ? "#dc2626" : catColor[g.cat] : "#e2e8f0";
        return /*#__PURE__*/React.createElement("button", {
          key: i,
          onClick: () => set(`d1_${g.n}_i`, i),
          style: {
            padding: "6px 14px",
            borderRadius: 20,
            border: `2px solid ${bc}`,
            background: bg || "white",
            color: col || "#374151",
            fontSize: 13,
            cursor: "pointer",
            fontWeight: sel ? 700 : 400,
            transition: "all .15s"
          }
        }, op);
      })));
    }));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      padding: "12px 14px",
      background: "#f8fafc",
      borderRadius: 9,
      border: "1px solid #e2e8f0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: "#334155",
      marginBottom: 10
    }
  }, "\uD83D\uDD50 H\xE1bitos de horario y condimentaci\xF3n"), FREQ_SUP.map(({
    key,
    label,
    opts,
    alertIdx
  }) => {
    const val = data[key] ?? null;
    return /*#__PURE__*/React.createElement(Q, {
      key: key,
      num: "+",
      label: label
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: 6
      }
    }, opts.map((op, i) => {
      const sel = val === i;
      const esA = i >= alertIdx;
      const bg = sel ? esA ? "#fef2f2" : "#2d6a4f" : undefined;
      const col = sel ? esA ? "#dc2626" : "white" : undefined;
      const bc = sel ? esA ? "#dc2626" : "#2d6a4f" : "#e2e8f0";
      return /*#__PURE__*/React.createElement("button", {
        key: i,
        onClick: () => set(key, i),
        style: {
          padding: "6px 14px",
          borderRadius: 20,
          border: `2px solid ${bc}`,
          background: bg || "white",
          color: col || "#374151",
          fontSize: 13,
          cursor: "pointer",
          fontWeight: sel ? 700 : 400,
          transition: "all .15s"
        }
      }, op);
    })));
  })));
}
function D2({
  data,
  set
}) {
  const tca = Array.isArray(data.d2_21) && ["Laxantes", "Vómito", "Ejercicio excesivo"].some(w => data.d2_21.includes(w));
  return /*#__PURE__*/React.createElement(DCard, {
    title: "D2 \xB7 Percepci\xF3n Corporal",
    icon: "\uD83E\uDE9E",
    color: T.D2,
    badge: "4 \xEDtems"
  }, /*#__PURE__*/React.createElement(Q, {
    num: 19,
    label: "\xBFC\xF3mo percibe su cuerpo actualmente?"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["Muy delgado/a", "Delgado/a", "Normal", "Sobrepeso", "Obesidad"],
    value: data.d2_19,
    onChange: v => set("d2_19", v)
  })), /*#__PURE__*/React.createElement(Q, {
    num: 20,
    label: "\xBFQu\xE9 tan satisfecho/a est\xE1 con su peso?"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["Muy insatisfecho/a", "Insatisfecho/a", "Neutral", "Satisfecho/a"],
    value: data.d2_20,
    onChange: v => set("d2_20", v)
  })), /*#__PURE__*/React.createElement(Q, {
    num: 21,
    label: "\xBFQu\xE9 m\xE9todos ha usado para cambiar su peso?",
    warn: true,
    sub: "Seleccione todos los que apliquen"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["Dieta propia", "Profesional de salud", "Ayunos", "Saltar comidas", "Laxantes", "Vómito", "Ejercicio excesivo", "Ninguno"],
    warn: ["Laxantes", "Vómito", "Ejercicio excesivo"],
    value: data.d2_21,
    onChange: v => set("d2_21", v),
    multi: true
  }), tca && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      padding: "10px 14px",
      background: "#fef2f2",
      borderRadius: 8,
      border: `1px solid ${T.danger}33`,
      fontSize: 13,
      color: T.danger
    }
  }, "\u26A0\uFE0F Esta respuesta ser\xE1 marcada para evaluaci\xF3n cl\xEDnica.")), /*#__PURE__*/React.createElement(Q, {
    num: 22,
    label: "\xBFCon qu\xE9 frecuencia pierde el control al comer?"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["Nunca", "Rara vez", "A veces", "Frecuentemente", "Siempre"],
    value: data.d2_22,
    onChange: v => set("d2_22", v)
  })));
}
function D3({
  data,
  set
}) {
  return /*#__PURE__*/React.createElement(DCard, {
    title: "D3 \xB7 H\xE1bitos",
    icon: "\uD83C\uDFC3",
    color: T.D3,
    badge: "9 \xEDtems"
  }, /*#__PURE__*/React.createElement(Q, {
    num: 23,
    label: "\xBFCu\xE1ntos d\xEDas/semana hace actividad f\xEDsica (\u226530 min)?"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["0", "1", "2", "3", "4", "5", "6", "7"],
    value: data.d3_23,
    onChange: v => set("d3_23", v)
  })), /*#__PURE__*/React.createElement(Q, {
    num: 24,
    label: "\xBFCu\xE1nto dura cada sesi\xF3n?",
    isNew: true
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["Menos de 15", "15–30 min", "30–45 min", "45–60 min", "Más de 60 min"],
    value: data.d3_24,
    onChange: v => set("d3_24", v)
  })), /*#__PURE__*/React.createElement(Q, {
    num: 25,
    label: "\xBFQu\xE9 tipo de actividad realiza?",
    sub: "Puede seleccionar varios"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["Caminata", "Trote", "Bicicleta", "Pesas / gimnasio", "Yoga / pilates", "Deporte en equipo", "Ninguna"],
    value: data.d3_25,
    onChange: v => set("d3_25", v),
    multi: true
  })), /*#__PURE__*/React.createElement(Q, {
    num: 26,
    label: "\xBFCu\xE1ntas horas duerme por noche?"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["Menos de 5h", "5–6 horas", "6–7 horas", "7–8 horas", "Más de 8h"],
    value: data.d3_26,
    onChange: v => set("d3_26", v)
  })), /*#__PURE__*/React.createElement(Q, {
    num: 27,
    label: "\xBFC\xF3mo califica la calidad de su sue\xF1o?"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["Muy mala", "Mala", "Regular", "Buena", "Muy buena"],
    value: data.d3_27,
    onChange: v => set("d3_27", v)
  })), /*#__PURE__*/React.createElement(Q, {
    num: 28,
    label: "\xBFRonca durante el sue\xF1o?"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["No", "A veces", "Frecuentemente"],
    value: data.d3_28,
    onChange: v => set("d3_28", v)
  })), /*#__PURE__*/React.createElement(Q, {
    num: 29,
    label: "Nivel de estr\xE9s en el \xFAltimo mes",
    sub: "1 = sin estr\xE9s \xB7 10 = m\xE1ximo"
  }, /*#__PURE__*/React.createElement(Slider, {
    value: data.d3_29,
    onChange: v => set("d3_29", v),
    min: 1,
    max: 10
  })), /*#__PURE__*/React.createElement(Q, {
    num: 30,
    label: "\xBFSu relaci\xF3n con el tabaco / nicotina?",
    isNew: true
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["Nunca he fumado", "Dejé hace 5 años o más", "Dejé hace menos de 5 años", "Fumo ocasionalmente", "Fumo diariamente", "Solo vapeo", "Exposición pasiva"],
    value: data.d3_30,
    onChange: v => set("d3_30", v)
  })), /*#__PURE__*/React.createElement(Q, {
    num: 31,
    label: "\xBFCon qu\xE9 frecuencia consume alcohol?"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["Nunca", "1–2 veces al mes", "1–2 veces a la semana", "Todos los días"],
    value: data.d3_31,
    onChange: v => set("d3_31", v)
  })));
}
function D4({
  data,
  set
}) {
  return /*#__PURE__*/React.createElement(DCard, {
    title: "D4 \xB7 Conductas Alimentarias",
    icon: "\u26A0\uFE0F",
    color: T.D4,
    badge: "4 \xEDtems"
  }, /*#__PURE__*/React.createElement(Q, {
    num: 32,
    label: "\xBFCu\xE1ntas comidas hace al d\xEDa?"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["1 comida", "2 comidas", "3 comidas", "4 o más comidas"],
    value: data.d4_32,
    onChange: v => set("d4_32", v)
  })), /*#__PURE__*/React.createElement(Q, {
    num: 33,
    label: "\xBFDesayuna regularmente?"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["Nunca", "Rara vez", "A veces", "Casi siempre", "Siempre"],
    value: data.d4_33,
    onChange: v => set("d4_33", v)
  })), /*#__PURE__*/React.createElement(Q, {
    num: 34,
    label: "\xBFSigue alg\xFAn patr\xF3n alimentario?",
    sub: "Puede seleccionar varios"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["Ninguno", "Vegetariano", "Vegano", "Keto / bajo en carbohidratos", "Sin gluten", "Sin lácteos", "Bajo en sal"],
    value: data.d4_34,
    onChange: v => set("d4_34", v),
    multi: true
  })), /*#__PURE__*/React.createElement(Q, {
    num: 35,
    label: "\xBFQu\xE9 suplementos toma actualmente?",
    sub: "Puede seleccionar varios"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["Ninguno", "Multivitamínico", "Vitamina D", "Omega-3", "Proteína en polvo", "Hierro", "Magnesio", "Probióticos", "Otros"],
    value: data.d4_35,
    onChange: v => set("d4_35", v),
    multi: true
  }), Array.isArray(data.d4_35) && data.d4_35.includes("Otros") && /*#__PURE__*/React.createElement("div", { style:{ marginTop:10 } },
    /*#__PURE__*/React.createElement("input", {
      type: "text",
      placeholder: "¿Cuál? Especifique los suplementos...",
      value: data.d4_35_otro || "",
      onChange: e => set("d4_35_otro", e.target.value),
      style: { width:"100%", padding:"10px 14px", borderRadius:10, border:"2px solid "+T.D4, fontSize:14, outline:"none", boxSizing:"border-box" }
    })
  )));
}
function D5({
  data,
  set
}) {
  return /*#__PURE__*/React.createElement(DCard, {
    title: "D5 \xB7 Epigen\xE9tico / LE8",
    icon: "\uD83E\uDDEC",
    color: T.D5,
    badge: "7 \xEDtems"
  }, /*#__PURE__*/React.createElement(Q, {
    num: 36,
    label: "\xBFLe han diagnosticado hipertensi\xF3n arterial?",
    isNew: true
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["Sí", "No", "No sé"],
    value: data.d5_36,
    onChange: v => set("d5_36", v)
  })), /*#__PURE__*/React.createElement(Q, {
    num: 37,
    label: "\xBFToma medicamentos para la presi\xF3n arterial?",
    isNew: true
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["Sí", "No"],
    value: data.d5_37,
    onChange: v => set("d5_37", v)
  })), /*#__PURE__*/React.createElement(Q, {
    num: 38,
    label: "\xBFFamiliares cercanos con estas enfermedades?",
    sub: "Padres, hermanos, abuelos \xB7 Seleccione varios"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["DM2 (diabetes)", "HTA (presión alta)", "Obesidad", "Infarto / ACV", "Cáncer", "Enfermedad de tiroides", "Depresión", "Ninguna"],
    value: data.d5_38,
    onChange: v => set("d5_38", v),
    multi: true
  })), /*#__PURE__*/React.createElement(Q, {
    num: 39,
    label: "\xBFTiene alguno de estos diagn\xF3sticos personales?",
    sub: "Usados para calcular el Factor de Estr\xE9s Metab\xF3lico en el Motor Nutricional"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["Diabetes tipo 1", "Diabetes tipo 2", "Prediabetes", "HTA", "Dislipidemia (colesterol alto)", "Hipertrigliceridemia", "Hipotiroidismo", "Hipertiroidismo", "Obesidad", "S\xEDndrome Metab\xF3lico", "C\xE1ncer (activo)", "C\xE1ncer (en remisi\xF3n)", "Enfermedad cardiovascular", "Insuficiencia renal", "Enfermedad hep\xE1tica", "Artritis/Artrosis", "Osteoporosis", "Depresi\xF3n", "Ansiedad", "Trastornos de la conducta alimentaria", "Ninguna", "Otra"],
    value: data.d5_39,
    onChange: v => set("d5_39", v),
    multi: true
  }), Array.isArray(data.d5_39) && data.d5_39.includes("Otra") && /*#__PURE__*/React.createElement("div", { style:{ marginTop:10 } },
    /*#__PURE__*/React.createElement("input", {
      type: "text",
      placeholder: "Especifique el diagn\xF3stico...",
      value: data.d5_39_otro || "",
      onChange: e => set("d5_39_otro", e.target.value),
      style: { width:"100%", padding:"10px 14px", borderRadius:10, border:"2px solid "+T.D5, fontSize:14, outline:"none", boxSizing:"border-box" }
    })
  )), /*#__PURE__*/React.createElement(Q, {
    num: 40,
    label: "\xBFQu\xE9 medicamentos toma actualmente?",
    sub: "Puede seleccionar varios"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["Ninguno", "Metformina", "Antihipertensivo", "Estatinas", "Levotiroxina", "Insulina", "Otros"],
    value: data.d5_40,
    onChange: v => set("d5_40", v),
    multi: true
  }), Array.isArray(data.d5_40) && data.d5_40.includes("Otros") && /*#__PURE__*/React.createElement("div", { style:{ marginTop:10 } },
    /*#__PURE__*/React.createElement("input", {
      type: "text",
      placeholder: "Especifique los medicamentos...",
      value: data.d5_40_otro || "",
      onChange: e => set("d5_40_otro", e.target.value),
      style: { width:"100%", padding:"10px 14px", borderRadius:10, border:"2px solid "+T.D5, fontSize:14, outline:"none", boxSizing:"border-box" }
    })
  )), /*#__PURE__*/React.createElement(Q, {
    num: 41,
    label: "\xBFFue amamantado/a en su infancia?"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["No sé", "No", "Sí, menos de 6 meses", "Sí, 6 meses o más"],
    value: data.d5_41,
    onChange: v => set("d5_41", v)
  })), /*#__PURE__*/React.createElement(Q, {
    num: 42,
    label: "\xBFExposici\xF3n habitual a contaminantes?",
    sub: "Puede seleccionar varios"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["Pesticidas / agroquímicos", "Metales pesados", "Contaminación del aire", "Ninguna"],
    value: data.d5_42,
    onChange: v => set("d5_42", v),
    multi: true
  })));
}
function D6({
  data,
  set
}) {
  const GI = [{
    n: 45,
    l: "Hinchazón abdominal"
  }, {
    n: 46,
    l: "Gases / flatulencia"
  }, {
    n: 47,
    l: "Dolor abdominal"
  }, {
    n: 48,
    l: "Diarrea"
  }, {
    n: 49,
    l: "Estreñimiento"
  }, {
    n: 50,
    l: "Reflujo / acidez"
  }, {
    n: 51,
    l: "Náuseas"
  }];
  return /*#__PURE__*/React.createElement(DCard, {
    title: "D6 \xB7 Alergias y Salud Digestiva",
    icon: "\uD83E\uDE7A",
    color: T.D6,
    badge: "10 \xEDtems"
  }, /*#__PURE__*/React.createElement(Q, {
    num: 43,
    label: "\xBFAlergias alimentarias diagnosticadas?",
    sub: "Puede seleccionar varios"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["Ninguna", "Leche", "Huevo", "Maní", "Trigo", "Soya", "Pescado", "Mariscos", "Otras"],
    value: data.d6_43,
    onChange: v => set("d6_43", v),
    multi: true
  }), Array.isArray(data.d6_43) && data.d6_43.includes("Otras") && /*#__PURE__*/React.createElement("div", { style:{ marginTop:10 } },
    /*#__PURE__*/React.createElement("input", {
      type: "text",
      placeholder: "¿Cuál alergia? Especifique...",
      value: data.d6_43_otro || "",
      onChange: e => set("d6_43_otro", e.target.value),
      style: { width:"100%", padding:"10px 14px", borderRadius:10, border:"2px solid "+T.D6, fontSize:14, outline:"none", boxSizing:"border-box" }
    })
  )), /*#__PURE__*/React.createElement(Q, {
    num: 44,
    label: "\xBFIntolerancias alimentarias?",
    sub: "Puede seleccionar varios"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["Ninguna", "Lactosa", "Gluten", "Fructosa"],
    value: data.d6_44,
    onChange: v => set("d6_44", v),
    multi: true
  })), /*#__PURE__*/React.createElement(Q, {
    num: 63,
    label: "\xBFLe han realizado alguna cirug\xEDa que afecte la digesti\xF3n o el metabolismo?",
    sub: "Ej.: ves\xEDcula, bypass/manga g\xE1strica, intestino \xB7 Puede seleccionar varias",
    isNew: true
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["Ninguna", "Colecistectom\u00eda (ves\u00edcula)", "Cirug\u00eda bari\u00e1trica (bypass / manga)", "Resecci\u00f3n intestinal", "Gastrectom\u00eda", "Apendicectom\u00eda", "Otra"],
    value: data.d6_qx,
    onChange: v => set("d6_qx", v),
    multi: true
  }), Array.isArray(data.d6_qx) && data.d6_qx.includes("Otra") && /*#__PURE__*/React.createElement("div", { style:{ marginTop:10 } },
    /*#__PURE__*/React.createElement("input", {
      type: "text",
      placeholder: "\xBFCu\xE1l cirug\xEDa? Especifique...",
      value: data.d6_qx_otro || "",
      onChange: e => set("d6_qx_otro", e.target.value),
      style: { width:"100%", padding:"10px 14px", borderRadius:10, border:"2px solid "+T.D6, fontSize:14, outline:"none", boxSizing:"border-box" }
    })
  )), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 0 4px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: T.D6,
      marginBottom: 12
    }
  }, "S\xEDntomas digestivos (\xEDtems 45\u201351)"), GI.map(g => /*#__PURE__*/React.createElement(Q, {
    key: g.n,
    num: g.n,
    label: g.l
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["Nunca", "A veces", "Frecuente", "Siempre"],
    value: data[`d6_${g.n}`],
    onChange: v => set(`d6_${g.n}`, v)
  })))));
}
function D7({
  data,
  set
}) {
  return /*#__PURE__*/React.createElement(DCard, {
    title: "D7 \xB7 Hidrataci\xF3n",
    icon: "\uD83D\uDCA7",
    color: T.D7,
    badge: "7 \xEDtems"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 0 4px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: T.D7,
      marginBottom: 12
    }
  }, "Bebidas en d\xEDa t\xEDpico"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 16
    }
  }, [{
    n: 52,
    l: "☕ Café",
    u: "tazas",
    k: "d7_52"
  }, {
    n: 53,
    l: "🍵 Té",
    u: "tazas",
    k: "d7_53"
  }, {
    n: 54,
    l: "🍊 Jugos naturales",
    u: "vasos",
    k: "d7_54"
  }, {
    n: 55,
    l: "🥤 Gaseosas",
    u: "vasos",
    k: "d7_55"
  }, {
    n: "agua",
    l: "\uD83D\uDCA7 Agua",
    u: "vasos 200ml",
    k: "d7_agua"
  }, {
    n: 56,
    l: "⚡ Energéticas",
    u: "latas",
    k: "d7_56"
  }].map(b => /*#__PURE__*/React.createElement("div", {
    key: b.n
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: T.text,
      fontWeight: 500
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: T.D7,
      fontWeight: 800,
      marginRight: 6
    }
  }, b.n), b.l), /*#__PURE__*/React.createElement(Counter, {
    value: data[b.k],
    onChange: v => set(b.k, v),
    max: 30,
    unit: b.u
  }))))), /*#__PURE__*/React.createElement(Q, {
    num: 57,
    label: "\xBFSiente sed con frecuencia?"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["Nunca", "Rara vez", "A veces", "Frecuentemente", "Siempre"],
    value: data.d7_57,
    onChange: v => set("d7_57", v)
  })), /*#__PURE__*/React.createElement(Q, {
    num: 58,
    label: "\xBFColor de su orina habitualmente?",
    sub: "Primera orina de la ma\xF1ana"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["Transparente", "Amarillo claro", "Amarillo", "Oscuro (naranja / marrón)"],
    value: data.d7_58,
    onChange: v => set("d7_58", v)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 10,
      height: 12
    }
  }, [{
    l: "Transparente",
    bg: "#e0f4ff"
  }, {
    l: "Amarillo claro",
    bg: "#fef9c3"
  }, {
    l: "Amarillo",
    bg: "#fbbf24"
  }, {
    l: "Oscuro (naranja / marrón)",
    bg: "#92400e"
  }].map(s => /*#__PURE__*/React.createElement("div", {
    key: s.l,
    style: {
      flex: 1,
      background: s.bg,
      borderRadius: 6,
      opacity: data.d7_58 === s.l ? 1 : 0.3,
      transition: "opacity 0.2s",
      border: data.d7_58 === s.l ? "2.5px solid #1c1917" : "none"
    }
  })))));
}
function D8({
  data,
  set
}) {
  return /*#__PURE__*/React.createElement(DCard, {
    title: "D8 \xB7 Contexto Social",
    icon: "\uD83C\uDFE0",
    color: T.D8,
    badge: "4 \xEDtems"
  }, /*#__PURE__*/React.createElement(Q, {
    num: 59,
    label: "\xBFQui\xE9n prepara sus alimentos habitualmente?"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["Yo mismo/a", "Un familiar", "Restaurante o fonda", "Cafetería / comedor"],
    value: data.d8_59,
    onChange: v => set("d8_59", v)
  })), /*#__PURE__*/React.createElement(Q, {
    num: 60,
    label: "\xBFCon qu\xE9 frecuencia come fuera de casa?"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["Nunca", "1–2 veces/semana", "3–4 veces/semana", "Todos los días"],
    value: data.d8_60,
    onChange: v => set("d8_60", v)
  })), /*#__PURE__*/React.createElement(Q, {
    num: 61,
    label: "\xBFTiene acceso f\xE1cil a alimentos frescos y saludables?"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["Sí, siempre", "A veces es difícil", "Generalmente es difícil"],
    value: data.d8_61,
    onChange: v => set("d8_61", v)
  })), /*#__PURE__*/React.createElement(Q, {
    num: 62,
    label: "\xBFHay momentos en que no tiene suficiente comida en el hogar?"
  }, /*#__PURE__*/React.createElement(Pills, {
    options: ["No, nunca", "A veces", "Frecuentemente"],
    value: data.d8_62,
    onChange: v => set("d8_62", v)
  })));
}
// Items opcionales — default = "no consume" / "no aplica". Cuentan como respondidos siempre.
const OPCIONALES_ENC = ["d7_52","d7_53","d7_54","d7_55","d7_agua","d7_56","d8_59","d8_60","d8_61","d8_62"];
function countFilled(data) {
  // D7 bebidas (6) + D8 (4) = 10 items opcionales que se cuentan siempre.
  let n = OPCIONALES_ENC.length;
  for (let i = 1; i <= 14; i++) if (data[`d1_${i}_i`] !== undefined && data[`d1_${i}_i`] !== null) n++;
  ["d1f_sal_i","d1f_des_i","d1f_noche_i"].forEach(k => { if (data[k] !== undefined && data[k] !== null) n++; });
  const keys = ["d2_19", "d2_20", "d2_21", "d2_22", "d3_23", "d3_24", "d3_25", "d3_26", "d3_27", "d3_28", "d3_29", "d3_30", "d3_31", "d4_32", "d4_33", "d4_34", "d4_35", "d5_36", "d5_37", "d5_38", "d5_39", "d5_40", "d5_41", "d5_42", "d6_43", "d6_44", "d6_qx", "d6_45", "d6_46", "d6_47", "d6_48", "d6_49", "d6_50", "d6_51", "d7_57", "d7_58"];
  for (const k of keys) {
    const v = data[k];
    if (Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && v !== "") n++;
  }
  return Math.min(n, 63);
}

// ═══════════════════════════════════════════════════════════════
// SECCIÓN 2: MOTOR NUTRICIONAL
// ═══════════════════════════════════════════════════════════════

const TCAC = {
  1: {
    n: "Lácteos",
    kcal: 134,
    prot: 6.7,
    grasa: 6.2,
    cho: 13.3,
    fibra: 0,
    calcio: 236,
    hierro: 0.2,
    zinc: 0.9,
    vitC: 1,
    vitA: 73,
    folato: 9,
    potasio: 342,
    magnesio: 25,
    omega3: 0.07,
    sodio: 97
  },
  2: {
    n: "Carnes rojas",
    kcal: 143,
    prot: 15.7,
    grasa: 7.9,
    cho: 1.3,
    fibra: 0,
    calcio: 37,
    hierro: 2.5,
    zinc: 3.2,
    vitC: 0,
    vitA: 1515,
    folato: 96,
    potasio: 241,
    magnesio: 20,
    omega3: 0.25,
    sodio: 107
  },
  3: {
    n: "Pollo / Pavo",
    kcal: 112,
    prot: 19.1,
    grasa: 3.1,
    cho: 1,
    fibra: 0,
    calcio: 23,
    hierro: 1.4,
    zinc: 1.8,
    vitC: 0,
    vitA: 10,
    folato: 15,
    potasio: 335,
    magnesio: 29,
    omega3: 0.1,
    sodio: 73
  },
  4: {
    n: "Pescado",
    kcal: 108,
    prot: 18.5,
    grasa: 2.8,
    cho: 0.5,
    fibra: 0,
    calcio: 28,
    hierro: 0.9,
    zinc: 0.7,
    vitC: 0,
    vitA: 15,
    folato: 12,
    potasio: 380,
    magnesio: 32,
    omega3: 1.2,
    sodio: 65
  },
  5: {
    n: "Huevos",
    kcal: 78,
    prot: 6.3,
    grasa: 5.3,
    cho: 0.6,
    fibra: 0,
    calcio: 28,
    hierro: 1,
    zinc: 0.6,
    vitC: 0,
    vitA: 270,
    folato: 44,
    potasio: 69,
    magnesio: 6,
    omega3: 0.03,
    sodio: 62
  },
  6: {
    n: "Leguminosas",
    kcal: 136,
    prot: 8.1,
    grasa: 1.6,
    cho: 22.1,
    fibra: 6.7,
    calcio: 44,
    hierro: 3,
    zinc: 1.1,
    vitC: 1.5,
    vitA: 0,
    folato: 129,
    potasio: 407,
    magnesio: 50,
    omega3: 0.17,
    sodio: 9
  },
  7: {
    n: "Cereales",
    kcal: 130,
    prot: 3.2,
    grasa: 1,
    cho: 27,
    fibra: 1.4,
    calcio: 22,
    hierro: 1.2,
    zinc: 0.5,
    vitC: 0,
    vitA: 0,
    folato: 28,
    potasio: 52,
    magnesio: 18,
    omega3: 0.02,
    sodio: 145
  },
  8: {
    n: "Tubérculos",
    kcal: 141,
    prot: 2.3,
    grasa: 0.2,
    cho: 33.9,
    fibra: 3,
    calcio: 17,
    hierro: 0.9,
    zinc: 0.3,
    vitC: 18,
    vitA: 0,
    folato: 21,
    potasio: 531,
    magnesio: 30,
    omega3: 0.01,
    sodio: 9
  },
  9: {
    n: "Frutas",
    kcal: 72,
    prot: 0.8,
    grasa: 0.3,
    cho: 18.2,
    fibra: 2.5,
    calcio: 14,
    hierro: 0.4,
    zinc: 0.1,
    vitC: 28,
    vitA: 38,
    folato: 20,
    potasio: 215,
    magnesio: 12,
    omega3: 0.02,
    sodio: 2
  },
  10: {
    n: "Verduras crudas",
    kcal: 23,
    prot: 1.2,
    grasa: 0.3,
    cho: 4.8,
    fibra: 1.4,
    calcio: 16,
    hierro: 0.6,
    zinc: 0.2,
    vitC: 19,
    vitA: 144,
    folato: 30,
    potasio: 172,
    magnesio: 12,
    omega3: 0.1,
    sodio: 68
  },
  11: {
    n: "Verduras cocidas",
    kcal: 22,
    prot: 1.3,
    grasa: 0.3,
    cho: 4.5,
    fibra: 1.5,
    calcio: 18,
    hierro: 0.7,
    zinc: 0.2,
    vitC: 12,
    vitA: 160,
    folato: 28,
    potasio: 183,
    magnesio: 13,
    omega3: 0.09,
    sodio: 70
  },
  12: {
    n: "Grasas saludables",
    kcal: 45,
    prot: 0.1,
    grasa: 4.7,
    cho: 0.4,
    fibra: 0.5,
    calcio: 2,
    hierro: 0.1,
    zinc: 0.1,
    vitC: 1,
    vitA: 4,
    folato: 5,
    potasio: 62,
    magnesio: 5,
    omega3: 0.5,
    sodio: 0
  },
  13: {
    n: "Grasas saturadas",
    kcal: 36,
    prot: 0,
    grasa: 4,
    cho: 0,
    fibra: 0,
    calcio: 1,
    hierro: 0,
    zinc: 0,
    vitC: 0,
    vitA: 38,
    folato: 0,
    potasio: 1,
    magnesio: 0,
    omega3: 0.1,
    sodio: 32
  },
  14: {
    n: "Azúcares/dulces",
    kcal: 38,
    prot: 0,
    grasa: 0,
    cho: 9.8,
    fibra: 0,
    calcio: 1,
    hierro: 0,
    zinc: 0,
    vitC: 0,
    vitA: 0,
    folato: 0,
    potasio: 2,
    magnesio: 0,
    omega3: 0,
    sodio: 1
  },
  15: {
    n: "Bebidas azucaradas",
    kcal: 104,
    prot: 0,
    grasa: 0,
    cho: 26.5,
    fibra: 0,
    calcio: 8,
    hierro: 0.1,
    zinc: 0,
    vitC: 0,
    vitA: 0,
    folato: 0,
    potasio: 10,
    magnesio: 3,
    omega3: 0,
    sodio: 18
  },
  16: {
    n: "Agua pura",
    kcal: 0,
    prot: 0,
    grasa: 0,
    cho: 0,
    fibra: 0,
    calcio: 0,
    hierro: 0,
    zinc: 0,
    vitC: 0,
    vitA: 0,
    folato: 0,
    potasio: 0,
    magnesio: 0,
    omega3: 0,
    sodio: 0
  },
  17: {
    n: "Café/Té",
    kcal: 4,
    prot: 0.3,
    grasa: 0,
    cho: 0.8,
    fibra: 0,
    calcio: 5,
    hierro: 0.1,
    zinc: 0,
    vitC: 0,
    vitA: 0,
    folato: 5,
    potasio: 80,
    magnesio: 8,
    omega3: 0,
    sodio: 2
  },
  18: {
    n: "Alcohol",
    kcal: 143,
    prot: 1.1,
    grasa: 0,
    cho: 12.6,
    fibra: 0,
    calcio: 18,
    hierro: 0.1,
    zinc: 0,
    vitC: 0,
    vitA: 0,
    folato: 21,
    potasio: 96,
    magnesio: 18,
    omega3: 0,
    sodio: 18
  }
};
const RDA = sexo => {
  const m = sexo === "Masculino";
  return {
    fibra: m ? 38 : 25,
    calcio: 1000,
    hierro: m ? 8 : 18,
    zinc: m ? 11 : 8,
    vitC: m ? 90 : 75,
    vitA: m ? 900 : 700,
    folato: 400,
    potasio: 3500,
    magnesio: m ? 420 : 320,
    omega3: m ? 1.6 : 1.1,
    sodio: 2300,
    prot: m ? 56 : 46
  };
};
const calcPAL = (dias, mins) => {
  const d = parseInt(dias) || 0;
  const mv = {
    "Menos de 15": 10,
    "15–30 min": 22,
    "30–45 min": 37,
    "45–60 min": 52,
    "Más de 60 min": 75
  }[mins] || 0;
  if (d === 0) return {
    pal: 1.20,
    nivel: "Sedentario"
  };
  if (d <= 2 && mv < 30) return {
    pal: 1.375,
    nivel: "Ligeramente activo"
  };
  if (d <= 4) return {
    pal: 1.55,
    nivel: "Moderadamente activo"
  };
  if (d <= 5) return {
    pal: 1.725,
    nivel: "Activo"
  };
  return {
    pal: 1.90,
    nivel: "Muy activo"
  };
};
const calcFE = dx => {
  const d = Array.isArray(dx) ? dx : [];
  if (d.includes("Hipotiroidismo")) return {
    fe: 0.85,
    razon: "Hipotiroidismo (−15%)"
  };
  if (d.includes("Diabetes tipo 2") || d.includes("Prediabetes")) return {
    fe: 1.15,
    razon: "DM2/Prediabetes (+15%)"
  };
  if (d.includes("HTA")) return {
    fe: 1.10,
    razon: "HTA (+10%)"
  };
  if (d.includes("Dislipidemia (colesterol alto)")) return {
    fe: 1.05,
    razon: "Dislipidemia (+5%)"
  };
  return {
    fe: 1.0,
    razon: "Sin factor de estrés"
  };
};
const gebMifflin = (p, t, e, s) => {
  if (!p || !t || !e) return null;
  const b = 10 * p + 6.25 * t - 5 * e;
  return s === "Masculino" ? b + 5 : b - 161;
};
const gebHarris = (p, t, e, s) => {
  if (!p || !t || !e) return null;
  return s === "Masculino" ? 88.362 + 13.397 * p + 4.799 * t - 5.677 * e : 447.593 + 9.247 * p + 3.098 * t - 4.330 * e;
};
const calcConsumo = enc => {
  const tot = {
    kcal: 0,
    prot: 0,
    grasa: 0,
    cho: 0,
    fibra: 0,
    calcio: 0,
    hierro: 0,
    zinc: 0,
    vitC: 0,
    vitA: 0,
    folato: 0,
    potasio: 0,
    magnesio: 0,
    omega3: 0,
    sodio: 0
  };
  for (let i = 1; i <= 18; i++) {
    const p = Number(enc[`d1_${i}`]) || 0;
    if (!p) continue;
    const g = TCAC[i];
    Object.keys(tot).forEach(k => {
      tot[k] += (g[k] || 0) * p;
    });
  }
  return tot;
};
const generarAlertas = (enc, cons, get, rda, peso) => {
  const al = [];
  const dx = Array.isArray(enc.d5_39) ? enc.d5_39 : [];
  const alrg = Array.isArray(enc.d6_43) ? enc.d6_43 : [];
  const tca = Array.isArray(enc.d2_21) ? enc.d2_21 : [];
  const dias = parseInt(enc.d3_23) || 0;
  const agua = Number(enc.d1_16) || 0;
  if (["Laxantes", "Vómito", "Ejercicio excesivo"].some(t => tca.includes(t))) al.push({
    niv: "crítico",
    ico: "🚨",
    t: "TCA activo detectado",
    txt: "Banderas en ítem 21. Derivación urgente a psicología/psiquiatría.",
    dom: "D2"
  });
  if (dx.includes("Diabetes tipo 2") && (Number(enc.d1_15) || 0) >= 2) al.push({
    niv: "crítico",
    ico: "🔴",
    t: "Riesgo glucémico crítico",
    txt: `${Number(enc.d1_15)} porciones de bebidas azucaradas con DM2.`,
    dom: "D1+D5"
  });
  if (cons.sodio > 3000) al.push({
    niv: "crítico",
    ico: "🔴",
    t: "Sodio excesivo",
    txt: `${Math.round(cons.sodio)}mg/día (límite: 2300mg). Crítico con HTA.`,
    dom: "D1"
  });
  if (get && cons.kcal < get * 0.60) al.push({
    niv: "alto",
    ico: "🟠",
    t: "Déficit calórico severo",
    txt: `${Math.round(cons.kcal)} kcal = ${Math.round(cons.kcal / get * 100)}% del GET. Riesgo catabólico.`,
    dom: "D1"
  });
  if (get && cons.kcal > get * 1.40) al.push({
    niv: "alto",
    ico: "🟠",
    t: "Exceso calórico marcado",
    txt: `Consumo supera el GET en ${Math.round((cons.kcal - get) / get * 100)}%.`,
    dom: "D1"
  });
  if (dias >= 5 && peso && cons.prot < 1.2 * peso) al.push({
    niv: "alto",
    ico: "🟠",
    t: "Proteína insuficiente para nivel de actividad",
    txt: `${dias} días/sem de ejercicio + proteína ${cons.prot.toFixed(1)}g. Riesgo catabolismo.`,
    dom: "D1+D3"
  });
  if (agua <= 3 && enc.d7_58 === "Oscuro (naranja / marrón)") al.push({
    niv: "alto",
    ico: "🟠",
    t: "Deshidratación probable",
    txt: `Agua: ${agua} vasos + orina oscura.`,
    dom: "D1+D7"
  });
  if (cons.fibra < 15) al.push({
    niv: "moderado",
    ico: "🟡",
    t: "Fibra muy baja",
    txt: `${cons.fibra.toFixed(1)}g/día (RDA: ${rda.fibra}g).`,
    dom: "D1"
  });
  if (cons.hierro < rda.hierro * 0.5) al.push({
    niv: "moderado",
    ico: "🟡",
    t: "Déficit de hierro",
    txt: `${cons.hierro.toFixed(1)}mg (${Math.round(cons.hierro / rda.hierro * 100)}% RDA).`,
    dom: "D1"
  });
  if (cons.calcio < rda.calcio * 0.5) al.push({
    niv: "moderado",
    ico: "🟡",
    t: "Calcio insuficiente",
    txt: `${Math.round(cons.calcio)}mg (<50% RDA).`,
    dom: "D1"
  });
  if (enc.d3_29 >= 7 && (Number(enc.d1_14) || 0) >= 2) al.push({
    niv: "moderado",
    ico: "🟡",
    t: "Estrés alto + azúcares elevados",
    txt: "Patrón de alimentación emocional probable.",
    dom: "D3+D1"
  });
  if (alrg.includes("Leche") && cons.calcio < rda.calcio * 0.6) al.push({
    niv: "moderado",
    ico: "🟡",
    t: "Alergia a lácteos + calcio deficiente",
    txt: "Explorar fuentes alternativas o suplementación.",
    dom: "D6+D1"
  });
  if (cons.fibra >= rda.fibra) al.push({
    niv: "positivo",
    ico: "✅",
    t: "Excelente ingesta de fibra",
    txt: `${cons.fibra.toFixed(1)}g/día.`,
    dom: "D1"
  });
  if (cons.omega3 >= 1.0) al.push({
    niv: "positivo",
    ico: "✅",
    t: "Buena ingesta de Omega-3",
    txt: `${cons.omega3.toFixed(2)}g/día.`,
    dom: "D1"
  });
  if (agua >= 8) al.push({
    niv: "positivo",
    ico: "✅",
    t: "Hidratación adecuada",
    txt: `${agua} vasos de agua pura.`,
    dom: "D1+D7"
  });
  return al;
};

// ─── UI DEL MOTOR ─────────────────────────────────────────────


function ConsentimientoScreen({
  onAceptar,
  onRechazar
}) {
  const [scroll, setScroll] = (0, _react.useState)(false);
  const [checks, setChecks] = (0, _react.useState)({
    datos: false,
    salud: false,
    terceros: false,
    derechos: false,
    bioetica: false
  });
  const [firmaNombre, setFirmaNombre] = (0, _react.useState)("");
  const [firmaTouched, setFirmaTouched] = (0, _react.useState)(false);
  const allChecked = Object.values(checks).every(Boolean);
  const firmaValida = firmaNombre.trim().length >= 3;
  const canSign = allChecked && firmaValida;
  const toggle = k => setChecks(p => ({
    ...p,
    [k]: !p[k]
  }));
  const FECHA = new Date().toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
  const block = (title, body, icon = "📋") => /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#f8fffe",
      border: `1px solid ${T.accent}22`,
      borderLeft: `4px solid ${T.accent}`,
      borderRadius: 10,
      padding: "14px 18px",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 800,
      color: T.accent,
      marginBottom: 6
    }
  }, icon, " ", title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.text,
      lineHeight: 1.7
    }
  }, body));
  const Check = ({
    id,
    label
  }) => /*#__PURE__*/React.createElement("label", {
    onClick: () => toggle(id),
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      padding: "10px 14px",
      background: checks[id] ? "#f0fdf4" : "white",
      border: `2px solid ${checks[id] ? T.success : T.border}`,
      borderRadius: 10,
      cursor: "pointer",
      marginBottom: 8,
      transition: "all 0.15s"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 22,
      height: 22,
      borderRadius: 5,
      marginTop: 1,
      background: checks[id] ? T.success : "white",
      border: `2px solid ${checks[id] ? T.success : T.dim}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, checks[id] && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "white",
      fontSize: 14,
      fontWeight: 900
    }
  }, "\u2713")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: T.text,
      lineHeight: 1.5
    }
  }, label));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: T.bg,
      minHeight: "100vh",
      fontFamily: "'Nunito','Segoe UI',system-ui,sans-serif"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: T.surface,
      borderBottom: `1px solid ${T.border}`,
      padding: "14px 20px",
      position: "sticky",
      top: 0,
      zIndex: 100
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 800,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      letterSpacing: "0.18em",
      color: T.accent,
      fontWeight: 800,
      textTransform: "uppercase"
    }
  }, "Connected Nutrition Ventures"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 900,
      color: T.text
    }
  }, "\uD83D\uDD10 Consentimiento Informado \xB7 Encuesta CNV v3.0"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.muted,
      marginTop: 2
    }
  }, FECHA, " \xB7 Por favor lea y acepte antes de continuar"))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 800,
      margin: "0 auto",
      padding: "28px 16px 100px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "linear-gradient(135deg,#e8f5f1,#f0f9f6)",
      border: `2px solid ${T.accent}44`,
      borderRadius: 16,
      padding: "20px 24px",
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 800,
      color: T.accent,
      marginBottom: 8
    }
  }, "\xBFPor qu\xE9 este formulario?"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: T.text,
      lineHeight: 1.8
    }
  }, "Antes de iniciar la encuesta nutricional, CNV est\xE1 obligada \u2014por ley y por principios \xE9ticos\u2014 a informarle c\xF3mo ser\xE1n usados sus datos personales y de salud, y a obtener su autorizaci\xF3n libre, voluntaria e informada. Este documento cumple con la ", /*#__PURE__*/React.createElement("strong", null, "Ley 1581 de 2012"), ", la ", /*#__PURE__*/React.createElement("strong", null, "Ley 100 de 1993"), ", el ", /*#__PURE__*/React.createElement("strong", null, "C\xF3digo de N\xFAremberg (1947)"), " y la", " ", /*#__PURE__*/React.createElement("strong", null, "Declaraci\xF3n de Helsinki (2013)"), ".")), block("1. Responsable del tratamiento", /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("strong", null, "Connected Nutrition Ventures (CNV)"), ", representada por el profesional de salud que atiende esta consulta, es responsable del tratamiento de sus datos conforme al art\xEDculo 17 de la Ley 1581 de 2012 y el Decreto 1377 de 2013."), "🏢"), block("2. Datos que se recolectan en esta encuesta", /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("strong", null, "Datos personales:"), " nombre completo, documento de identidad, fecha de nacimiento, tel\xE9fono y correo electr\xF3nico.", " ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "Datos sociodemogr\xE1ficos:"), " etnia, nivel educativo, ocupaci\xF3n, estado civil, estrato.", " ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "Datos sensibles de salud (Art. 6, Ley 1581):"), " h\xE1bitos alimentarios, composici\xF3n corporal, diagn\xF3sticos cl\xEDnicos (diabetes, HTA, dislipidemia, hipotiroidismo), medicamentos, antecedentes familiares, conductas alimentarias, se\xF1ales de TCA, h\xE1bitos de sue\xF1o, consumo de tabaco y alcohol, s\xEDntomas digestivos e hidrataci\xF3n."), "📂"), block("3. Finalidad del tratamiento (Art. 13, Ley 1581)", /*#__PURE__*/React.createElement(React.Fragment, null, "Sus datos ser\xE1n usados ", /*#__PURE__*/React.createElement("strong", null, "exclusivamente"), " para: (a) elaborar su an\xE1lisis y plan nutricional personalizado en el Motor Nutricional CNV; (b) calcular indicadores cl\xEDnicos como el \xCDndice de Estr\xE9s Metab\xF3lico, LE8 y riesgo de sarcopenia; (c) mejorar los algoritmos de evaluaci\xF3n nutricional de CNV con datos anonimizados. ", /*#__PURE__*/React.createElement("strong", null, "Sus datos NO ser\xE1n vendidos ni cedidos con fines comerciales.")), "🎯"), block("4. Compartir con terceros", /*#__PURE__*/React.createElement(React.Fragment, null, "CNV podr\xE1 compartir sus datos \xFAnicamente con: (a) laboratorio cl\xEDnico de referencia para integraci\xF3n de resultados anal\xEDticos, ", /*#__PURE__*/React.createElement("strong", null, "siempre bajo su autorizaci\xF3n expresa"), "; (b) EPS o aseguradora cuando exista obligaci\xF3n legal o usted lo solicite; (c) proveedores tecnol\xF3gicos que operen bajo contratos de confidencialidad y cumplimiento de la Ley 1581. En ning\xFAn caso sus datos sensibles de salud ser\xE1n compartidos sin informarle."), "🔗"), block("5. Sus derechos como titular (Ley 1581/2012 · Ley 100/1993)", /*#__PURE__*/React.createElement(React.Fragment, null, "Usted tiene derecho a:", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("strong", null, "\u2022 Acceder"), " a sus datos en cualquier momento \xB7 ", /*#__PURE__*/React.createElement("strong", null, "\u2022 Rectificar"), " datos inexactos \xB7 ", /*#__PURE__*/React.createElement("strong", null, "\u2022 Suprimir"), " sus datos (derecho al olvido) \xB7", " ", /*#__PURE__*/React.createElement("strong", null, "\u2022 Revocar"), " este consentimiento sin consecuencias negativas para su atenci\xF3n \xB7", " ", /*#__PURE__*/React.createElement("strong", null, "\u2022 Presentar quejas"), " ante la Superintendencia de Industria y Comercio (SIC) \xB7", " ", /*#__PURE__*/React.createElement("strong", null, "\u2022 Recibir atenci\xF3n en salud"), " de calidad, con integralidad, continuidad y libre escogencia conforme a la Ley 100 de 1993."), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 8,
      color: T.muted
    }
  }, "Para ejercer estos derechos contacte: ", /*#__PURE__*/React.createElement("strong", null, "privacidad@cnvnutricion.com"))), "⚖️"), block("6. Principios bioéticos aplicables (Núremberg · Helsinki · Beauchamp & Childress)", /*#__PURE__*/React.createElement(React.Fragment, null, "Esta evaluaci\xF3n se rige por los cuatro principios fundamentales de la bio\xE9tica:", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("strong", null, "\u2022 Autonom\xEDa:"), " su participaci\xF3n es completamente voluntaria y puede retirarse en cualquier momento sin perjuicio alguno (C\xF3digo de N\xFAremberg, 1947 \u2014 Principio 1).", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u2022 Beneficencia:"), " toda la informaci\xF3n recolectada tiene como \xFAnico fin su beneficio nutricional y cl\xEDnico (Declaraci\xF3n de Helsinki, 2013 \u2014 Art. 8).", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u2022 No maleficencia:"), " CNV se compromete a no usar sus datos de forma que pueda causarle da\xF1o, discriminaci\xF3n o perjuicio.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("strong", null, "\u2022 Justicia:"), " recibir\xE1 la misma calidad de atenci\xF3n independientemente de sus condiciones sociodemogr\xE1ficas o de salud.")), "🧬"), block("7. Revocación del consentimiento", /*#__PURE__*/React.createElement(React.Fragment, null, "Usted puede revocar este consentimiento en cualquier momento de forma oral o escrita ante el profesional de salud o enviando una solicitud a ", /*#__PURE__*/React.createElement("strong", null, "privacidad@cnvnutricion.com"), ". La revocaci\xF3n no afecta la licitud del tratamiento realizado antes de su comunicaci\xF3n. Los datos ser\xE1n eliminados o anonimizados en un plazo m\xE1ximo de ", /*#__PURE__*/React.createElement("strong", null, "15 d\xEDas h\xE1biles"), "."), "🔄"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "white",
      border: `2px solid ${T.border}`,
      borderRadius: 16,
      padding: "20px",
      marginTop: 28,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 800,
      color: T.text,
      marginBottom: 14
    }
  }, "\u2705 Declaraciones de consentimiento \u2014 marque cada una"), /*#__PURE__*/React.createElement(Check, {
    id: "datos",
    label: "Autorizo el tratamiento de mis datos personales (nombre, documento, contacto) con la finalidad descrita en el numeral 3."
  }), /*#__PURE__*/React.createElement(Check, {
    id: "salud",
    label: "Autorizo el tratamiento de mis datos sensibles de salud (diagn\xF3sticos, medicamentos, h\xE1bitos, se\xF1ales de TCA) exclusivamente para an\xE1lisis nutricional."
  }), /*#__PURE__*/React.createElement(Check, {
    id: "terceros",
    label: "He sido informado/a sobre el posible compartir de mis datos con laboratorio, EPS o proveedores tecnol\xF3gicos bajo las condiciones del numeral 4, y acepto las condiciones."
  }), /*#__PURE__*/React.createElement(Check, {
    id: "derechos",
    label: "Conozco mis derechos como titular de datos (acceso, rectificaci\xF3n, supresi\xF3n, revocaci\xF3n) y s\xE9 c\xF3mo ejercerlos."
  }), /*#__PURE__*/React.createElement(Check, {
    id: "bioetica",
    label: "Entiendo que mi participaci\xF3n es voluntaria, que puedo retirarme sin consecuencias y que la informaci\xF3n se usar\xE1 bajo los principios de beneficencia, no maleficencia, autonom\xEDa y justicia."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "white",
      border: `2px solid ${allChecked ? T.success : T.border}`,
      borderRadius: 16,
      padding: "20px",
      marginBottom: 24,
      transition: "border-color 0.3s"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 800,
      color: T.text,
      marginBottom: 6
    }
  }, "\u270D\uFE0F Firma del consentimiento"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.muted,
      marginBottom: 12
    }
  }, "Escriba su nombre completo tal como aparece en su documento de identidad para validar su consentimiento. Fecha: ", FECHA), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: firmaNombre,
    onChange: e => {
      setFirmaNombre(e.target.value);
      setFirmaTouched(true);
    },
    placeholder: "Nombre completo del paciente / titular",
    style: {
      width: "100%",
      boxSizing: "border-box",
      padding: "14px 16px",
      border: `2px solid ${firmaTouched && !firmaValida ? T.danger : firmaValida ? T.success : T.border}`,
      borderRadius: 12,
      fontSize: 16,
      fontWeight: 600,
      color: T.text,
      background: firmaValida ? "#f0fdf4" : "white",
      outline: "none",
      fontFamily: "inherit",
      letterSpacing: "0.02em"
    }
  }), firmaTouched && !firmaValida && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.danger,
      marginTop: 4
    }
  }, "\u26A0 Escriba su nombre completo (m\xEDnimo 3 caracteres)"), canSign && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: T.success,
      marginTop: 6,
      fontWeight: 700
    }
  }, "\u2705 Consentimiento listo para registrar \xB7 ", FECHA)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onRechazar,
    style: {
      padding: "13px 24px",
      borderRadius: 14,
      border: `2px solid ${T.border}`,
      background: "white",
      color: T.muted,
      fontSize: 14,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, "\u2717 No acepto \u2014 Cancelar consulta"), /*#__PURE__*/React.createElement("button", {
    onClick: () => canSign && onAceptar({
      firmaNombre: firmaNombre.trim(),
      fechaConsentimiento: FECHA
    }),
    disabled: !canSign,
    style: {
      padding: "13px 36px",
      borderRadius: 14,
      border: "none",
      background: canSign ? T.accent : T.border,
      color: "white",
      fontSize: 15,
      fontWeight: 800,
      cursor: canSign ? "pointer" : "not-allowed",
      boxShadow: canSign ? "0 4px 16px rgba(26,107,90,0.35)" : "none",
      transition: "all 0.2s"
    }
  }, "Acepto \u2014 Iniciar encuesta \u2192")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: T.muted,
      textAlign: "center",
      marginTop: 12
    }
  }, "Este consentimiento quedar\xE1 registrado con fecha y nombre en el historial de la consulta.")));
}

// ═══════════════════════════════════════════════════════════════
// APP PRINCIPAL — controla las pantallas y el estado compartido
// ═══════════════════════════════════════════════════════════════

const TAB_ORDER = ["D0","D1","D2","D3","D4","D5","D6","D7","D8"];
const DOM_SECS = {D0,D1,D2,D3,D4,D5,D6,D7,D8};
const TABS_ENC = [
  {id:"D0",icon:"\uD83C\uDFE5"},
  {id:"D1",icon:"\uD83C\uDF7D\uFE0F"},
  {id:"D2",icon:"\uD83E\uDE9E"},
  {id:"D3",icon:"\uD83C\uDFC3"},
  {id:"D4",icon:"\u26A0\uFE0F"},
  {id:"D5",icon:"\uD83E\uDDEC"},
  {id:"D6",icon:"\uD83E\uDE7A"},
  {id:"D7",icon:"\uD83D\uDCA7"},
  {id:"D8",icon:"\uD83C\uDFE0"}
];


const QMAP_ENC = [
  // D1 — Patrón alimentario (grupos)
  {key:"d1_1_i",  num:1,  label:"Verduras y hortalizas — frecuencia de consumo", tab:"D1"},
  {key:"d1_2_i",  num:2,  label:"Frutas enteras — frecuencia de consumo", tab:"D1"},
  {key:"d1_3_i",  num:3,  label:"Leguminosas — frecuencia de consumo", tab:"D1"},
  {key:"d1_4_i",  num:4,  label:"Pescado y mariscos — frecuencia de consumo", tab:"D1"},
  {key:"d1_5_i",  num:5,  label:"Grasas saludables — frecuencia de consumo", tab:"D1"},
  {key:"d1_6_i",  num:6,  label:"Lácteos bajos en grasa / fermentados — frecuencia de consumo", tab:"D1"},
  {key:"d1_7_i",  num:7,  label:"Huevos — frecuencia de consumo", tab:"D1"},
  {key:"d1_8_i",  num:8,  label:"Cereales integrales — frecuencia de consumo", tab:"D1"},
  {key:"d1_9_i",  num:9,  label:"Tubérculos y raíces — frecuencia de consumo", tab:"D1"},
  {key:"d1_10_i", num:10, label:"Carnes magras — frecuencia de consumo", tab:"D1"},
  {key:"d1_11_i", num:11, label:"Cereales refinados y harinas — frecuencia de consumo", tab:"D1"},
  {key:"d1_12_i", num:12, label:"Carnes rojas y procesadas — frecuencia de consumo", tab:"D1"},
  {key:"d1_13_i", num:13, label:"Azúcares y dulces — frecuencia de consumo", tab:"D1"},
  {key:"d1_14_i", num:14, label:"Comida ultraprocesada — frecuencia de consumo", tab:"D1"},
  // D1 — Frecuencias suplementarias
  {key:"d1f_sal_i",   num:15, label:"¿Con qué frecuencia añade sal extra a la comida ya servida?", tab:"D1"},
  {key:"d1f_des_i",   num:16, label:"¿Desayuna regularmente (antes de las 10 am)?", tab:"D1"},
  {key:"d1f_noche_i", num:17, label:"¿A qué hora suele cenar?", tab:"D1"},
  {key:"d2_19",num:19,label:"\xBFC\xF3mo percibe su cuerpo actualmente?",tab:"D2"},
  {key:"d2_20",num:20,label:"\xBFQu\xE9 tan satisfecho/a est\xE1 con su peso?",tab:"D2"},
  {key:"d2_21",num:21,label:"\xBFQu\xE9 m\xE9todos ha usado para cambiar su peso?",tab:"D2"},
  {key:"d2_22",num:22,label:"\xBFCon qu\xE9 frecuencia pierde el control al comer?",tab:"D2"},
  {key:"d3_23",num:23,label:"\xBFCu\xE1ntos d\xEDas/semana hace actividad f\xEDsica (\u226530 min)?",tab:"D3"},
  {key:"d3_24",num:24,label:"\xBFCu\xE1nto dura cada sesi\xF3n?",tab:"D3"},
  {key:"d3_25",num:25,label:"\xBFQu\xE9 tipo de actividad realiza?",tab:"D3"},
  {key:"d3_26",num:26,label:"\xBFCu\xE1ntas horas duerme por noche?",tab:"D3"},
  {key:"d3_27",num:27,label:"\xBFC\xF3mo califica la calidad de su sue\xF1o?",tab:"D3"},
  {key:"d3_28",num:28,label:"\xBFRonca durante el sue\xF1o?",tab:"D3"},
  {key:"d3_29",num:29,label:"Nivel de estrés habitual (1–10)", tab:"D3"},
  {key:"d3_30",num:30,label:"\xBFSu relaci\xF3n con el tabaco / nicotina?",tab:"D3"},
  {key:"d3_31",num:31,label:"\xBFCon qu\xE9 frecuencia consume alcohol?",tab:"D3"},
  {key:"d4_32",num:32,label:"\xBFCu\xE1ntas comidas hace al d\xEDa?",tab:"D4"},
  {key:"d4_33",num:33,label:"\xBFDesayuna regularmente?",tab:"D4"},
  {key:"d4_34",num:34,label:"\xBFSigue alg\xFAn patr\xF3n alimentario?",tab:"D4"},
  {key:"d4_35",num:35,label:"\xBFQu\xE9 suplementos toma actualmente?",tab:"D4"},
  {key:"d5_36",num:36,label:"\xBFLe han diagnosticado hipertensi\xF3n arterial?",tab:"D5"},
  {key:"d5_37",num:37,label:"\xBFToma medicamentos para la presi\xF3n arterial?",tab:"D5"},
  {key:"d5_38",num:38,label:"\xBFFamiliares cercanos con estas enfermedades?",tab:"D5"},
  {key:"d5_39",num:39,label:"\xBFTiene alguno de estos diagn\xF3sticos personales?",tab:"D5"},
  {key:"d5_40",num:40,label:"\xBFQu\xE9 medicamentos toma actualmente?",tab:"D5"},
  {key:"d5_41",num:41,label:"\xBFFue amamantado/a en su infancia?",tab:"D5"},
  {key:"d5_42",num:42,label:"\xBFExposici\xF3n habitual a contaminantes?",tab:"D5"},
  {key:"d6_43",num:43,label:"\xBFAlergias alimentarias diagnosticadas?",tab:"D6"},
  {key:"d6_44",num:44,label:"\xBFIntolerancias alimentarias?",tab:"D6"},
  {key:"d6_45",num:45,label:"Hinchaz\xF3n abdominal",tab:"D6"},
  {key:"d6_46",num:46,label:"Gases / flatulencia",tab:"D6"},
  {key:"d6_47",num:47,label:"Dolor abdominal",tab:"D6"},
  {key:"d6_48",num:48,label:"Diarrea",tab:"D6"},
  {key:"d6_49",num:49,label:"Estre\xF1imiento",tab:"D6"},
  {key:"d6_50",num:50,label:"Reflujo / acidez",tab:"D6"},
  {key:"d6_51",num:51,label:"N\xE1useas",tab:"D6"},
  {key:"d6_qx",num:63,label:"Antecedentes quir\xFArgicos (digestivos / metab\xF3licos)",tab:"D6"},
  {key:"d7_52",  num:52, label:"Café — tazas por día", tab:"D7"},
  {key:"d7_53",  num:53, label:"Té — tazas por día", tab:"D7"},
  {key:"d7_54",  num:54, label:"Jugos — vasos por día", tab:"D7"},
  {key:"d7_55",  num:55, label:"Gaseosas — vasos por día", tab:"D7"},
  {key:"d7_agua",num:56, label:"Agua — vasos o litros por día", tab:"D7"},
  {key:"d7_56",  num:56, label:"Bebidas energéticas — latas por día", tab:"D7"},
  {key:"d7_57",num:57,label:"\xBFSiente sed con frecuencia?",tab:"D7"},
  {key:"d7_58",num:58,label:"\xBFColor de su orina habitualmente?",tab:"D7"},
  {key:"d8_59",num:59,label:"\xBFQui\xE9n prepara sus alimentos habitualmente?",tab:"D8"},
  {key:"d8_60",num:60,label:"\xBFCon qu\xE9 frecuencia come fuera de casa?",tab:"D8"},
  {key:"d8_61",num:61,label:"\xBFTiene acceso f\xE1cil a alimentos frescos y saludables?",tab:"D8"},
  {key:"d8_62",num:62,label:"\xBFHay momentos en que no tiene suficiente comida en el hogar?",tab:"D8"}
];

// ── Módulo Encuesta — solo estado para el profesional ────
// ── Verificación de condiciones de calidad de la toma de BIA ──────────────────
// Reemplaza el bloque de "Alertas clínicas" en la hoja de inicio del profesional.
// Las respuestas se guardan en data.biaQC y se persisten a Supabase (consultas.datos)
// como parte constitutiva de la información de cada paciente, vía guardar(data).
function BIAQualityCheck({ data, onUpdate }) {
  const qc = (data && data.biaQC) || {};
  const esMujer = /^(f|femenino|mujer)/i.test(String((data && data.sexo) || ""));
  const setQC = (k, v) => onUpdate && onUpdate({ biaQC: { ...qc, [k]: v } });

  const wrap  = { padding: "14px 24px 16px", borderBottom: "1px solid #e2e8f0" };
  const rowSt = { display: "flex", alignItems: "center", gap: 10, padding: "6px 0", borderBottom: "1px solid #f1f5f9" };
  const lblSt = { fontSize: 12.5, color: "#374151", flex: 1, lineHeight: 1.3 };
  const numSt = { width: 74, fontSize: 12, padding: "5px 8px", borderRadius: 8, border: "1.5px solid #cbd5e1", outline: "none", textAlign: "center", flexShrink: 0 };
  const txtSt = { flex: 1, minWidth: 90, fontSize: 12, padding: "5px 8px", borderRadius: 8, border: "1.5px solid #cbd5e1", outline: "none" };
  const selSt = v => ({
    fontSize: 12, fontWeight: 700, padding: "5px 10px", borderRadius: 8, cursor: "pointer", outline: "none", flexShrink: 0,
    border: "1.5px solid " + (v === "Sí" ? "#f59e0b" : v === "No" ? "#16a34a" : "#e2e8f0"),
    background:            v === "Sí" ? "#fffbeb" : v === "No" ? "#f0fdf4" : "white",
    color:                v === "Sí" ? "#b45309" : v === "No" ? "#15803d" : "#94a3b8"
  });

  const SiNo = k => React.createElement("select",
    { value: qc[k] || "", onChange: e => setQC(k, e.target.value), style: selSt(qc[k]) },
    React.createElement("option", { value: "" }, "—"),
    React.createElement("option", { value: "Sí" }, "Sí"),
    React.createElement("option", { value: "No" }, "No")
  );
  const Row = (label, k, extra) => React.createElement("div", { style: rowSt },
    React.createElement("span", { style: lblSt }, label),
    extra || null,
    SiNo(k)
  );

  return React.createElement("div", { style: wrap },
    React.createElement("div", { style: { fontSize: 10, fontWeight: 800, color: "#64748b", letterSpacing: "0.12em", marginBottom: 4 } },
      "🩺 VERIFICACIÓN DE CONDICIONES DE CALIDAD — TOMA DE BIA"),
    React.createElement("div", { style: { fontSize: 11, color: "#94a3b8", marginBottom: 8 } },
      "Verifique cada condición antes de realizar la bioimpedancia. Recuerde guardar (💾) para conservar los datos."),

    Row("¿Cuenta con placas metálicas?", "placasMetalicas"),
    Row("¿Tiene prótesis de manos o pies?", "protesisManosPies"),
    Row("¿Tiene marcapasos o equipos de soporte vital?", "marcapasos"),
    Row("¿Tomó café o alimentos hace menos de 3 horas?", "cafeAlimentos3h"),
    Row("¿Fue al baño antes de ingresar a la consulta?", "banoPrevio"),
    Row("¿Hizo ejercicio intenso hace menos de 4 horas?", "ejercicioIntenso4h"),

    React.createElement("div", { style: rowSt },
      React.createElement("span", { style: lblSt }, "¿Consume algún medicamento diurético?"),
      qc.diuretico === "Sí" ? React.createElement("input", {
        type: "text", placeholder: "¿Cuál?", value: qc.diureticoCual || "",
        onChange: e => setQC("diureticoCual", e.target.value), style: txtSt
      }) : null,
      SiNo("diuretico")
    ),

    Row("¿Se retiraron los accesorios metálicos en contacto con la piel antes de la BIA?", "accesoriosMetalicosRetirados"),

    esMujer && React.createElement("div", { style: { marginTop: 10, paddingTop: 8, borderTop: "1px dashed #e2e8f0" } },
      React.createElement("div", { style: { fontSize: 10, fontWeight: 800, color: "#be185d", letterSpacing: "0.1em", marginBottom: 2 } }, "SOLO MUJERES"),
      Row("¿Está en embarazo?", "embarazo"),
      React.createElement("div", { style: rowSt },
        React.createElement("span", { style: lblSt }, "¿Está menstruando?"),
        qc.menstruando === "Sí" ? React.createElement("input", {
          type: "number", min: 1, placeholder: "Día", title: "¿En qué día del periodo se encuentra?",
          value: qc.diaPeriodo || "", onChange: e => setQC("diaPeriodo", e.target.value), style: numSt
        }) : null,
        SiNo("menstruando")
      ),
      React.createElement("div", { style: rowSt },
        React.createElement("span", { style: lblSt }, "¿En qué semana de su ciclo se encuentra?"),
        React.createElement("input", {
          type: "number", min: 1, max: 6, placeholder: "Sem.",
          value: qc.semanaCiclo || "", onChange: e => setQC("semanaCiclo", e.target.value), style: numSt
        })
      )
    )
  );
}

