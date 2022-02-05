const $userNombre = document.getElementById("userNombre"),
  $pass = document.getElementById("password"),
  $repetirPass = document.getElementById("RepetirPassword"),
  $enlaceReg = document.getElementById("enlaceRegistro"),
  $titulo = document.getElementById("titulo"),
  $btnEnviar = document.getElementById("btnEnviar"),
  $btnVolver = document.getElementById("btnVolver"),
  $toast = document.getElementById("toast"),
  // Modal
  $showModal = document.querySelector(".modal"),
  $closeModal = document.querySelector(".modalClose"),
  $modalTitle = document.querySelector(".modalTitle");

const msgDialog = (title) => {
  $modalTitle.textContent = title;
  $showModal.classList.add("modal-show");
};

$closeModal.onclick = () => $showModal.classList.remove("modal-show");
$btnVolver.onclick = () => (location.href = "index.html");

let usuariosRegistrados = {};

document.addEventListener("DOMContentLoaded", () => {
  $repetirPass.style.display = "none";
  localStorage.getItem("UsuariosRegistrados") && // si existen usuarios registrados los almaceno en una variable
    (usuariosRegistrados = JSON.parse(
      localStorage.getItem("UsuariosRegistrados")
    ));
});

const showToast = (msg) => {
  $toast.textContent = msg;
  $toast.style.opacity = "1";
  setTimeout(() => ($toast.style.opacity = "0"), 1500);
};

const loginRegistro = () => {
  if ($titulo.textContent === "Iniciar sesión") {
    $repetirPass.style.display = "block";
    $titulo.innerHTML = "Formulario de registro";
    $enlaceReg.innerHTML = "Ya tienes cuenta?";
  } else {
    $repetirPass.style.display = "none";
    $titulo.innerText = "Iniciar sesión";
    $enlaceReg.innerHTML = "No tienes cuenta, registrate?";
  }
};

const enviarLoginRegistro = () => {
  const loginUsuario = () => {  
    if (usuariosRegistrados.hasOwnProperty($userNombre.value)) {         //  Si el usuario se encuentra registrado 
      if (usuariosRegistrados[$userNombre.value].pass === $pass.value) { // y el password es correcto el usuario es logueado
        localStorage.setItem(
          "UsuarioActivo",
          JSON.stringify($userNombre.value) // se guarda el usuario activo en el localStorage
        );
        $userNombre.value = "";
        $pass.value = "";
        $repetirPass.value = "";
        location.href = "index.html"; // Se vuelve a la pag. principal con el usuario logueado
      } else {
        msgDialog("Password incorecto");
      }
    } else {
      msgDialog("Usuario inexistente");
    }
  };

  const registroUsuario = () => {
    if ($pass.value === $repetirPass.value) {
      const userId = // Se genera un id ded usuario
        Object.values(usuariosRegistrados).length !== 0
          ? Object.values(usuariosRegistrados).length + 1
          : 1;

      const nuevoUsuario = {
        id: userId,
        pass: $pass.value,
        carrito: [],
      };

      if (!usuariosRegistrados.hasOwnProperty($userNombre.value)) { // Si el usuario no se encuentra ya registrado se registra
        usuariosRegistrados[$userNombre.value] = { ...nuevoUsuario };
        localStorage.removeItem("UsuariosRegistrados");
        localStorage.setItem(
          "UsuariosRegistrados",
          JSON.stringify(usuariosRegistrados)
        );
        loginUsuario();
      } else {
        showToast("El usuario ingresado ya existe");
        $userNombre.focus();
      }
    } else {
      showToast("Las contraseñas no coinciden");
      $repetirPass.focus();
    }
  };

  const isRegistro = $titulo.textContent === "Formulario de registro";

  if (!$userNombre.value) {
    showToast("Nombre de usuario no ingresado");
    $userNombre.focus();
    return;
  }

  if (!$pass.value) {
    showToast("Password no ingresado");
    $pass.focus();
    return;
  }

  if (!$repetirPass.value && isRegistro) {
    showToast("Debe repetir su password");
    $repetirPass.focus();
    return;
  }

  if (!isRegistro) {
    usuariosRegistrados = JSON.parse(
      localStorage.getItem("UsuariosRegistrados")
    );
    usuariosRegistrados
      ? loginUsuario()
      : showToast("No hay usuarios registrados");
  } else registroUsuario();
};

$enlaceReg.onclick = loginRegistro;

$btnEnviar.onclick = enviarLoginRegistro;
