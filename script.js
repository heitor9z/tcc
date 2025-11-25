const API_URL = "http://localhost/tcc/api";

document.addEventListener("DOMContentLoaded", () => {
    verificarUsuario();
    carregarDestaques();
});

// 1. Verifica Login para ajustar o menu
function verificarUsuario() {
    const email = localStorage.getItem("user_email");
    const btnLogin = document.getElementById("btn-login");
    const btnProfile = document.getElementById("btn-profile");

    if (email) {
        // Logado
        if(btnLogin) btnLogin.classList.add("hidden");
        if(btnProfile) btnProfile.classList.remove("hidden");
    } else {
        // Não Logado
        if(btnLogin) btnLogin.classList.remove("hidden");
        if(btnProfile) btnProfile.classList.add("hidden");
    }
}

// 2. Carrega 3 Produtos para a seção "Trending"
async function carregarDestaques() {
    const grid = document.getElementById("featured-grid");
    
    try {
        const res = await fetch(`${API_URL}/produtos.php`);
        const produtos = await res.json();

        if (produtos.length === 0) {
            grid.innerHTML = "<p class='loading'>Em breve novos produtos.</p>";
            return;
        }

        // Pega os 3 primeiros (ou aleatórios se preferir)
        // Vamos pegar os 3 últimos adicionados (novidades)
        const destaques = produtos.slice(0, 3);

        grid.innerHTML = ""; // Limpa loading

        destaques.forEach(p => {
            const card = document.createElement("div");
            card.classList.add("feat-card");
            // Ao clicar, vai para os detalhes
            card.onclick = () => window.location.href = `catalogo/detalhes.html?id=${p.id}`;

            card.innerHTML = `
                <img src="${p.imagem}" alt="${p.nome}" class="feat-img">
                <div class="feat-info">
                    <span class="feat-cat">${p.categoria}</span>
                    <h3 class="feat-title">${p.nome}</h3>
                    <div class="feat-price">R$ ${Number(p.preco).toFixed(2)}</div>
                </div>
            `;
            grid.appendChild(card);
        });

    } catch (err) {
        console.error(err);
        grid.innerHTML = "<p class='loading'>Erro ao carregar destaques.</p>";
    }
}