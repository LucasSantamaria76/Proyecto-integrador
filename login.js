const $userNombre = document.getElementById("userNombre");
const $pass = document.getElementById("password");
const $repetirPass = document.getElementById("RepetirPassword");
const $enlaceReg = document.getElementById("enlaceRegistro");
const $titulo = document.getElementById("titulo");
const $btnEnviar = document.getElementById("btnEnviar");
const $toast = document.getElementById("toast");

// Modal
const $showModal = document.querySelector(".modal");
const $closeModal = document.querySelector(".modalClose");
const $modalTitle = document.querySelector(".modalTitle");

const msgDialog = (title) => {
  $modalTitle.textContent = title;
  $showModal.classList.add("modal-show");
};

$closeModal.addEventListener("click", (e) =>
  $showModal.classList.remove("modal-show")
);

let usuariosRegistrados = {};

document.addEventListener("DOMContentLoaded", () => {
  $repetirPass.style.display = "none";
  localStorage.getItem("UsuariosRegistrados") &&
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
    if (usuariosRegistrados.hasOwnProperty($userNombre.value)) {
      if (usuariosRegistrados[$userNombre.value].pass === $pass.value) {
        localStorage.setItem(
          "UsuarioActivo",
          JSON.stringify($userNombre.value)
        );
        $userNombre.value = "";
        $pass.value = "";
        $repetirPass.value = "";
        location.href = "index.html";
      } else {
        msgDialog("Password incorecto");
      }
    } else {
      msgDialog("Usuario inexistente");
    }

    /* const usuario = usuarios.filter((el) => el.nombre === $userNombre.value);
    if (usuario.length) {
      if (usuario[0].pass === $pass.value) {
        localStorage.setItem(
          "UsuarioActivo",
          JSON.stringify(usuario[0].nombre)
        );
        $userNombre.value = "";
        $pass.value = "";
        $repetirPass.value = "";
        location.href = "index.html";
      } else {
        msgDialog("Password incorecto");
      }
    } else {
      msgDialog("Usuario inexistente");
    } */
  };

  const registroUsuario = () => {
    if ($pass.value === $repetirPass.value) {
      const userId = (Object.values(usuariosRegistrados).length !== 0)
        ? Object.values(usuariosRegistrados).length + 1
        : 1;

      const nuevoUsuario = {
        id: userId,
        pass: $pass.value,
        carrito: [],
      };

      if (!usuariosRegistrados.hasOwnProperty($userNombre.value)) {
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
