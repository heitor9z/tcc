const lista = document.getElementById("productList");
const filtroBtns = document.querySelectorAll(".filter-btn");
const buscaInput = document.getElementById("searchInput");

// <-- ADICIONADO PARA ORGANIZAR (igual ao login/script.js) -->
const API_URL = "http://localhost:3000"; 

// Buscar produtos da API
async function fetchProdutos() {
  try {
    // <-- ROTA ATUALIZADA -->
    const res = await fetch(`${API_URL}/api/produtos`); // Era /produtos
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
    
    // Convertendo as cores/tamanhos (que vêm do MySQL como String JSON) para Arrays
    const cores = p.cores ? JSON.parse(p.cores) : [];
    const tamanhos = p.tamanhos ? JSON.parse(p.tamanhos) : [];

    card.innerHTML = `
      <img src="${p.imagem}" alt="${p.nome}">
      <div class="product-info">
        <span class="category-tag">${p.categoria}</span>
        <h3 class="product-name">${p.nome}</h3>
        <p class="price">$${Number(p.preco).toFixed(2)}</p>
        <p class="options">
          Colors: ${cores.map(c => `<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${c};margin:0 3px;"></span>`).join('')}
          <br>Sizes: ${tamanhos.join(", ")}
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