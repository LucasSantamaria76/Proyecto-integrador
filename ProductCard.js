export function ProductCard(props) {
  const { nombre, img, precio } = props;
  const foto = img || "FrutasyVerduras.jpg";
  let path = `./img/${foto}`;

  return `
     <article class="product-card">
      <img src=${path} alt=${nombre}">
      <div class="card-info">
         <h3>${nombre}</h3>
         <h4>Precio: $ ${precio}</h4>
         <button class="btn">comprar</button> 
      </div>
    </article>`;
}
