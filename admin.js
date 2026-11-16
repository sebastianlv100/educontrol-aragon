// ===== 1. Protección: solo entra quien inició sesión como administración =====
const sesion = JSON.parse(sessionStorage.getItem("sesion") || "null");
if (!sesion || sesion.rol !== "admin") {
  window.location.href = "index.html";
}

document.getElementById("saludo").textContent = sesion ? sesion.nombre : "";
document.getElementById("salir").addEventListener("click", function () {
  sessionStorage.removeItem("sesion");
  window.location.href = "index.html";
});

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

// ===== 3. Cálculos que se repiten =====
function sumar(lista, campo) {
  return lista.reduce(function (total, x) { return total + x[campo]; }, 0);
}

function totalesConta() {
  const cobrado = sumar(PAGOS.filter(function (p) { return p.pagado; }), "monto");
  const porCobrar = sumar(PAGOS.filter(function (p) { return !p.pagado; }), "monto");
  const gastos = sumar(GASTOS, "monto");
  return { cobrado: cobrado, porCobrar: porCobrar, gastos: gastos, balance: cobrado - gastos };
}

function nombreAlumno(cuenta) {
  const a = LISTA_ALUMNOS.find(function (x) { return x.cuenta === cuenta; });
  return a ? a.nombre : cuenta;
}

// ===== 4. Resumen =====
function dibujarResumen() {
  const t = totalesConta();
  const pendientes = TAREAS.filter(function (x) { return !x.entregada; }).length;
  document.getElementById("tarjetasResumen").innerHTML =
    "<div><strong>" + LISTA_ALUMNOS.length + "</strong>Alumnos en el grupo</div>" +
    "<div><strong>" + MATERIAS.length + "</strong>Materias</div>" +
    "<div><strong>" + RESERVAS.length + "</strong>Reservaciones activas</div>" +
    "<div><strong>" + TAREAS.length + "</strong>Tareas publicadas</div>" +
    "<div><strong>" + ASISTENCIAS.length + "</strong>Listas de asistencia</div>" +
    "<div><strong>" + dinero(t.balance) + "</strong>Balance actual</div>";
}

// ===== 5. Alumnos =====
function promedioAlumno(a) {
  const notas = [a.p1, a.p2, a.p3].filter(function (n) { return n !== null; });
  if (notas.length === 0) return "—";
  return (notas.reduce(function (x, y) { return x + y; }, 0) / notas.length).toFixed(1);
}

function asistenciaAlumno(cuenta) {
  if (ASISTENCIAS.length === 0) return "Sin listas";
  const veces = ASISTENCIAS.filter(function (l) { return l.presentes.includes(cuenta); }).length;
  return Math.round((veces / ASISTENCIAS.length) * 100) + "%";
}

function dibujarAlumnos() {
  const texto = document.getElementById("buscar").value.trim().toLowerCase();
  const tabla = document.getElementById("tablaAlumnos");
  tabla.innerHTML = "";
  LISTA_ALUMNOS.forEach(function (a) {
    if (!a.nombre.toLowerCase().includes(texto) && !a.cuenta.includes(texto)) return;
    const debe = PAGOS.filter(function (p) { return p.cuenta === a.cuenta && !p.pagado; }).length;
    const fila = document.createElement("tr");
    fila.innerHTML = "<td>" + a.cuenta + "</td><td>" + limpiar(a.nombre) + "</td><td>" + promedioAlumno(a) +
      "</td><td>" + asistenciaAlumno(a.cuenta) + "</td><td>" + debe + "</td>";
    tabla.appendChild(fila);
  });
}

document.getElementById("buscar").addEventListener("input", dibujarAlumnos);

// ===== 6. Profesores =====
MATERIAS.forEach(function (m) {
  const fila = document.createElement("tr");
  fila.innerHTML = "<td>" + m.profesor + "</td><td>" + m.nombre + "</td><td>" + m.salon + "</td>";
  document.getElementById("tablaProfes").appendChild(fila);
});

// ===== 7. Reservaciones =====
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

document.getElementById("tablaReservas").addEventListener("click", function (evento) {
  const boton = evento.target.closest("button");
  if (!boton) return;
  const posicion = RESERVAS.findIndex(function (r) { return r.id === Number(boton.dataset.id); });
  RESERVAS.splice(posicion, 1);
  guardarDatos();
  dibujarReservas();
  dibujarResumen();
  mostrarMensaje("msgReserva", "Reservación cancelada. El espacio queda libre.", true);
});

// ===== 8. Contabilidad =====
function dibujarConta() {
  const t = totalesConta();
  document.getElementById("tarjetasConta").innerHTML =
    "<div><strong>" + dinero(t.cobrado) + "</strong>Cobrado</div>" +
    "<div><strong>" + dinero(t.porCobrar) + "</strong>Por cobrar</div>" +
    "<div><strong>" + dinero(t.gastos) + "</strong>Gastos</div>" +
    "<div><strong>" + dinero(t.balance) + "</strong>Balance (cobrado − gastos)</div>";

  const tablaPagos = document.getElementById("tablaPagos");
  tablaPagos.innerHTML = "";
  PAGOS.forEach(function (p) {
    const estado = p.pagado ? '<span class="etiqueta entregada">Pagado</span>' : '<span class="etiqueta pendiente">Pendiente</span>';
    const accion = p.pagado ? "—" : '<button class="boton" data-id="' + p.id + '">Registrar pago</button>';
    const fila = document.createElement("tr");
    fila.innerHTML = "<td>" + limpiar(nombreAlumno(p.cuenta)) + "</td><td>" + p.concepto + "</td><td>" +
      dinero(p.monto) + "</td><td>" + estado + "</td><td>" + accion + "</td>";
    tablaPagos.appendChild(fila);
  });

  const tablaGastos = document.getElementById("tablaGastos");
  tablaGastos.innerHTML = "";
  GASTOS.forEach(function (g) {
    const fila = document.createElement("tr");
    fila.innerHTML = "<td>" + g.fecha + "</td><td>" + limpiar(g.concepto) + "</td><td>" + dinero(g.monto) + "</td>";
    tablaGastos.appendChild(fila);
  });
}

document.getElementById("tablaPagos").addEventListener("click", function (evento) {
  const boton = evento.target.closest("button");
  if (!boton) return;
  PAGOS.find(function (p) { return p.id === Number(boton.dataset.id); }).pagado = true;
  guardarDatos();
  dibujarConta();
  dibujarAlumnos();
  dibujarResumen();
});

document.getElementById("formGasto").addEventListener("submit", function (evento) {
  evento.preventDefault();
  const concepto = document.getElementById("conceptoGasto").value.trim();
  const monto = Number(document.getElementById("montoGasto").value);

  if (concepto.length < 3) {
    mostrarMensaje("msgGasto", "Escribe el concepto del gasto (mínimo 3 letras).", false);
    return;
  }
  if (!(monto > 0)) {
    mostrarMensaje("msgGasto", "El monto debe ser mayor que 0.", false);
    return;
  }

  const nuevoId = GASTOS.reduce(function (mayor, g) { return Math.max(mayor, g.id); }, 0) + 1;
  GASTOS.push({ id: nuevoId, concepto: concepto, monto: monto, fecha: new Date().toISOString().slice(0, 10) });
  guardarDatos();
  dibujarConta();
  dibujarResumen();
  mostrarMensaje("msgGasto", "Gasto registrado.", true);
  document.getElementById("formGasto").reset();
});

dibujarResumen();
dibujarAlumnos();
dibujarReservas();
dibujarConta();
