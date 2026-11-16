// ===== 1. Protección: solo entra quien inició sesión como profesor =====
const sesion = JSON.parse(sessionStorage.getItem("sesion") || "null");
if (!sesion || sesion.rol !== "profesor") {
  window.location.href = "index.html";
}

document.getElementById("saludo").textContent = sesion ? sesion.nombre : "";
document.getElementById("salir").addEventListener("click", function () {
  sessionStorage.removeItem("sesion");
  window.location.href = "index.html";
});

// Muestra un mensaje verde (bien) o rojo (mal)
function mostrarMensaje(id, texto, bien) {
  const p = document.getElementById(id);
  p.textContent = texto;
  p.className = "mensaje " + (bien ? "ok" : "mal");
}

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

// ===== 3. Horario =====
HORARIO_PROFESOR.forEach(function (h) {
  const fila = document.createElement("tr");
  fila.innerHTML = "<td>" + h.dia + "</td><td>" + h.hora + "</td><td>" + h.grupo + "</td><td>" + h.salon + "</td>";
  document.getElementById("tablaHorario").appendChild(fila);
});

// ===== 4. Evaluación: porcentajes y puntos extra =====
const selTareas = document.getElementById("pesoTareas");
const selExamenes = document.getElementById("pesoExamenes");
const selProyecto = document.getElementById("pesoProyecto");
const selExtra = document.getElementById("puntosExtra");

function llenar(select, desde, hasta, paso, sufijo) {
  for (let v = desde; v <= hasta; v += paso) {
    const opcion = document.createElement("option");
    opcion.value = v;
    opcion.textContent = v + sufijo;
    select.appendChild(opcion);
  }
}

[selTareas, selExamenes, selProyecto].forEach(function (s) { llenar(s, 10, 100, 10, "%"); });
llenar(selExtra, 0, 5, 1, " pts");

selTareas.value = EVALUACION.tareas;
selExamenes.value = EVALUACION.examenes;
selProyecto.value = EVALUACION.proyecto;
selExtra.value = EVALUACION.extra;

function sumaPesos() {
  return Number(selTareas.value) + Number(selExamenes.value) + Number(selProyecto.value);
}

function actualizarSuma() {
  const suma = sumaPesos();
  if (suma === 100) {
    mostrarMensaje("sumaPesos", "Suma de porcentajes: 100%. Todo listo.", true);
  } else {
    mostrarMensaje("sumaPesos", "Suma de porcentajes: " + suma + "%. Debe sumar 100%.", false);
  }
}

[selTareas, selExamenes, selProyecto].forEach(function (s) { s.addEventListener("change", actualizarSuma); });
actualizarSuma();

document.getElementById("guardarEval").addEventListener("click", function () {
  if (EVALUACION.finalizado) {
    mostrarMensaje("msgEval", "El ciclo está finalizado. Reábrelo para cambiar la evaluación.", false);
    return;
  }
  if (sumaPesos() !== 100) {
    mostrarMensaje("msgEval", "Los porcentajes deben sumar 100% antes de guardar.", false);
    return;
  }
  EVALUACION.tareas = Number(selTareas.value);
  EVALUACION.examenes = Number(selExamenes.value);
  EVALUACION.proyecto = Number(selProyecto.value);
  EVALUACION.extra = Number(selExtra.value);
  guardarDatos();
  mostrarMensaje("msgEval", "Evaluación guardada.", true);
});

// ===== 5. Actividades (como en Classroom) =====
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
let tareaAbierta = null; // la actividad cuyas entregas se están viendo

function maximoDe(tarea) {
  return tarea.tipo === "Puntos extra" ? EVALUACION.extra : 10;
}

function tablaDeEntregas(t) {
  let filas = "";
  LISTA_ALUMNOS.forEach(function (a) {
    const e = buscarEntrega(t.id, a.cuenta);
    const archivo = e && e.archivo !== null ? limpiar(e.archivo) + " (" + e.fecha + ")" : "No entregó";
    const nota = e && e.calificacion !== null ? e.calificacion : "";
    const comentario = e ? limpiar(e.comentario) : "";
    filas += "<tr><td>" + limpiar(a.nombre) + "</td><td>" + archivo + "</td>" +
      '<td><input class="cal" type="number" min="0" max="' + maximoDe(t) + '" step="0.1" value="' + nota + '"></td>' +
      '<td><input class="com" type="text" value="' + comentario + '"></td>' +
      '<td><button class="boton guardar-nota" data-tarea="' + t.id + '" data-cuenta="' + a.cuenta + '">Guardar</button></td></tr>';
  });
  return '<div class="tabla-caja"><table><thead><tr><th>Alumno</th><th>Entrega</th><th>Calificación (0 a ' +
    maximoDe(t) + ')</th><th>Comentario</th><th></th></tr></thead><tbody>' + filas + "</tbody></table></div>";
}

