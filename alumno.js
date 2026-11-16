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

// ===== 3. Calificaciones =====
function promedio(c) {
  const notas = [c.p1, c.p2, c.p3].filter(function (n) { return n !== null; });
  if (notas.length === 0) return null;
  return notas.reduce(function (a, b) { return a + b; }, 0) / notas.length;
}

function notaDeMateria(c) {
  return c.materia === "M1" ? notaVigente(ALUMNO.cuenta) : promedio(c);
}

function promedioGeneral() {
  const notas = CALIFICACIONES.map(notaDeMateria).filter(function (n) { return n !== null; });
  if (notas.length === 0) return "—";
  return (notas.reduce(function (a, b) { return a + b; }, 0) / notas.length).toFixed(1);
}

function dibujarCalificaciones() {
  const tabla = document.getElementById("tablaCalif");
  tabla.innerHTML = "";
  CALIFICACIONES.forEach(function (c) {
    const fila = document.createElement("tr");
    const nota = notaDeMateria(c);
    const texto = nota === null ? "—" : nota.toFixed(1);
    if (c.materia === "M1") {
      const estado = EVALUACION.finalizado ? " (final)" : " (acumulada)";
      fila.innerHTML = "<td>" + nombreMateria(c.materia) + "</td>" +
        '<td colspan="3">Según la evaluación del profesor: tareas, exámenes y proyecto</td>' +
        "<td><strong>" + texto + estado + "</strong></td>";
    } else {
      fila.innerHTML = "<td>" + nombreMateria(c.materia) + "</td>" +
        "<td>" + (c.p1 ?? "—") + "</td><td>" + (c.p2 ?? "—") + "</td><td>" + (c.p3 ?? "—") + "</td>" +
        "<td><strong>" + texto + "</strong></td>";
    }
    tabla.appendChild(fila);
  });
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

// ===== 5. Tareas y proyectos (como en Classroom) =====
function entrego(tarea) {
  const e = buscarEntrega(tarea.id, ALUMNO.cuenta);
  return e !== null && e.archivo !== null;
}

function mostrarMensaje(texto, bien) {
  const p = document.getElementById("msgTarea");
  p.textContent = texto;
  p.className = "mensaje " + (bien ? "ok" : "mal");
}

function dibujarTareas() {
  const lista = document.getElementById("listaTareas");
  lista.innerHTML = "";
  TAREAS.forEach(function (t) {
    const e = buscarEntrega(t.id, ALUMNO.cuenta);
    const calificada = e !== null && e.calificacion !== null;
    const cerrada = t.materia === "M1" && EVALUACION.finalizado;

    let estado;
    if (t.tipo === "Examen") {
      estado = calificada ? '<span class="etiqueta entregada">Calificado</span>' : '<span class="etiqueta pendiente">Sin calificar</span>';
    } else {
      estado = entrego(t) ? '<span class="etiqueta entregada">Entregada</span>' : '<span class="etiqueta pendiente">Pendiente</span>';
    }

    let control = "";
    if (t.tipo !== "Examen" && !entrego(t) && !cerrada) {
      control = '<input type="file"> <button class="boton" data-id="' + t.id + '">Entregar</button>';
    }

    let detalle = "<small>" + t.tipo + " · " + nombreMateria(t.materia) + " · Entrega: " + t.entrega + "</small>";
    if (t.instrucciones) detalle += "<small>Instrucciones: " + limpiar(t.instrucciones) + "</small>";
    if (t.archivos.length > 0) detalle += "<small>Archivos del profesor: " + t.archivos.map(limpiar).join(", ") + "</small>";
    if (entrego(t)) detalle += "<small>Tu entrega: " + limpiar(e.archivo) + "</small>";
    if (calificada) {
      detalle += "<small><strong>Calificación: " + e.calificacion + "</strong>" +
        (e.comentario ? " · Comentario del profesor: " + limpiar(e.comentario) : "") + "</small>";
    }

    const item = document.createElement("li");
    item.innerHTML = "<div><strong>" + limpiar(t.titulo) + "</strong>" + detalle + "</div><div>" + estado + " " + control + "</div>";
    lista.appendChild(item);
  });
  dibujarResumen();
}

document.getElementById("listaTareas").addEventListener("click", function (evento) {
  const boton = evento.target.closest("button");
  if (!boton) return;
  const archivo = boton.closest("li").querySelector("input[type=file]").files[0];
  if (!archivo) {
    mostrarMensaje("Primero elige el archivo que vas a entregar.", false);
    return;
  }
  const id = Number(boton.dataset.id);
  const hoy = new Date().toISOString().slice(0, 10);
  const existente = buscarEntrega(id, ALUMNO.cuenta);
  if (existente) {
    existente.archivo = archivo.name;
    existente.fecha = hoy;
  } else {
    ENTREGAS.push({ tareaId: id, cuenta: ALUMNO.cuenta, archivo: archivo.name, fecha: hoy, calificacion: null, comentario: "" });
  }
  guardarDatos();
  dibujarTareas();
  mostrarMensaje("Entrega enviada: " + archivo.name, true);
});

// ===== 6. Resumen e inscripción =====
function dibujarResumen() {
  const pendientes = TAREAS.filter(function (t) { return t.tipo !== "Examen" && !entrego(t); }).length;
  document.getElementById("tarjetasResumen").innerHTML =
    "<div><strong>" + promedioGeneral() + "</strong>Promedio general</div>" +
    "<div><strong>" + pendientes + "</strong>Tareas pendientes</div>" +
    "<div><strong>" + MATERIAS.length + "</strong>Materias inscritas</div>" +
    "<div><strong>" + ALUMNO.grupo + "</strong>Grupo</div>";
}

function dibujarInscripcion() {
  document.getElementById("tarjetasInsc").innerHTML =
    "<div><strong>" + ALUMNO.inscripcion + "</strong>Estado de inscripción</div>" +
    "<div><strong>" + ALUMNO.semestre + "</strong>Ciclo escolar</div>" +
    "<div><strong>" + ALUMNO.carrera + "</strong>Nivel</div>";
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
