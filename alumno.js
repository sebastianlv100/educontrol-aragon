// ===== 1. Protección: solo entra quien inició sesión como alumno =====
const sesion = JSON.parse(sessionStorage.getItem("sesion") || "null");
if (!sesion || sesion.rol !== "alumno") {
  window.location.href = "index.html";
}

document.getElementById("saludo").textContent = ALUMNO.nombre + " · Cuenta " + ALUMNO.cuenta;
document.getElementById("salir").addEventListener("click", function () {
  sessionStorage.removeItem("sesion");
  window.location.href = "index.html";
});

// ===== 2. Pestañas =====
const botonesPestana = document.querySelectorAll("#pestanas button");
const paneles = document.querySelectorAll(".panel");

botonesPestana.forEach(function (boton) {
  boton.addEventListener("click", function () {
    botonesPestana.forEach(function (b) { b.classList.remove("activa"); });
    paneles.forEach(function (p) { p.classList.remove("activo"); });
    boton.classList.add("activa");
    document.getElementById(boton.dataset.panel).classList.add("activo");
  });
});

// ===== 3. Calificaciones y promedio =====
function promedio(c) {
  const notas = [c.p1, c.p2, c.p3].filter(function (n) { return n !== null; });
  if (notas.length === 0) return null;
  const suma = notas.reduce(function (a, b) { return a + b; }, 0);
  return suma / notas.length;
}

function dibujarCalificaciones() {
  const tabla = document.getElementById("tablaCalif");
  tabla.innerHTML = "";
  CALIFICACIONES.forEach(function (c) {
    const prom = promedio(c);
    const fila = document.createElement("tr");
    fila.innerHTML =
      "<td>" + nombreMateria(c.materia) + "</td>" +
      "<td>" + (c.p1 ?? "—") + "</td><td>" + (c.p2 ?? "—") + "</td><td>" + (c.p3 ?? "—") + "</td>" +
      "<td><strong>" + (prom === null ? "—" : prom.toFixed(1)) + "</strong></td>";
    tabla.appendChild(fila);
  });
}

function promedioGeneral() {
  const proms = CALIFICACIONES.map(promedio).filter(function (p) { return p !== null; });
  const suma = proms.reduce(function (a, b) { return a + b; }, 0);
  return (suma / proms.length).toFixed(1);
}

// ===== 4. Horario =====
function dibujarHorario() {
  const tabla = document.getElementById("tablaHorario");
  HORARIO.forEach(function (h) {
    const materia = MATERIAS.find(function (m) { return m.clave === h.materia; });
    const fila = document.createElement("tr");
    fila.innerHTML = "<td>" + h.dia + "</td><td>" + h.hora + "</td><td>" + materia.nombre + "</td><td>" + materia.salon + "</td>";
    tabla.appendChild(fila);
  });
}

// ===== 5. Tareas y proyectos =====
function dibujarTareas() {
  const lista = document.getElementById("listaTareas");
  lista.innerHTML = "";
  TAREAS.forEach(function (t) {
    const item = document.createElement("li");
    const estado = t.entregada
      ? '<span class="etiqueta entregada">Entregada</span>'
      : '<span class="etiqueta pendiente">Pendiente</span>';
    const boton = t.entregada
      ? ""
      : '<button class="boton" data-id="' + t.id + '">Marcar como entregada</button>';
    item.innerHTML =
      "<div><strong>" + limpiar(t.titulo) + "</strong><small>" + t.tipo + " · " + nombreMateria(t.materia) +
      " · Entrega: " + t.entrega + "</small></div><div>" + estado + " " + boton + "</div>";
    lista.appendChild(item);
  });
  dibujarResumen();
}

document.getElementById("listaTareas").addEventListener("click", function (evento) {
  const boton = evento.target.closest("button");
  if (!boton) return;
  const tarea = TAREAS.find(function (t) { return t.id === Number(boton.dataset.id); });
  tarea.entregada = true;
  guardarDatos();
  dibujarTareas();
});

// ===== 6. Resumen e inscripción =====
function dibujarResumen() {
  const pendientes = TAREAS.filter(function (t) { return !t.entregada; }).length;
  document.getElementById("tarjetasResumen").innerHTML =
    "<div><strong>" + promedioGeneral() + "</strong>Promedio general</div>" +
    "<div><strong>" + pendientes + "</strong>Tareas pendientes</div>" +
    "<div><strong>" + MATERIAS.length + "</strong>Materias inscritas</div>" +
    "<div><strong>" + ALUMNO.grupo + "</strong>Grupo</div>";
}

function dibujarInscripcion() {
  document.getElementById("tarjetasInsc").innerHTML =
    "<div><strong>" + ALUMNO.inscripcion + "</strong>Estado de inscripción</div>" +
    "<div><strong>" + ALUMNO.semestre + "</strong>Semestre</div>" +
    "<div><strong>" + ALUMNO.carrera + "</strong>Carrera</div>";
  const tabla = document.getElementById("tablaInsc");
  MATERIAS.forEach(function (m) {
    const fila = document.createElement("tr");
    fila.innerHTML = "<td>" + m.nombre + "</td><td>" + m.profesor + "</td>";
    tabla.appendChild(fila);
  });
}

dibujarCalificaciones();
dibujarHorario();
dibujarTareas();
dibujarInscripcion();
