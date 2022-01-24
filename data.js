export function Data({ options = {}, cbSuccess }) {
const defaultHeader = {
  accept: "application/json",
};

options.method = options.method || "GET";
options.headers = options.headers
  ? { ...defaultHeader, ...options.headers }
  : defaultHeader;

 options.body = JSON.stringify(options.body) || false;
if (!options.body) delete options.body;
console.log(options);

  fetch("./db.json",options)
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then((json) => cbSuccess(json))
    .catch((error) => {
      let msg = error.statusText || "Error al cargar los datos";
      console.log(msg);
     /*  document.getElementById("grid-productos").innerHTML = `
      <div class="error"><p>Error ${error.status}: ${msg}</p></div>`; */
    });
}
