// Datos de ejemplo de la FES Aragón (simulación).
// Todas las páginas leen este archivo, así que los datos se escriben una sola vez.

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
  { clave: "M1", nombre: "Diseño Lógico", profesor: "Mtro. Luis García", salon: "Lab. 2" },
  { clave: "M2", nombre: "Diseño y Análisis de Algoritmos", profesor: "Dra. Elena Ríos", salon: "A-204" },
  { clave: "M3", nombre: "Lenguajes y Autómatas", profesor: "Mtro. Raúl Soto", salon: "A-210" },
  { clave: "M4", nombre: "Programación Web", profesor: "Mtra. Carmen Vega", salon: "Lab. 4" },
  { clave: "M5", nombre: "Bases de Datos", profesor: "Dr. Jorge Núñez", salon: "A-105" }
];

// Horario: cada materia con su día y hora
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

const TAREAS = [
  { id: 1, materia: "M1", titulo: "Reporte de la Práctica 3", tipo: "Tarea", entrega: "20 nov", entregada: false },
  { id: 2, materia: "M2", titulo: "Técnicas de diseño de algoritmos", tipo: "Proyecto", entrega: "25 nov", entregada: false },
  { id: 3, materia: "M3", titulo: "Ejercicios de expresiones regulares", tipo: "Tarea", entrega: "18 nov", entregada: true },
  { id: 4, materia: "M4", titulo: "Página web del proyecto final", tipo: "Proyecto", entrega: "2 dic", entregada: false },
  { id: 5, materia: "M5", titulo: "Modelo entidad-relación", tipo: "Tarea", entrega: "22 nov", entregada: true }
];

const CALIFICACIONES = [
  { materia: "M1", p1: 9.0, p2: 8.5, p3: null },
  { materia: "M2", p1: 8.0, p2: 9.0, p3: null },
  { materia: "M3", p1: 7.5, p2: 8.0, p3: null },
  { materia: "M4", p1: 10, p2: 9.5, p3: null },
  { materia: "M5", p1: 8.5, p2: 8.0, p3: null }
];

// Busca el nombre de una materia a partir de su clave
function nombreMateria(clave) {
  return MATERIAS.find(function (m) { return m.clave === clave; }).nombre;
}

// ===== Datos del profesor (Diseño Lógico, grupo 1301) =====
const LISTA_ALUMNOS = [
  { cuenta: "321045678", nombre: "Ana Torres Ruiz", p1: 9.0, p2: 8.5, p3: null },
  { cuenta: "321078912", nombre: "Luis Hernández Mora", p1: 8.0, p2: null, p3: null },
  { cuenta: "321056734", nombre: "María Gómez Salas", p1: 10, p2: 9.0, p3: null },
  { cuenta: "321090125", nombre: "Diego Ramírez Peña", p1: 7.0, p2: null, p3: null },
  { cuenta: "321012456", nombre: "Sofía Cruz Lara", p1: 9.5, p2: 9.0, p3: null },
  { cuenta: "321067890", nombre: "Carlos Mendoza Ortiz", p1: 6.5, p2: null, p3: null }
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

// ===== Guardar y cargar (para que las interfaces compartan los cambios) =====
const LLAVE = "educontrol_datos";

function guardarDatos() {
  localStorage.setItem(LLAVE, JSON.stringify({
    TAREAS: TAREAS, CALIFICACIONES: CALIFICACIONES, LISTA_ALUMNOS: LISTA_ALUMNOS,
    RESERVAS: RESERVAS, ASISTENCIAS: ASISTENCIAS, PAGOS: PAGOS, GASTOS: GASTOS
  }));
}

function cargarDatos() {
  const guardado = JSON.parse(localStorage.getItem(LLAVE) || "null");
  if (!guardado) return;
  TAREAS.splice(0, TAREAS.length, ...guardado.TAREAS);
  CALIFICACIONES.splice(0, CALIFICACIONES.length, ...guardado.CALIFICACIONES);
  LISTA_ALUMNOS.splice(0, LISTA_ALUMNOS.length, ...guardado.LISTA_ALUMNOS);
  RESERVAS.splice(0, RESERVAS.length, ...guardado.RESERVAS);
  ASISTENCIAS.splice(0, ASISTENCIAS.length, ...guardado.ASISTENCIAS);
  if (guardado.PAGOS) PAGOS.splice(0, PAGOS.length, ...guardado.PAGOS);
  if (guardado.GASTOS) GASTOS.splice(0, GASTOS.length, ...guardado.GASTOS);
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
