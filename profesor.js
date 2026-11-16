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

// Función para mostrar un mensaje verde (ok) o rojo (mal)
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

// ===== 3. Horario (solo las clases de Diseño Lógico, clave M1) =====
HORARIO.filter(function (h) { return h.materia === "M1"; }).forEach(function (h) {
  const fila = document.createElement("tr");
  fila.innerHTML = "<td>" + h.dia + "</td><td>" + h.hora + "</td><td>" + MATERIAS[0].salon + "</td>";
  document.getElementById("tablaHorario").appendChild(fila);
});

// ===== 4. Pasar lista =====
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

// ===== 5. Calificaciones =====
function dibujarNotas() {
  const tabla = document.getElementById("tablaNotas");
  tabla.innerHTML = "";
  LISTA_ALUMNOS.forEach(function (a) {
    const fila = document.createElement("tr");
    let celdas = "<td>" + limpiar(a.nombre) + "</td>";
    ["p1", "p2", "p3"].forEach(function (parcial) {
      const valor = a[parcial] === null ? "" : a[parcial];
      celdas += '<td><input type="number" min="0" max="10" step="0.1" value="' + valor +
                '" data-cuenta="' + a.cuenta + '" data-parcial="' + parcial + '"></td>';
    });
    fila.innerHTML = celdas;
    tabla.appendChild(fila);
  });
}

document.getElementById("tablaNotas").addEventListener("change", function (evento) {
  const campo = evento.target;
  const texto = campo.value.trim();
  const nota = texto === "" ? null : Number(texto);

  if (nota !== null && (isNaN(nota) || nota < 0 || nota > 10)) {
    mostrarMensaje("msgNotas", "La nota debe estar entre 0 y 10.", false);
    return;
  }

  const alumno = LISTA_ALUMNOS.find(function (a) { return a.cuenta === campo.dataset.cuenta; });
  alumno[campo.dataset.parcial] = nota;

  // Si es la alumna de ejemplo, también actualizamos lo que ella ve en su página
  if (alumno.cuenta === ALUMNO.cuenta) {
    const suya = CALIFICACIONES.find(function (c) { return c.materia === "M1"; });
    suya[campo.dataset.parcial] = nota;
  }

  guardarDatos();
  mostrarMensaje("msgNotas", "Nota guardada para " + alumno.nombre + ".", true);
});

dibujarNotas();

// ===== 6. Dejar tareas =====
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

function dibujarTareasM1() {
  const lista = document.getElementById("listaTareas");
  lista.innerHTML = "";
  TAREAS.filter(function (t) { return t.materia === "M1"; }).forEach(function (t) {
    const item = document.createElement("li");
    item.innerHTML = "<div><strong>" + limpiar(t.titulo) + "</strong><small>" + t.tipo + " · Entrega: " + t.entrega + "</small></div>";
    lista.appendChild(item);
  });
}

document.getElementById("formTarea").addEventListener("submit", function (evento) {
  evento.preventDefault();
  const titulo = document.getElementById("tituloTarea").value.trim();
  const fecha = document.getElementById("fechaTarea").value;

  if (titulo.length < 3) {
    mostrarMensaje("msgTarea", "Escribe un título de al menos 3 letras.", false);
    return;
  }
  if (fecha === "") {
    mostrarMensaje("msgTarea", "Elige la fecha de entrega.", false);
    return;
  }

  const dia = new Date(fecha + "T00:00:00");
  const nuevoId = TAREAS.reduce(function (mayor, t) { return Math.max(mayor, t.id); }, 0) + 1;
  TAREAS.push({
    id: nuevoId, materia: "M1", titulo: titulo,
    tipo: document.getElementById("tipoTarea").value,
    entrega: dia.getDate() + " " + MESES[dia.getMonth()], entregada: false
  });
  guardarDatos();
  dibujarTareasM1();
  mostrarMensaje("msgTarea", "Tarea publicada. Los alumnos ya la ven en su página.", true);
  document.getElementById("formTarea").reset();
});

dibujarTareasM1();

// ===== 7. Reservaciones =====
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

  // ¿Ya está ocupado ese espacio a esa misma fecha y hora?
  const ocupado = RESERVAS.some(function (r) {
    return r.recurso === recurso && r.fecha === fecha && r.hora === hora;
  });
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
