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
    
    // Botões que mudam
    const navComprar = document.getElementById("nav-comprar");
    const heroRegisterBtn = document.getElementById("hero-register-btn");
    const heroCta = document.getElementById("hero-cta");

    if (email) {
        // --- LOGADO ---
        if(guestArea) guestArea.classList.add("hidden");
        if(userArea) userArea.classList.remove("hidden");
        
        // Mostra o botão "Comprar" no menu
        if(navComprar) navComprar.classList.remove("hidden");

        // Admin
        if (email === "sanielvanila@gmail.com") {
            if(btnAdmin) btnAdmin.classList.remove("hidden");
        }

        // Ajusta botões do Banner
        if(heroRegisterBtn) {
            heroRegisterBtn.innerText = "Meus Pedidos";
            heroRegisterBtn.href = "meus_pedidos/index.html";
        }
        // Botão principal leva ao catálogo
        if(heroCta) {
            heroCta.href = "catalogo/index.html";
            heroCta.innerText = "Ver Drops";
        }

    } else {
        // --- NÃO LOGADO (Visitante) ---
        if(guestArea) guestArea.classList.remove("hidden");
        if(userArea) userArea.classList.add("hidden");
        
        // Esconde o botão "Comprar" no menu
        if(navComprar) navComprar.classList.add("hidden");

        // Botão principal leva ao Login (para forçar cadastro)
        // Se preferir que eles vejam o catálogo mesmo sem comprar, mude para "catalogo/index.html"
        if(heroCta) {
            heroCta.href = "login/index.html"; 
            heroCta.innerText = "Entrar para ver Drops";
        }
    }

    // Logout
    if(btnLogout) {
        btnLogout.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("user_email");
            localStorage.removeItem("user_name");
            localStorage.removeItem("drip_carrinho");
            window.location.reload();
        });
    }
}

async function carregarDestaques() {
    const grid = document.getElementById("featured-grid");
    
    try {
        const res = await fetch(`${API_URL}/produtos.php`);
        const produtos = await res.json();

        if (!produtos || produtos.length === 0) {
            grid.innerHTML = "<p class='loading'>Em breve novos produtos.</p>";
            return;
        }

        const destaques = produtos.slice(0, 3);
        grid.innerHTML = ""; 

        destaques.forEach(p => {
            const card = document.createElement("div");
            card.classList.add("feat-card");
            // Só deixa clicar se tiver logado, senão manda pro login
            card.onclick = () => {
                if(localStorage.getItem("user_email")) {
                    window.location.href = `catalogo/detalhes.html?id=${p.id}`;
                } else {
                    window.location.href = "login/index.html";
                }
            };

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