// layout.js - Gerenciador de UI Global

document.addEventListener("DOMContentLoaded", () => {
    injetarComponentesGlobais();
    carregarLayout();
    ativarValidacaoGlobal();
});

function injetarComponentesGlobais() {
    // Injeta Toast e Modal no final do body se não existirem
    if (!document.getElementById('global-toast')) {
        const toastHTML = `
            <div id="global-toast" class="global-toast">
                <span id="toast-icon"></span>
                <span id="toast-text">Mensagem</span>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', toastHTML);
    }

    if (!document.getElementById('global-confirm-modal')) {
        const modalHTML = `
            <div id="global-confirm-modal" class="global-modal-overlay">
                <div class="global-modal">
                    <h2 style="margin-bottom:10px; font-size:1.4rem; color:#fff;">Confirmação</h2>
                    <p id="global-modal-text" style="color:#a1a1aa; margin-bottom:20px;">Tem certeza?</p>
                    <div class="modal-btns">
                        <button class="btn-modal-cancel" id="btn-global-cancel">Cancelar</button>
                        <button class="btn-modal-confirm" id="btn-global-confirm">Confirmar</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
}

function carregarLayout() {
    const path = window.location.pathname;
    const subfolders = ["/catalogo/", "/login/", "/registro/", "/carrinho/", "/meus_pedidos/", "/rastreamento/", "/admin/", "/checkout/", "/Api/"];
    const isInSubfolder = subfolders.some(folder => path.includes(folder));
    const p = isInSubfolder ? "../" : "./";

    // --- HTML Header (SEM BARRA DE BUSCA) ---
    const headerHTML = `
        <div class="header-container-global">
            <a href="${p}index.html" class="logo">LOWKEY <span class="text-blue">DRIP</span></a>
            
            <nav class="desktop-nav">
                <a href="${p}index.html" class="nav-link">Início</a>
                <a href="${p}catalogo/index.html" class="nav-link">Catálogo</a>
                <a href="${p}meus_pedidos/index.html" id="link-pedidos-nav" class="nav-link hidden">Meus Pedidos</a>
            </nav>

            <div class="header-actions">
                <a href="${p}carrinho/index.html" class="icon-btn" title="Meu Carrinho">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </a>

                <div id="auth-buttons-header">
                    <a href="${p}login/index.html" id="btn-login-header" class="btn-login-small">Entrar</a>
                    
                    <div id="user-logged-area" class="hidden" style="display:flex; align-items:center; gap:10px;">
                        <a href="${p}admin/index.html" id="link-admin-icon" class="icon-btn text-red hidden" title="Painel Admin">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </a>
                        
                        <button id="btn-logout-header" class="icon-btn text-gray" title="Sair">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // --- HTML Footer ---
    const footerHTML = `
        <div class="container footer-grid">
            <div class="footer-col">
                <div class="logo" style="margin-bottom:15px;">LOWKEY <span class="text-blue">DRIP</span></div>
                <p class="footer-desc">A sua fonte número 1 de streetwear autêntico e exclusivo no Brasil.</p>
                <div class="social-icons">
                    <a href="#" class="social-link">Instagram</a>
                    <a href="#" class="social-link">Twitter</a>
                    <a href="#" class="social-link">Discord</a>
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
                <h4>Área do Cliente</h4>
                <a href="${p}meus_pedidos/index.html">Meus Pedidos</a>
                <a href="${p}rastreamento/index.html">Rastrear Encomenda</a>
                <a href="#">Central de Ajuda</a>
                <a href="#">Termos de Uso</a>
            </div>
            <div class="footer-col">
                <h4>Pagamento Seguro</h4>
                <div class="payment-badges">
                    <span>PIX</span><span>Crédito</span><span>Boleto</span>
                </div>
                <p style="font-size:0.8rem; color:#666; margin-top:15px;">Ambiente criptografado.</p>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 Lowkey Drip Resell.</p>
        </div>
    `;

    const headerPlaceholder = document.getElementById("main-header");
    const footerPlaceholder = document.getElementById("main-footer");
    if (headerPlaceholder) headerPlaceholder.innerHTML = headerHTML;
    if (footerPlaceholder) footerPlaceholder.innerHTML = footerHTML;

    verificarUsuarioGlobal();
}

// --- Funções Globais ---

// 1. Mostrar Toast (Notificação Bonita)
window.showToast = function(msg, type = 'success') {
    const toast = document.getElementById('global-toast');
    if(!toast) return;
    const text = document.getElementById('toast-text');
    const icon = document.getElementById('toast-icon');
    
    text.innerText = msg;
    if (type === 'success') {
        toast.className = 'global-toast success show';
        icon.innerHTML = '✅'; 
    } else {
        toast.className = 'global-toast error show';
        icon.innerHTML = '❌'; 
    }
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// 2. Modal de Confirmação Customizado
window.showConfirmModal = function(msg, callback) {
    const modalOverlay = document.getElementById('global-confirm-modal');
    const msgText = document.getElementById('global-modal-text');
    const btnConfirm = document.getElementById('btn-global-confirm');
    const btnCancel = document.getElementById('btn-global-cancel');

    if(!modalOverlay) {
        if(confirm(msg)) callback();
        return;
    }

    msgText.innerText = msg;
    modalOverlay.classList.add('open');

    const newConfirm = btnConfirm.cloneNode(true);
    const newCancel = btnCancel.cloneNode(true);
    btnConfirm.parentNode.replaceChild(newConfirm, btnConfirm);
    btnCancel.parentNode.replaceChild(newCancel, btnCancel);

    newConfirm.addEventListener('click', () => {
        modalOverlay.classList.remove('open');
        callback();
    });

    newCancel.addEventListener('click', () => {
        modalOverlay.classList.remove('open');
    });
}

// 3. Validação de Formulários
function ativarValidacaoGlobal() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.setAttribute('novalidate', true);
        form.addEventListener('submit', (e) => {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopImmediatePropagation();
                const inputs = form.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    if (!input.validity.valid) mostrarErro(input);
                    else limparErro(input);
                });
            }
        });
        form.addEventListener('input', (e) => {
            if (e.target.validity.valid) limparErro(e.target);
        });
    });
}

window.mostrarErro = function(input) {
    input.classList.add('input-error');
    let msgDiv = input.parentNode.querySelector('.error-msg');
    if (!msgDiv) {
        msgDiv = document.createElement('span');
        msgDiv.className = 'error-msg';
        input.parentNode.appendChild(msgDiv);
        if(getComputedStyle(input.parentNode).position === 'static') {
            input.parentNode.style.position = 'relative';
        }
    }
    if (input.validity.valueMissing) msgDiv.innerText = "Este campo é obrigatório.";
    else if (input.validity.typeMismatch) msgDiv.innerText = "Formato inválido.";
    else if (input.validity.tooShort) msgDiv.innerText = `Mínimo de ${input.minLength} caracteres.`;
    else msgDiv.innerText = "Valor inválido.";
}

window.limparErro = function(input) {
    input.classList.remove('input-error');
    const msgDiv = input.parentNode.querySelector('.error-msg');
    if (msgDiv) msgDiv.remove();
}

function verificarUsuarioGlobal() {
    const email = localStorage.getItem("user_email");
    const btnLogin = document.getElementById("btn-login-header");
    const userArea = document.getElementById("user-logged-area");
    const btnLogout = document.getElementById("btn-logout-header");
    const linkPedidos = document.getElementById("link-pedidos-nav");
    const linkAdminIcon = document.getElementById("link-admin-icon");

    if (email) {
        if(btnLogin) btnLogin.classList.add("hidden");
        if(userArea) userArea.classList.remove("hidden");
        if(linkPedidos) linkPedidos.classList.remove("hidden");
        if (email === "sanielvanila@gmail.com" && linkAdminIcon) linkAdminIcon.classList.remove("hidden");
    } else {
        if(btnLogin) btnLogin.classList.remove("hidden");
        if(userArea) userArea.classList.add("hidden");
        if(linkPedidos) linkPedidos.classList.add("hidden");
    }

    if(btnLogout) {
        btnLogout.addEventListener("click", () => {
            showConfirmModal("Deseja realmente sair da sua conta?", () => {
                localStorage.clear();
                window.location.href = "../login/index.html"; 
            });
        });
    }
}