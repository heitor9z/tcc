const lista = document.getElementById("productList");
const filtroBtns = document.querySelectorAll(".filter-btn");
const buscaInput = document.getElementById("searchInput");

// Buscar produtos da API
async function fetchProdutos() {
  try {
    const res = await fetch("http://localhost:3000/produtos");
    const produtos = await res.json();
    return produtos;
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    return [];
  }
}

// Mostrar produtos no front-end
async function mostrarProdutos(filtro = "all", busca = "") {
  const produtos = await fetchProdutos();
  lista.innerHTML = "";

  const filtrados = produtos.filter(p => {
    const correspondeCategoria = filtro === "all" || p.categoria === filtro;
    const correspondeBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
    return correspondeCategoria && correspondeBusca;
  });

  if (filtrados.length === 0) {
    lista.innerHTML = "<p>Nenhum produto encontrado.</p>";
    return;
  }

  filtrados.forEach(p => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <img src="${p.imagem}" alt="${p.nome}">
      <div class="product-info">
        <span class="category-tag">${p.categoria}</span>
        <h3 class="product-name">${p.nome}</h3>
        <p class="price">$${p.preco.toFixed(2)}</p>
        <p class="options">
          Colors: ${p.cores.map(c => `<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${c};margin:0 3px;"></span>`).join('')}
          <br>Sizes: ${p.tamanhos.join(", ")}
        </p>
        <button class="add-cart">🛒 Add to Cart</button>
      </div>
    `;
    lista.appendChild(card);
  });
}

// Eventos filtros
filtroBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filtroBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    mostrarProdutos(btn.dataset.category, buscaInput.value);
  });
});

// Evento busca
buscaInput.addEventListener("input", () => {
  const ativo = document.querySelector(".filter-btn.active").dataset.category;
  mostrarProdutos(ativo, buscaInput.value);
});

// Inicialização
mostrarProdutos();