function dibujarTareas() {
  const lista = document.getElementById("listaTareas");
  lista.innerHTML = "";
  TAREAS.filter(function (t) { return t.materia === "M1"; }).forEach(function (t) {
    const entregas = ENTREGAS.filter(function (e) { return e.tareaId === t.id; });
    const resumen = t.tipo === "Examen"
      ? entregas.filter(function (e) { return e.calificacion !== null; }).length + " de " + LISTA_ALUMNOS.length + " calificados"
      : entregas.filter(function (e) { return e.archivo !== null; }).length + " de " + LISTA_ALUMNOS.length + " entregaron";

    let detalle = "<small>" + t.tipo + " · Entrega: " + t.entrega + " · " + resumen + "</small>";
    if (t.instrucciones) detalle += "<small>Instrucciones: " + limpiar(t.instrucciones) + "</small>";
    if (t.archivos.length > 0) detalle += "<small>Archivos: " + t.archivos.map(limpiar).join(", ") + "</small>";

    const abierta = tareaAbierta === t.id;
    const item = document.createElement("li");
    item.innerHTML = "<div><strong>" + limpiar(t.titulo) + "</strong>" + detalle + "</div>" +
      '<div><button class="boton ver-entregas" data-id="' + t.id + '">' + (abierta ? "Ocultar entregas" : "Ver entregas y calificar") + "</button></div>" +
      (abierta ? '<div class="detalle">' + tablaDeEntregas(t) + "</div>" : "");
    lista.appendChild(item);
  });
}

document.getElementById("listaTareas").addEventListener("click", function (evento) {
  const boton = evento.target.closest("button");
  if (!boton) return;

  // Abrir o cerrar la tabla de entregas
  if (boton.classList.contains("ver-entregas")) {
    const id = Number(boton.dataset.id);
    tareaAbierta = tareaAbierta === id ? null : id;
    dibujarTareas();
    return;
  }

  // Guardar calificación y comentario de un alumno
  if (boton.classList.contains("guardar-nota")) {
    if (EVALUACION.finalizado) {
      mostrarMensaje("msgTarea", "El ciclo está finalizado. Reábrelo para calificar.", false);
      return;
    }
    const tarea = TAREAS.find(function (t) { return t.id === Number(boton.dataset.tarea); });
    const fila = boton.closest("tr");
    const texto = fila.querySelector(".cal").value.trim();
    const comentario = fila.querySelector(".com").value.trim();
    const nota = texto === "" ? null : Number(texto);

    if (nota !== null && (isNaN(nota) || nota < 0 || nota > maximoDe(tarea))) {
      mostrarMensaje("msgTarea", "La calificación debe estar entre 0 y " + maximoDe(tarea) + ".", false);
      return;
    }

    let entrega = buscarEntrega(tarea.id, boton.dataset.cuenta);
    if (!entrega) {
      entrega = { tareaId: tarea.id, cuenta: boton.dataset.cuenta, archivo: null, fecha: null, calificacion: null, comentario: "" };
      ENTREGAS.push(entrega);
    }
    entrega.calificacion = nota;
    entrega.comentario = comentario;
    guardarDatos();
    dibujarTareas();
    mostrarMensaje("msgTarea", "Calificación guardada.", true);
  }
});

// Publicar una actividad nueva
document.getElementById("formTarea").addEventListener("submit", function (evento) {
  evento.preventDefault();
  const titulo = document.getElementById("tituloT").value.trim();
  const fecha = document.getElementById("fechaT").value;

  if (EVALUACION.finalizado) {
    mostrarMensaje("msgTarea", "El ciclo está finalizado. Reábrelo para publicar actividades.", false);
    return;
  }
  if (titulo.length < 3) {
    mostrarMensaje("msgTarea", "Escribe el nombre de la actividad (mínimo 3 letras).", false);
    return;
  }
  if (fecha === "") {
    mostrarMensaje("msgTarea", "Elige la fecha de entrega.", false);
    return;
  }

  const dia = new Date(fecha + "T00:00:00");
  const archivos = Array.from(document.getElementById("archivosT").files).map(function (f) { return f.name; });
  const nuevoId = TAREAS.reduce(function (mayor, t) { return Math.max(mayor, t.id); }, 0) + 1;

  TAREAS.push({
    id: nuevoId, materia: "M1", tipo: document.getElementById("tipoT").value, titulo: titulo,
    entrega: dia.getDate() + " " + MESES[dia.getMonth()],
    instrucciones: document.getElementById("instrT").value.trim(), archivos: archivos
  });
  guardarDatos();
  dibujarTareas();
  mostrarMensaje("msgTarea", "Actividad publicada. Los alumnos ya la ven en su página.", true);
  document.getElementById("formTarea").reset();
});

dibujarTareas();

// ===== 6. Finalizar ciclo =====
function dibujarFinal() {
  const tabla = document.getElementById("tablaFinal");
  tabla.innerHTML = "";
  if (!EVALUACION.finalizado) return;
  LISTA_ALUMNOS.forEach(function (a) {
    const aprobado = a.final !== null && a.final >= 6;
    const fila = document.createElement("tr");
    fila.innerHTML = "<td>" + limpiar(a.nombre) + "</td><td><strong>" + (a.final === null ? "—" : a.final.toFixed(1)) + "</strong></td>" +
      '<td><span class="etiqueta ' + (aprobado ? "entregada" : "pendiente") + '">' + (aprobado ? "Aprobado" : "Reprobado") + "</span></td>";
    tabla.appendChild(fila);
  });
}

