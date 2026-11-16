// Datos de ejemplo de la FES Aragón (simulación). Todas las páginas leen este archivo.
// Para cambiar el nombre, los precios o el contacto, solo edita ESCUELA.

const ESCUELA = {
  nombre: "FES Aragón",
  lema: "Facultad de Estudios Superiores Aragón, UNAM · Nezahualcóyotl, Estado de México",
  niveles: [
    { nombre: "Licenciatura", detalle: "Ingeniería (Civil, Eléctrica Electrónica, Industrial, Mecánica y en Computación), Arquitectura, Diseño Industrial, Derecho, Economía, Relaciones Internacionales, Comunicación y Periodismo, Pedagogía, Sociología y Planificación para el Desarrollo Agropecuario" },
    { nombre: "SUAyED", detalle: "Sistema abierto y a distancia: Derecho, Economía y Relaciones Internacionales" },
    { nombre: "Posgrado", detalle: "Maestrías, doctorados y diplomados" }
  ],
  ofrece: [
    "Aulas, laboratorios y talleres para las prácticas de cada carrera",
    "Biblioteca y centros de cómputo",
    "Servicio social y programas de actualización",
    "Orientación vocacional y tutorías",
    "Plataforma EDUCONTROL: horario, tareas, calificaciones y pagos en línea"
  ],
  costos: [
    { concepto: "Colegiatura mensual", costo: "No se cobra: la UNAM es una universidad pública" },
    { concepto: "Inscripción a licenciatura", costo: "Cuota simbólica (consulta el monto vigente en la UNAM)" },
    { concepto: "Cuota de laboratorio (ejemplo de la simulación)", costo: "$350.00" },
    { concepto: "Credencial (ejemplo de la simulación)", costo: "$120.00" },
    { concepto: "Curso de idiomas (ejemplo de la simulación)", costo: "$900.00" },
    { concepto: "Examen extraordinario (ejemplo de la simulación)", costo: "$200.00" }
  ],
  contacto: {
    direccion: "Nezahualcóyotl, Estado de México",
    sitio: "https://www.aragon.unam.mx",
    correo: "orientacionvocacional@aragon.unam.mx"
  }
};

const USUARIOS = [
  { rol: "alumno", usuario: "321045678", clave: "alumno123", nombre: "Ana Torres Ruiz", pagina: "alumno.html" },
  { rol: "profesor", usuario: "prof.garcia", clave: "prof123", nombre: "Mtro. Luis García", pagina: "profesor.html" },
  { rol: "admin", usuario: "admin", clave: "admin123", nombre: "Administración escolar", pagina: "admin.html" }
];

const ALUMNO = {
  nombre: "Ana Torres Ruiz",
  cuenta: "321045678",
  carrera: "Ingeniería en Computación",
  grupo: "1301",
  semestre: "2027-1",
  inscripcion: "Vigente"
};

const MATERIAS = [
  { clave: "M1", nombre: "Diseño Lógico", profesor: "Mtro. Luis García", salon: "Lab. de Electrónica" },
  { clave: "M2", nombre: "Diseño y Análisis de Algoritmos", profesor: "Dra. Elena Ríos", salon: "A-204" },
  { clave: "M3", nombre: "Lenguajes y Autómatas", profesor: "Mtro. Raúl Soto", salon: "A-210" },
  { clave: "M4", nombre: "Programación Web", profesor: "Mtra. Carmen Vega", salon: "Lab. de Cómputo 4" },
  { clave: "M5", nombre: "Bases de Datos", profesor: "Dr. Jorge Núñez", salon: "A-105" }
];

// Horario del alumno (grupo 1301)
const HORARIO = [
  { dia: "Lunes", hora: "8:00 – 10:00", materia: "M1" },
  { dia: "Lunes", hora: "10:00 – 12:00", materia: "M2" },
  { dia: "Martes", hora: "8:00 – 10:00", materia: "M3" },
  { dia: "Martes", hora: "12:00 – 14:00", materia: "M4" },
  { dia: "Miércoles", hora: "8:00 – 10:00", materia: "M1" },
  { dia: "Miércoles", hora: "10:00 – 12:00", materia: "M5" },
  { dia: "Jueves", hora: "10:00 – 12:00", materia: "M2" },
  { dia: "Viernes", hora: "8:00 – 10:00", materia: "M3" },
  { dia: "Viernes", hora: "12:00 – 14:00", materia: "M4" }
];

// Horario del profesor (da Diseño Lógico a dos grupos)
const HORARIO_PROFESOR = [
  { dia: "Lunes", hora: "8:00 – 10:00", grupo: "1301", salon: "Lab. de Electrónica" },
  { dia: "Martes", hora: "10:00 – 12:00", grupo: "1302", salon: "Lab. de Electrónica" },
  { dia: "Miércoles", hora: "8:00 – 10:00", grupo: "1301", salon: "Lab. de Electrónica" },
  { dia: "Jueves", hora: "12:00 – 14:00", grupo: "1302", salon: "Lab. de Electrónica" },
  { dia: "Viernes", hora: "10:00 – 12:00", grupo: "1301", salon: "Lab. de Electrónica" }
];

