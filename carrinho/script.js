const container = document.getElementById("cartItemsContainer");
const subtotalEl = document.getElementById("subtotal");
const freteEl = document.getElementById("frete");
const totalEl = document.getElementById("total");

// Carregar do LocalStorage
let carrinho = JSON.parse(localStorage.getItem('drip_carrinho')) || [];

function renderizarCarrinho() {
    container.innerHTML = "";
    let subtotal = 0;

    if (carrinho.length === 0) {
        container.innerHTML = "<p class='empty-msg'>Seu carrinho está vazio.</p>";
    }

    carrinho.forEach((item, index) => {
        const totalItem = item.preco * item.quantidade;
        subtotal += totalItem;

        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `
            <img src="${item.imagem}" class="item-img">
            <div class="item-info">
                <div class="item-name">${item.nome}</div>
                <div class="item-details">Tamanho: M (Exemplo)</div>
                <div class="item-controls">
                    <div class="qty-control">
                        <button class="qty-btn" onclick="alterarQtd(${index}, -1)">-</button>
                        <span class="qty-value">${item.quantidade}</span>
                        <button class="qty-btn" onclick="alterarQtd(${index}, 1)">+</button>
                    </div>
                </div>
            </div>
            <div class="item-price">R$ ${totalItem.toFixed(2)}</div>
            <button class="btn-remove" onclick="removerItem(${index})">🗑️</button>
        `;
        container.appendChild(div);
    });

    // Atualiza Totais
    const frete = subtotal > 0 ? 15.00 : 0; // Frete fixo se tiver item
    subtotalEl.innerText = `R$ ${subtotal.toFixed(2)}`;
    freteEl.innerText = `R$ ${frete.toFixed(2)}`;
    totalEl.innerText = `R$ ${(subtotal + frete).toFixed(2)}`;
}

// Funções Globais
window.alterarQtd = function(index, delta) {
    if (carrinho[index].quantidade + delta > 0) {
        carrinho[index].quantidade += delta;
    }
    salvarERenderizar();
};

window.removerItem = function(index) {
    carrinho.splice(index, 1);
    salvarERenderizar();
};

function salvarERenderizar() {
    localStorage.setItem('drip_carrinho', JSON.stringify(carrinho));
    renderizarCarrinho();
}

// Iniciar
renderizarCarrinho();