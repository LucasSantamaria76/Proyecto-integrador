import { Data } from './data.js';
import { ProductCard } from "./ProductCard.js";

const $iconoUser = document.getElementById("iconoUser");
const $iconoLogin = document.getElementById("iconoLogin");

document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("user"));
  if (usuario) {
    $iconoLogin.style.display = "none";
    $iconoUser.textContent = usuario.nombre[0];
  }else $iconoUser.style.display = "none";
});

const $select = document.getElementById("select");

const renderProduct = (products) => {
      const productos = $select.value === 'Frutas' ? products.Frutas : products.Verduras;
      let html = "";
      productos.forEach((el) => (html += ProductCard(el)));
      document.getElementById("grid-productos").innerHTML = html;
    }

  Data({
    cbSuccess: (products) => renderProduct(products),
  });
  
  $select.addEventListener("change", () => {
    Data({
      cbSuccess: (products) => renderProduct(products),
    });
  });