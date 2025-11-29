// layout.js

document.addEventListener("DOMContentLoaded", () => {
    carregarLayout();
});

function carregarLayout() {
    // 1. Detectar onde estamos para corrigir os links (Path Correction)
    const path = window.location.pathname;
    const isRoot = path.endsWith("/tcc/") || path.endsWith("/index.html") || path.endsWith("/");
    
    // Prefixo: se estiver na raiz usa "./", se estiver em subpasta usa "../"
    // Ajuste simples: se o caminho não tiver subpastas conhecidas, assume raiz
    const isInSubfolder = path.includes("/catalogo/") || path.includes("/login/") || path.includes("/registro/") || path.includes("/carrinho/") || path.includes("/meus_pedidos/") || path.includes("/rastreamento/") || path.includes("/admin/") || path.includes("/checkout/");
    
    const p = isInSubfolder ? "../" : "./";

    // 2. HTML do Cabeçalho (Header)
    const headerHTML = `
        <div class="container header-content">
            <a href="${p}index.html" class="logo">
                LOWKEY <span class="text-blue">DRIP</span>
            </a>

            <nav class="desktop-nav">
                <a href="${p}index.html" class="nav-link">Início</a>
                <a href="${p}catalogo/index.html" class="nav-link">Catálogo</a>
                <a href="${p}meus_pedidos/index.html" id="link-pedidos-nav" class="nav-link hidden">Meus Pedidos</a>
                <a href="${p}admin/index.html" id="link-admin-nav" class="nav-link text-red hidden">Admin</a>
            </nav>

            <div class="header-actions">
                <div class="search-bar-mini">
                    <input type="text" placeholder="Buscar...">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>

                <a href="${p}carrinho/index.html" class="icon-btn" title="Carrinho">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </a>

                <div id="auth-buttons-header">
                    <a href="${p}login/index.html" id="btn-login-header" class="btn-login-small">Entrar</a>
                    <button id="btn-logout-header" class="btn-logout-small hidden" title="Sair">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    </button>
                </div>
            </div>
        </div>
    `;

    // 3. HTML do Rodapé (Footer)
    const footerHTML = `
        <div class="container footer-grid">
            <div class="footer-col">
                <div class="logo">LOWKEY <span class="text-blue">DRIP</span></div>
                <p class="footer-desc">
                    A sua fonte número 1 de streetwear autêntico e exclusivo. 
                    Conectando você ao hype desde 2025.
                </p>
                <div class="social-icons">
                    <a href="#">Instagram</a>
                    <a href="#">Twitter</a>
                    <a href="#">Discord</a>
                </div>
            </div>

            <div class="footer-col">
                <h4>Navegação</h4>
                <a href="${p}index.html">Início</a>
                <a href="${p}catalogo/index.html">Catálogo Completo</a>
                <a href="${p}catalogo/index.html?filter=sneakers">Sneakers</a>
                <a href="${p}catalogo/index.html?filter=clothing">Roupas</a>
            </div>

            <div class="footer-col">
                <h4>Suporte</h4>
                <a href="${p}meus_pedidos/index.html">Meus Pedidos</a>
                <a href="${p}rastreamento/index.html">Rastrear Encomenda</a>
                <a href="#">Política de Trocas</a>
                <a href="#">Termos de Serviço</a>
            </div>

            <div class="footer-col">
                <h4>Pagamento Seguro</h4>
                <div class="payment-badges">
                    <span>PIX</span>
                    <span>Card</span>
                    <span>Boleto</span>
                </div>
                <p style="font-size:0.8rem; color:#666; margin-top:10px;">Ambiente 100% criptografado.</p>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 Lowkey Drip Resell. Todos os direitos reservados.</p>
            <p>Desenvolvido por Saniel.</p>
        </div>
    `;

    // 4. Injetar no HTML
    const headerPlaceholder = document.getElementById("main-header");
    const footerPlaceholder = document.getElementById("main-footer");

    if (headerPlaceholder) headerPlaceholder.innerHTML = headerHTML;
    if (footerPlaceholder) footerPlaceholder.innerHTML = footerHTML;

    // 5. Re-executar verificação de usuário (pois o HTML mudou)
    verificarUsuarioGlobal();
}

// Lógica de Usuário Global (Funciona em todas as páginas)
function verificarUsuarioGlobal() {
    const email = localStorage.getItem("user_email");
    const btnLogin = document.getElementById("btn-login-header");
    const btnLogout = document.getElementById("btn-logout-header");
    const linkPedidos = document.getElementById("link-pedidos-nav");
    const linkAdmin = document.getElementById("link-admin-nav");

    if (email) {
        // Logado
        if(btnLogin) btnLogin.classList.add("hidden");
        if(btnLogout) btnLogout.classList.remove("hidden");
        if(linkPedidos) linkPedidos.classList.remove("hidden");

        if (email === "sanielvanila@gmail.com") {
            if(linkAdmin) linkAdmin.classList.remove("hidden");
        }
    } else {
        // Visitante
        if(btnLogin) btnLogin.classList.remove("hidden");
        if(btnLogout) btnLogout.classList.add("hidden");
        if(linkPedidos) linkPedidos.classList.add("hidden");
        if(linkAdmin) linkAdmin.classList.add("hidden");
    }

    // Evento Logout
    if(btnLogout) {
        btnLogout.onclick = () => {
            localStorage.removeItem("user_email");
            localStorage.removeItem("user_name");
            localStorage.removeItem("user_id");
            localStorage.removeItem("drip_carrinho");
            window.location.href = "../login/index.html"; 
        };
    }
}