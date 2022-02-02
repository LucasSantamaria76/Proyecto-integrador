const $iconoUser = document.getElementById("iconoUser"),
  $iconoLogin = document.getElementById("iconoLogin"),
  $iconoCarrito = document.getElementById("iconoCarrito"),
  $numItems = document.getElementById("num-items"),
  $gridProductos = document.getElementById("grid-productos"),
  $select = document.getElementById("select"),
  $template = document.querySelector("#template-card").content,
  $fragmento = document.createDocumentFragment(),
  $carritoDesplegable = document.querySelector(".contenedor-carrito"),
  $itemsCarrito = document.getElementById("itemsCarrito"),
  $footerCarrito = document.getElementById("footerCarrito"),
  $templateFooter = document.getElementById("template-footer").content,
  $templateCarrito = document.getElementById("template-carrito").content;

let productos, carrito, usuarioActivo, usuariosRegistrados;

const addCarrito = (e) => {
  e.target.classList.contains("btn") && setCarrito(e.target.dataset.id);
  e.stopPropagation();
};

const setCarrito = (id) => {
  const nuevoProducto = {
    nombre: productos[id].nombre,
    precio: productos[id].precio,
    id: id,
    img: productos[id].img,
    stock: productos[id].stock,
    cantidad: 1,
  };
  if (carrito.hasOwnProperty(id)) {
    nuevoProducto.cantidad = carrito[id].cantidad + 1;
  }

  let agregarCarrito = {};
  agregarCarrito[id] = { ...nuevoProducto };
  carrito = { ...carrito, ...agregarCarrito };
  const nCantidad = Object.values(carrito).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );
  pintarCarrito();
};

const pintarCarrito = () => {
  $itemsCarrito.innerHTML = "";
  for (let key in carrito) {
    $templateCarrito.querySelector("img").src = "./img/" + carrito[key].img;
    $templateCarrito.querySelector("#item").textContent = carrito[key].nombre;
    $templateCarrito.querySelector("input").value = carrito[key].cantidad;
    $templateCarrito.querySelector("input").dataset.id = key;
    $templateCarrito.querySelectorAll("span")[0].textContent =
      carrito[key].precio;
    $templateCarrito.querySelectorAll("span")[1].textContent =
      carrito[key].precio * carrito[key].cantidad;

    const $clone = $templateCarrito.cloneNode(true);
    $fragmento.appendChild($clone);
  }

  $itemsCarrito.appendChild($fragmento);

  usuariosRegistrados[usuarioActivo].carrito = carrito;
  localStorage.setItem(
    "UsuariosRegistrados",
    JSON.stringify(usuariosRegistrados)
  );

  pintarFooter();
};

const pintarFooter = () => {
  $footerCarrito.innerHTML = "";

  if (Object.keys(carrito).length === 0) {
    $footerCarrito.innerHTML = `
    <h2 style="text-align:center;">Carrito vacío</h2>`;
    $numItems.textContent = 0;
    return;
  }

  // sumar cantidad y sumar totales

  const nCantidad = Object.values(carrito).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );

  const nPrecio = Object.values(carrito).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  );

  $templateFooter.querySelector(".nCantidad").textContent = nCantidad;
  $templateFooter.querySelector("span").textContent = nPrecio;

  const $clone = $templateFooter.cloneNode(true);
  $fragmento.appendChild($clone);

  $footerCarrito.appendChild($fragmento);
  $numItems.textContent = nCantidad;

  const vaciarCarrito = () => {
    carrito = {};
    $numItems.textContent = 0;
    usuariosRegistrados[usuarioActivo].carrito = carrito;
    localStorage.setItem(
      "UsuariosRegistrados",
      JSON.stringify(usuariosRegistrados)
    );
    pintarCarrito();
  };

  document
    .querySelector(".btn-vaciar")
    .addEventListener("click", () => vaciarCarrito());

  document
    .querySelector("#btnContinuar")
    .addEventListener("click", () =>
      $carritoDesplegable.classList.remove("mostarDesplegable")
    );

  document.querySelector("#btnComprar").addEventListener("click", () => {
    vaciarCarrito();
    $carritoDesplegable.classList.remove("mostarDesplegable");
  });
};

const renderProductos = (tipoProducto = "Verduras") => {
  fetch("./db.json")
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then((resProductos) => {
      productos = resProductos[tipoProducto];
      for (let key in productos) {
        $template.querySelector("img").src = "./img/" + productos[key].img;
        $template.querySelector("img").alt = productos[key].img;
        $template.querySelector("H3").textContent = productos[key].nombre;
        $template.querySelector("H4").textContent =
          "precio: $ " + productos[key].precio;
        $template.querySelector("button").dataset.id = key;
        if(productos[key].stock == "0"){
          $template.querySelector(".sinStock").style.display = "block";
          $template.querySelector("button").disabled = true;
        }else {
          $template.querySelector("button").disabled = false;
          $template.querySelector(".sinStock").style.display = "none";          
        }

        let clone = $template.cloneNode(true);
        $fragmento.appendChild(clone);
      }
      $gridProductos.appendChild($fragmento);
    })
    .catch((error) => {
      let msg = error.statusText || "Error al cargar los datos";
      console.log(msg);
      document.getElementById("grid-productos").innerHTML = `
      <div class="error"><p>Error ${error.status}: ${msg}</p></div>`;
    });
};

$select.addEventListener("change", (e) => {
  $gridProductos.innerHTML = "";
  renderProductos(e.target.value);
});

document.addEventListener("DOMContentLoaded", () => {
  usuariosRegistrados = JSON.parse(localStorage.getItem("UsuariosRegistrados"));
  usuarioActivo = JSON.parse(localStorage.getItem("UsuarioActivo"));

  if (usuarioActivo && usuariosRegistrados) {
    $iconoLogin.style.display = "none";
    $iconoUser.textContent = usuarioActivo[0];
    $numItems.style.display = "block";

    carrito = usuariosRegistrados[usuarioActivo].carrito;
    const nCantidad = Object.values(carrito).reduce(
      (acc, { cantidad }) => acc + cantidad,
      0
    );
    $numItems.textContent = nCantidad;
    pintarCarrito();
  } else {
    $numItems.style.display = "none";
    $iconoUser.style.display = "none";
  }
  renderProductos();
});

$gridProductos.onclick = (e) => addCarrito(e);

$iconoUser.onclick = () => {
  if (confirm("¿Está seguro de cerrar la sesión?")) {
    localStorage.removeItem("UsuarioActivo");
    location.reload();
  }
};

$iconoCarrito.onclick = (e) => {
  e.preventDefault();
  carrito && $carritoDesplegable.classList.toggle("mostarDesplegable");
};

$itemsCarrito.addEventListener("change", (e) => {
  if (e.target.dataset.id) {
    const producto = carrito[e.target.dataset.id];
    producto.cantidad = Number(e.target.value);

    producto.cantidad === 0
      ? delete carrito[e.target.dataset.id]
      : (carrito[e.target.dataset.id] = { ...producto });

    pintarCarrito();
  }

  e.stopPropagation();
});