// Cómo se calcula la calificación de Diseño Lógico (la cambia el profesor)
const EVALUACION = { tareas: 50, examenes: 30, proyecto: 20, extra: 2, finalizado: false };

// Tipos: "Tarea", "Examen", "Proyecto" o "Puntos extra"
const TAREAS = [
  { id: 1, materia: "M1", tipo: "Tarea", titulo: "Reporte de la Práctica 3", entrega: "20 nov",
    instrucciones: "Entrega el reporte con el desarrollo y las conclusiones del circuito combinacional.", archivos: ["guia_practica3.pdf"] },
  { id: 2, materia: "M1", tipo: "Proyecto", titulo: "Diseño de un circuito combinacional", entrega: "2 dic",
    instrucciones: "Diseña y arma un circuito que resuelva un problema real. Incluye el diagrama.", archivos: ["rubrica_proyecto.pdf"] },
  { id: 3, materia: "M3", tipo: "Tarea", titulo: "Ejercicios de expresiones regulares", entrega: "18 nov",
    instrucciones: "Resuelve los ejercicios de unión, concatenación y estrella.", archivos: [] },
  { id: 4, materia: "M4", tipo: "Proyecto", titulo: "Página web del proyecto final", entrega: "2 dic",
    instrucciones: "Sube los archivos de tu página en un ZIP.", archivos: [] },
  { id: 5, materia: "M5", tipo: "Tarea", titulo: "Modelo entidad-relación", entrega: "22 nov",
    instrucciones: "Entrega el diagrama del modelo.", archivos: [] },
  { id: 6, materia: "M1", tipo: "Examen", titulo: "Examen parcial: álgebra de Boole", entrega: "13 nov",
    instrucciones: "Examen presencial en el aula.", archivos: [] }
];

// Lo que entregó cada alumno y lo que el profesor calificó
const ENTREGAS = [
  { tareaId: 1, cuenta: "321045678", archivo: "practica3_ana.pdf", fecha: "2026-11-14", calificacion: 9, comentario: "Muy bien, revisa el circuito del punto 4." },
  { tareaId: 1, cuenta: "321078912", archivo: "practica3_luis.pdf", fecha: "2026-11-15", calificacion: null, comentario: "" },
  { tareaId: 1, cuenta: "321056734", archivo: "practica3_maria.pdf", fecha: "2026-11-13", calificacion: 10, comentario: "Excelente." },
  { tareaId: 1, cuenta: "321012456", archivo: "practica3_sofia.pdf", fecha: "2026-11-14", calificacion: 9.5, comentario: "" },
  { tareaId: 6, cuenta: "321045678", archivo: null, fecha: null, calificacion: 8.5, comentario: "" },
  { tareaId: 6, cuenta: "321056734", archivo: null, fecha: null, calificacion: 9, comentario: "" },
  { tareaId: 3, cuenta: "321045678", archivo: "expresiones_ana.pdf", fecha: "2026-11-12", calificacion: null, comentario: "" },
  { tareaId: 5, cuenta: "321045678", archivo: "modelo_er_ana.pdf", fecha: "2026-11-11", calificacion: null, comentario: "" }
];

// Materias con parciales fijos (Diseño Lógico se calcula con la evaluación del profesor)
const CALIFICACIONES = [
  { materia: "M1", p1: null, p2: null, p3: null },
  { materia: "M2", p1: 8.0, p2: 9.0, p3: null },
  { materia: "M3", p1: 7.5, p2: 8.0, p3: null },
  { materia: "M4", p1: 10, p2: 9.5, p3: null },
  { materia: "M5", p1: 8.5, p2: 8.0, p3: null }
];

// Alumnos del grupo 1301 de Diseño Lógico
const LISTA_ALUMNOS = [
  { cuenta: "321045678", nombre: "Ana Torres Ruiz", final: null },
  { cuenta: "321078912", nombre: "Luis Hernández Mora", final: null },
  { cuenta: "321056734", nombre: "María Gómez Salas", final: null },
  { cuenta: "321090125", nombre: "Diego Ramírez Peña", final: null },
  { cuenta: "321012456", nombre: "Sofía Cruz Lara", final: null },
  { cuenta: "321067890", nombre: "Carlos Mendoza Ortiz", final: null }
];

const RECURSOS = [
  "Laboratorio 1", "Laboratorio 2", "Laboratorio 3", "Laboratorio 4",
  "Aula A-101", "Aula A-204", "Auditorio",
  "Equipo: Proyector", "Equipo: Kit de Arduino", "Equipo: Laptops"
];

const RESERVAS = [
  { id: 1, recurso: "Laboratorio 2", fecha: "2026-11-23", hora: "08:00", profesor: "Mtro. Luis García" },
  { id: 2, recurso: "Equipo: Proyector", fecha: "2026-11-24", hora: "10:00", profesor: "Dra. Elena Ríos" }
];

const ASISTENCIAS = [];

