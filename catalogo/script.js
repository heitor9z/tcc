// catalogo/script.js (COMPLETO ATUALIZADO)

// --- Seletores do DOM ---
const lista = document.getElementById("productList");
const filtroBtns = document.querySelectorAll(".filter-btn");
const buscaInput = document.getElementById("searchInput");
const countValue = document.getElementById("count-value");

// URL da API
const API_URL = "http://localhost/tcc/api";

// --- Funções do Carrinho ---
function adicionarAoCarrinho(produto) {
    let carrinho = JSON.parse(localStorage.getItem('drip_carrinho')) || [];
    const existe = carrinho.find(item => item.id === produto.id);
    
    if (existe) {
        existe.quantidade += 1;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }
    
    localStorage.setItem('drip_carrinho', JSON.stringify(carrinho));
    alert(`${produto.nome} adicionado ao carrinho!`);
}

// --- Funções de Favoritos (NOVO) ---
function toggleFavorito(produto, btnElement) {
    let favoritos = JSON.parse(localStorage.getItem('drip_favoritos')) || [];
    
    // Verifica se já existe
    const index = favoritos.findIndex(item => item.id === produto.id);
    
    if (index !== -1) {
        // Se já existe, remove
        favoritos.splice(index, 1);
        btnElement.classList.remove('favoritado'); // Remove cor vermelha
    } else {
        // Se não existe, adiciona
        favoritos.push(produto);
        btnElement.classList.add('favoritado'); // Adiciona cor vermelha
    }
    
    localStorage.setItem('drip_favoritos', JSON.stringify(favoritos));
}

// Funções globais para o HTML acessar
window.setupAddToCart = function(produto) {
    adicionarAoCarrinho(produto);
};

window.setupToggleFavorito = function(produto, btnElement) {
    toggleFavorito(produto, btnElement);
};


// --- Funções de Renderização ---
async function fetchProdutos() {
  try {
    const res = await fetch(`${API_URL}/produtos.php`);
    return await res.json();
  } catch (err) {
    console.error("Erro:", err);
    lista.innerHTML = "<p style='color:red; text-align:center; grid-column: 1/-1;'>Erro de conexão.</p>";
    return [];
  }
}

// catalogo/script.js (Função mostrarProdutos Atualizada)

async function mostrarProdutos(filtro = "all", busca = "") {
  const produtos = await fetchProdutos();
  
  // 1. Busca os favoritos salvos
  const favoritosSalvos = JSON.parse(localStorage.getItem('drip_favoritos')) || [];
  
  lista.innerHTML = "";

  const filtrados = produtos.filter(p => {
    // Verifica se este produto específico está nos favoritos
    const isFav = favoritosSalvos.some(fav => fav.id === p.id);

    // LÓGICA DO FILTRO:
    let categoriaMatch;
    
    if (filtro === 'favorites') {
        // Se o filtro for 'favorites', só passa se for favorito (isFav == true)
        categoriaMatch = isFav;
    } else {
        // Se for outro filtro, segue a lógica normal (categoria ou tudo)
        categoriaMatch = filtro === "all" || p.categoria.toLowerCase() === filtro.toLowerCase();
    }

    // Busca por texto continua funcionando junto com o filtro
    const nomeMatch = p.nome.toLowerCase().includes(busca.toLowerCase());
    
    return categoriaMatch && nomeMatch;
  });

  if (countValue) countValue.innerText = filtrados.length;

  if (filtrados.length === 0) {
    // Mensagem personalizada se estiver na aba de favoritos e não tiver nada
    const msg = filtro === 'favorites' 
        ? "Você ainda não favoritou nenhum item." 
        : "Nenhum produto encontrado.";
        
    lista.innerHTML = `<p style='color:#71717a; grid-column: 1/-1; text-align:center; margin-top:20px;'>${msg}</p>`;
    return;
  }

  filtrados.forEach(p => {
    const cores = Array.isArray(p.cores) ? p.cores : [];
    const tamanhos = Array.isArray(p.tamanhos) ? p.tamanhos : [];
    const coresHtml = cores.map(c => `<span class="color-dot" style="background-color: ${c};" title="${c}"></span>`).join('');

    const pString = JSON.stringify(p).replace(/"/g, '&quot;');

    // Recalcula se é favorito para pintar o botão corretamente
    const isFav = favoritosSalvos.some(fav => fav.id === p.id);
    const favClass = isFav ? 'favoritado' : '';

    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <div class="image-container">
          <img src="${p.imagem}" alt="${p.nome}">
          <span class="tag-category">${p.categoria}</span>
          
          <button class="btn-favorite ${favClass}" title="Favoritar" onclick="setupToggleFavorito(${pString}, this)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
      </div>
      
      <div class="card-content">
          <h3 class="product-name">${p.nome}</h3>
          <div class="product-price">R$ ${Number(p.preco).toFixed(2)}</div>
          
          <div class="options-row">
            <span>Colors:</span> ${coresHtml.length ? coresHtml : '<span style="color:#555">-</span>'}
          </div>
          <div class="options-row">
            <span>Sizes:</span> <span>${tamanhos.length ? tamanhos.join(", ") : '-'}</span>
          </div>

          <button class="btn-add-cart" onclick="setupAddToCart(${pString})">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Add to Cart
          </button>
      </div>
    `;
    lista.appendChild(card);
  });
}

// --- Event Listeners ---
filtroBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filtroBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    mostrarProdutos(btn.dataset.category, buscaInput.value);
  });
});

buscaInput.addEventListener("input", () => {
  const ativo = document.querySelector(".filter-btn.active").dataset.category;
  mostrarProdutos(ativo, buscaInput.value);
});

// Inicializa
mostrarProdutos();