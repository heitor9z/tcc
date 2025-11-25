// catalogo/script.js

const lista = document.getElementById("productList");
const filtroBtns = document.querySelectorAll(".filter-btn");
const buscaInput = document.getElementById("searchInput");
const countValue = document.getElementById("count-value");
const API_URL = "http://localhost/tcc/api";

// --- Gerenciamento de Usuário (Header) ---
document.addEventListener("DOMContentLoaded", () => {
    verificarUsuario();
    if (lista) mostrarProdutos();
});

function verificarUsuario() {
    const email = localStorage.getItem("user_email");
    
    const linkLogin = document.getElementById("link-login");
    const linkPedidos = document.getElementById("link-pedidos");
    const linkAdmin = document.getElementById("link-admin");
    const linkLogout = document.getElementById("link-logout");

    if (email) {
        // Usuário Logado
        if(linkLogin) linkLogin.classList.add("hidden");
        if(linkPedidos) linkPedidos.classList.remove("hidden");
        if(linkLogout) linkLogout.classList.remove("hidden");

        // Verifica se é admin (seu email)
        // Em produção, isso seria verificado via token no backend, mas para o TCC funciona
        if (email === "sanielvanila@gmail.com") {
            if(linkAdmin) linkAdmin.classList.remove("hidden");
        }
    } else {
        // Não Logado
        if(linkLogin) linkLogin.classList.remove("hidden");
        if(linkPedidos) linkPedidos.classList.add("hidden");
        if(linkAdmin) linkAdmin.classList.add("hidden");
        if(linkLogout) linkLogout.classList.add("hidden");
    }

    // Logout
    if(linkLogout) {
        linkLogout.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("user_email");
            localStorage.removeItem("user_name");
            localStorage.removeItem("drip_carrinho"); // Opcional: limpar carrinho ao sair
            window.location.reload();
        });
    }
}

// --- Funções de Favoritos ---
function toggleFavorito(produto, btnElement) {
    let favoritos = JSON.parse(localStorage.getItem('drip_favoritos')) || [];
    const index = favoritos.findIndex(item => item.id === produto.id);
    
    if (index !== -1) {
        favoritos.splice(index, 1);
        btnElement.classList.remove('favoritado');
    } else {
        favoritos.push(produto);
        btnElement.classList.add('favoritado');
    }
    localStorage.setItem('drip_favoritos', JSON.stringify(favoritos));
}

window.setupToggleFavorito = function(produto, btnElement) {
    toggleFavorito(produto, btnElement);
};

// --- Funções de Produtos ---
async function fetchProdutos() {
  try {
    const res = await fetch(`${API_URL}/produtos.php`);
    return await res.json();
  } catch (err) {
    console.error("Erro:", err);
    if(lista) lista.innerHTML = "<p style='color:red; text-align:center; grid-column: 1/-1;'>Erro de conexão.</p>";
    return [];
  }
}

async function mostrarProdutos(filtro = "all", busca = "") {
  if (!lista) return;

  const produtos = await fetchProdutos();
  const favoritosSalvos = JSON.parse(localStorage.getItem('drip_favoritos')) || [];
  
  lista.innerHTML = "";

  const filtrados = produtos.filter(p => {
    const isFav = favoritosSalvos.some(fav => fav.id === p.id);
    let categoriaMatch;
    
    if (filtro === 'favorites') {
        categoriaMatch = isFav;
    } else {
        categoriaMatch = filtro === "all" || p.categoria.toLowerCase() === filtro.toLowerCase();
    }

    const nomeMatch = p.nome.toLowerCase().includes(busca.toLowerCase());
    return categoriaMatch && nomeMatch;
  });

  if (countValue) countValue.innerText = filtrados.length;

  if (filtrados.length === 0) {
    const msg = filtro === 'favorites' ? "Nenhum favorito ainda." : "Nenhum produto encontrado.";
    lista.innerHTML = `<p style='color:#71717a; grid-column: 1/-1; text-align:center; margin-top:20px;'>${msg}</p>`;
    return;
  }

  filtrados.forEach(p => {
    const cores = Array.isArray(p.cores) ? p.cores : (p.cores ? JSON.parse(p.cores) : []);
    const tamanhos = Array.isArray(p.tamanhos) ? p.tamanhos : (p.tamanhos ? JSON.parse(p.tamanhos) : []);
    const coresHtml = cores.map(c => `<span class="color-dot" style="background-color: ${c};" title="${c}"></span>`).join('');
    const pString = JSON.stringify(p).replace(/"/g, '&quot;');
    const isFav = favoritosSalvos.some(fav => fav.id === p.id);
    const favClass = isFav ? 'favoritado' : '';

    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <div class="image-container" onclick="window.location.href='detalhes.html?id=${p.id}'" style="cursor: pointer;">
          <img src="${p.imagem}" alt="${p.nome}">
          <span class="tag-category">${p.categoria}</span>
          <button class="btn-favorite ${favClass}" title="Favoritar" onclick="event.stopPropagation(); setupToggleFavorito(${pString}, this)">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
      </div>
      
      <div class="card-content">
          <h3 class="product-name" onclick="window.location.href='detalhes.html?id=${p.id}'">${p.nome}</h3>
          <div class="product-price">R$ ${Number(p.preco).toFixed(2)}</div>
          
          <div class="options-row">
            <span>Cores:</span> ${coresHtml.length ? coresHtml : '<span style="color:#555">-</span>'}
          </div>
          <div class="options-row">
            <span>Tam:</span> <span>${tamanhos.length ? tamanhos.join(", ") : '-'}</span>
          </div>

          <button class="btn-add-cart" onclick="window.location.href='detalhes.html?id=${p.id}'">
            Ver Detalhes
          </button>
      </div>
    `;
    lista.appendChild(card);
  });
}

// Listeners de Filtro e Busca
filtroBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filtroBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    mostrarProdutos(btn.dataset.category, buscaInput.value);
  });
});

if(buscaInput) {
    buscaInput.addEventListener("input", () => {
      const ativo = document.querySelector(".filter-btn.active") ? document.querySelector(".filter-btn.active").dataset.category : "all";
      mostrarProdutos(ativo, buscaInput.value);
    });
}