// ===== Contabilidad =====
const PAGOS = [
  { id: 1, cuenta: "321045678", concepto: "Cuota de laboratorio", monto: 350, pagado: true },
  { id: 2, cuenta: "321078912", concepto: "Cuota de laboratorio", monto: 350, pagado: false },
  { id: 3, cuenta: "321056734", concepto: "Cuota de laboratorio", monto: 350, pagado: true },
  { id: 4, cuenta: "321090125", concepto: "Credencial", monto: 120, pagado: false },
  { id: 5, cuenta: "321012456", concepto: "Curso de idiomas", monto: 900, pagado: true },
  { id: 6, cuenta: "321067890", concepto: "Examen extraordinario", monto: 200, pagado: false }
];

const GASTOS = [
  { id: 1, concepto: "Mantenimiento de laboratorios", monto: 4500, fecha: "2026-11-02" },
  { id: 2, concepto: "Compra de kits de Arduino", monto: 8200, fecha: "2026-11-05" },
  { id: 3, concepto: "Papelería", monto: 1200, fecha: "2026-11-09" }
];

// ===== Funciones compartidas =====
function nombreMateria(clave) {
  return MATERIAS.find(function (m) { return m.clave === clave; }).nombre;
}

function buscarEntrega(tareaId, cuenta) {
  return ENTREGAS.find(function (e) { return e.tareaId === tareaId && e.cuenta === cuenta; }) || null;
}

// Calificación de Diseño Lógico según los porcentajes que puso el profesor.
// Lo que no se entregó o no se ha calificado cuenta como 0.
// Si todavía no hay actividades de un tipo, su porcentaje no cuenta.
function calcularNota(cuenta) {
  const grupos = [
    { tipo: "Tarea", peso: EVALUACION.tareas },
    { tipo: "Examen", peso: EVALUACION.examenes },
    { tipo: "Proyecto", peso: EVALUACION.proyecto }
  ];
  let suma = 0;
  let pesos = 0;

  grupos.forEach(function (g) {
    const lista = TAREAS.filter(function (t) { return t.materia === "M1" && t.tipo === g.tipo; });
    if (lista.length === 0) return;
    const total = lista.reduce(function (acc, t) {
      const e = buscarEntrega(t.id, cuenta);
      return acc + (e && e.calificacion !== null ? e.calificacion : 0);
    }, 0);
    suma += (total / lista.length) * g.peso;
    pesos += g.peso;
  });

  if (pesos === 0) return null;

  // Puntos extra: se suman, sin pasar del máximo que puso el profesor
  const extras = TAREAS.filter(function (t) { return t.materia === "M1" && t.tipo === "Puntos extra"; });
  const bonus = extras.reduce(function (acc, t) {
    const e = buscarEntrega(t.id, cuenta);
    return acc + (e && e.calificacion !== null ? e.calificacion : 0);
  }, 0);

  return Math.min(10, suma / pesos + Math.min(bonus, EVALUACION.extra));
}

// Si el ciclo ya se finalizó usa la calificación guardada; si no, la calculada
function notaVigente(cuenta) {
  if (EVALUACION.finalizado) {
    const a = LISTA_ALUMNOS.find(function (x) { return x.cuenta === cuenta; });
    return a && a.final !== null ? a.final : null;
  }
  return calcularNota(cuenta);
}

// ===== Guardar y cargar (para que las interfaces compartan los cambios) =====
const LLAVE = "educontrol_datos_v2";

function guardarDatos() {
  localStorage.setItem(LLAVE, JSON.stringify({
    TAREAS: TAREAS, ENTREGAS: ENTREGAS, LISTA_ALUMNOS: LISTA_ALUMNOS, RESERVAS: RESERVAS,
    ASISTENCIAS: ASISTENCIAS, PAGOS: PAGOS, GASTOS: GASTOS, EVALUACION: EVALUACION
  }));
}

function cargarDatos() {
  const guardado = JSON.parse(localStorage.getItem(LLAVE) || "null");
  if (!guardado) return;
  TAREAS.splice(0, TAREAS.length, ...guardado.TAREAS);
  ENTREGAS.splice(0, ENTREGAS.length, ...guardado.ENTREGAS);
  LISTA_ALUMNOS.splice(0, LISTA_ALUMNOS.length, ...guardado.LISTA_ALUMNOS);
  RESERVAS.splice(0, RESERVAS.length, ...guardado.RESERVAS);
  ASISTENCIAS.splice(0, ASISTENCIAS.length, ...guardado.ASISTENCIAS);
  PAGOS.splice(0, PAGOS.length, ...guardado.PAGOS);
  GASTOS.splice(0, GASTOS.length, ...guardado.GASTOS);
  Object.assign(EVALUACION, guardado.EVALUACION);
}

// Escribe un número como dinero: 1500 -> $1,500.00
function dinero(n) {
  return n.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
}

// Evita que un texto escrito por el usuario rompa la página
function limpiar(texto) {
  const caja = document.createElement("div");
  caja.textContent = texto;
  return caja.innerHTML;
}

cargarDatos();
