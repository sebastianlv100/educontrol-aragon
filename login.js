let rolElegido = "alumno";

const botonesRol = document.querySelectorAll("#roles button");
const ayuda = document.getElementById("ayuda");
const error = document.getElementById("error");

// Muestra los datos de prueba del rol elegido
function mostrarAyuda() {
  const u = USUARIOS.find(function (x) { return x.rol === rolElegido; });
  ayuda.innerHTML = "<strong>Datos de prueba:</strong><br>Usuario: " + u.usuario + "<br>Contraseña: " + u.clave;
}

botonesRol.forEach(function (boton) {
  boton.addEventListener("click", function () {
    rolElegido = boton.dataset.rol;
    botonesRol.forEach(function (b) { b.classList.remove("activo"); });
    boton.classList.add("activo");
    error.textContent = "";
    mostrarAyuda();
  });
});

document.getElementById("formLogin").addEventListener("submit", function (evento) {
  evento.preventDefault();
  const usuario = document.getElementById("usuario").value.trim();
  const clave = document.getElementById("clave").value;

  const encontrado = USUARIOS.find(function (u) {
    return u.rol === rolElegido && u.usuario === usuario && u.clave === clave;
  });

  if (!encontrado) {
    error.textContent = "Usuario o contraseña incorrectos. Revisa los datos de prueba de abajo.";
    return;
  }

  // Guardamos quién entró y lo mandamos a su interfaz
  sessionStorage.setItem("sesion", JSON.stringify({ rol: encontrado.rol, nombre: encontrado.nombre }));
  window.location.href = encontrado.pagina;
});

mostrarAyuda();
