const API_URL = "http://localhost/tcc/api";

document.addEventListener("DOMContentLoaded", () => {
    verificarUsuario();
    carregarDestaques();
});

function verificarUsuario() {
    const email = localStorage.getItem("user_email");
    
    const guestArea = document.getElementById("guest-area");
    const userArea = document.getElementById("user-area");
    const btnLogout = document.getElementById("btn-logout");
    const btnAdmin = document.getElementById("btn-admin");
    const heroRegisterBtn = document.getElementById("hero-register-btn");

    if (email) {
        // LOGADO
        if(guestArea) guestArea.classList.add("hidden");
        if(userArea) userArea.classList.remove("hidden");
        
        // VERIFICAÇÃO DE ADMIN
        // Troque pelo seu email exato que está no banco como admin
        if (email === "sanielvanila@gmail.com") {
            if(btnAdmin) btnAdmin.classList.remove("hidden");
        }

        // Atualiza botão do banner
        if(heroRegisterBtn) {
            heroRegisterBtn.innerText = "Meus Pedidos";
            heroRegisterBtn.href = "meus_pedidos/index.html";
        }

    } else {
        // NÃO LOGADO
        if(guestArea) guestArea.classList.remove("hidden");
        if(userArea) userArea.classList.add("hidden");
    }

    // Logout
    if(btnLogout) {
        btnLogout.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("user_email");
            localStorage.removeItem("user_name");
            window.location.reload();
        });
    }
}

async function carregarDestaques() {
    const grid = document.getElementById("featured-grid");
    
    try {
        const res = await fetch(`${API_URL}/produtos.php`);
        const produtos = await res.json();

        if (produtos.length === 0) {
            grid.innerHTML = "<p class='loading'>Em breve novos produtos.</p>";
            return;
        }

        // Pega os 3 últimos produtos (novidades)
        const destaques = produtos.slice(0, 3);

        grid.innerHTML = ""; 

        destaques.forEach(p => {
            const card = document.createElement("div");
            card.classList.add("feat-card");
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