document.getElementById("finalizar").addEventListener("click", function () {
  if (EVALUACION.finalizado) {
    mostrarMensaje("msgCiclo", "El ciclo ya está finalizado.", false);
    return;
  }
  if (sumaPesos() !== 100 || EVALUACION.tareas + EVALUACION.examenes + EVALUACION.proyecto !== 100) {
    mostrarMensaje("msgCiclo", "Guarda una evaluación que sume 100% antes de finalizar.", false);
    return;
  }
  if (!confirm("¿Finalizar el ciclo? Se calculará la calificación final de todos los alumnos.")) return;

  LISTA_ALUMNOS.forEach(function (a) {
    const nota = calcularNota(a.cuenta);
    a.final = nota === null ? null : Math.round(nota * 10) / 10;
  });
  EVALUACION.finalizado = true;
  guardarDatos();
  dibujarFinal();
  mostrarMensaje("msgCiclo", "Ciclo finalizado. Las calificaciones finales ya las ven los alumnos.", true);
});

document.getElementById("reabrir").addEventListener("click", function () {
  EVALUACION.finalizado = false;
  LISTA_ALUMNOS.forEach(function (a) { a.final = null; });
  guardarDatos();
  dibujarFinal();
  mostrarMensaje("msgCiclo", "Ciclo reabierto. Puedes calificar y cambiar la evaluación.", true);
});

dibujarFinal();

// ===== 7. Pasar lista =====
const fechaLista = document.getElementById("fechaLista");
fechaLista.value = new Date().toISOString().slice(0, 10);

LISTA_ALUMNOS.forEach(function (a) {
  const fila = document.createElement("tr");
  fila.innerHTML = '<td><input type="checkbox" checked data-cuenta="' + a.cuenta + '"></td><td>' + a.cuenta + "</td><td>" + limpiar(a.nombre) + "</td>";
  document.getElementById("tablaLista").appendChild(fila);
});

document.getElementById("guardarLista").addEventListener("click", function () {
  if (fechaLista.value === "") {
    mostrarMensaje("msgLista", "Elige la fecha de la clase antes de guardar.", false);
    return;
  }
  const marcas = document.querySelectorAll("#tablaLista input");
  const presentes = [];
  marcas.forEach(function (m) { if (m.checked) presentes.push(m.dataset.cuenta); });
  ASISTENCIAS.push({ fecha: fechaLista.value, presentes: presentes });
  guardarDatos();
  mostrarMensaje("msgLista", "Asistencia guardada: " + presentes.length + " de " + marcas.length + " alumnos presentes.", true);
});

// ===== 8. Reservaciones =====
const selectRecurso = document.getElementById("recurso");
RECURSOS.forEach(function (r) {
  const opcion = document.createElement("option");
  opcion.textContent = r;
  selectRecurso.appendChild(opcion);
});

function dibujarReservas() {
  const tabla = document.getElementById("tablaReservas");
  tabla.innerHTML = "";
  RESERVAS.forEach(function (r) {
    const fila = document.createElement("tr");
    fila.innerHTML = "<td>" + r.recurso + "</td><td>" + r.fecha + "</td><td>" + r.hora + "</td><td>" + r.profesor +
      '</td><td><button class="boton chico" data-id="' + r.id + '">Cancelar</button></td>';
    tabla.appendChild(fila);
  });
}

document.getElementById("formReserva").addEventListener("submit", function (evento) {
  evento.preventDefault();
  const recurso = selectRecurso.value;
  const fecha = document.getElementById("fechaReserva").value;
  const hora = document.getElementById("horaReserva").value;

  if (fecha === "") {
    mostrarMensaje("msgReserva", "Elige la fecha de la reservación.", false);
    return;
  }
  const ocupado = RESERVAS.some(function (r) { return r.recurso === recurso && r.fecha === fecha && r.hora === hora; });
  if (ocupado) {
    mostrarMensaje("msgReserva", recurso + " ya está reservado ese día a las " + hora + ". Elige otra hora o fecha.", false);
    return;
  }

  const nuevoId = RESERVAS.reduce(function (mayor, r) { return Math.max(mayor, r.id); }, 0) + 1;
  RESERVAS.push({ id: nuevoId, recurso: recurso, fecha: fecha, hora: hora, profesor: sesion.nombre });
  guardarDatos();
  dibujarReservas();
  mostrarMensaje("msgReserva", "Reservación guardada.", true);
});

document.getElementById("tablaReservas").addEventListener("click", function (evento) {
  const boton = evento.target.closest("button");
  if (!boton) return;
  const posicion = RESERVAS.findIndex(function (r) { return r.id === Number(boton.dataset.id); });
  RESERVAS.splice(posicion, 1);
  guardarDatos();
  dibujarReservas();
  mostrarMensaje("msgReserva", "Reservación cancelada. El espacio queda libre.", true);
});

dibujarReservas();
