const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTs-DZxNCoO7-hnJJNLioavfzWAOlNzj0TqARTMiU1MN5dQIdpzXC4Es7uxGCc-UsKwHg1lzSTfsif6/pub?gid=0&single=true&output=csv";

async function fetchProductos() {
  const res = await fetch(sheetURL);
  const csvText = await res.text();

  const lines = csvText.trim().split("\n");
  const headers = lines.shift().split(",");

  return lines.map(line => {
    const values = line.split(",");
    let obj = {};
    headers.forEach((h, i) => {
      obj[h.trim()] = values[i]?.trim();
    });
    return obj;
  });
}

function llenarFiltros(productos) {
  const marcaSet = new Set();
  productos.forEach(p => {
    if (p.Marca) marcaSet.add(p.Marca);
  });

  const filtroMarca = document.getElementById("filtroMarca");

  marcaSet.forEach(marca => {
    const option = document.createElement("option");
    option.value = marca;
    option.textContent = marca;
    filtroMarca.appendChild(option);
  });
}

function mostrarProductos(productos) {
  const cont = document.getElementById("productos");
  cont.innerHTML = "";

  const cat = document.getElementById("filtroCategoria").value;
  const mar = document.getElementById("filtroMarca").value;
  const gen = document.getElementById("filtroGenero").value;

  const filtrados = productos.filter(p =>
    (cat === "todos" || p.Categoria === cat) &&
    (mar === "todos" || p.Marca === mar) &&
    (gen === "todos" || p.Genero === gen)
  );

  filtrados.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${p.Imagen}" alt="${p.Nombre}">
      <h3>${p.Nombre}</h3>
      <p>${p.Marca}</p>
      <p>${p.Genero}</p>
      <div class="precio">$${parseInt(p.Precio || 0).toLocaleString()}</div>
      <a class="btn"
         href="https://wa.me/573128947023?text=Hola, quiero el producto ${encodeURIComponent(p.Nombre)}"
         target="_blank">
         Pedir por WhatsApp
      </a>
    `;

    cont.appendChild(card);
  });
}

(async () => {
  try {
    const productos = await fetchProductos();
    llenarFiltros(productos);

    document.getElementById("filtroCategoria")
      .addEventListener("change", () => mostrarProductos(productos));

    document.getElementById("filtroMarca")
      .addEventListener("change", () => mostrarProductos(productos));

    document.getElementById("filtroGenero")
      .addEventListener("change", () => mostrarProductos(productos));

    mostrarProductos(productos);
  } catch (error) {
    console.error("Error cargando productos:", error);
  }
})();