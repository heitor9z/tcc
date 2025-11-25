const API_URL = "http://localhost/tcc/api";
const listContainer = document.getElementById("orders-list");
const userGreeting = document.getElementById("user-greeting");

document.addEventListener("DOMContentLoaded", () => {
    // 1. Recupera dados do usuário (Salvos no Login)
    const userEmail = localStorage.getItem("user_email");
    const userName = localStorage.getItem("user_name");

    if (!userEmail) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <h3>Você não está logado</h3>
                <p>Faça login para ver seus pedidos.</p>
                <a href="../login/index.html" class="btn-track" style="margin-top:15px">Fazer Login</a>
            </div>
        `;
        return;
    }

    if(userName) userGreeting.innerText = `Olá, ${userName}`;

    // 2. Busca pedidos na API
    fetchPedidos(userEmail);
});

async function fetchPedidos(email) {
    try {
        const res = await fetch(`${API_URL}/meus_pedidos.php?email=${email}`);
        const pedidos = await res.json();

        renderizarPedidos(pedidos);
    } catch (err) {
        console.error(err);
        listContainer.innerHTML = "<p class='loading'>Erro ao carregar pedidos.</p>";
    }
}

function renderizarPedidos(pedidos) {
    listContainer.innerHTML = "";

    if (pedidos.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <h3>Nenhum pedido encontrado</h3>
                <p>Você ainda não fez compras conosco.</p>
                <a href="../catalogo/index.html" class="btn-track" style="margin-top:15px">Ir para a Loja</a>
            </div>
        `;
        return;
    }

    pedidos.forEach(p => {
        // Formata data
        const data = new Date(p.data_pedido).toLocaleDateString('pt-BR');
        
        // Gera HTML dos itens
        const itensHtml = p.itens.map(i => `
            <div class="item-row">
                <img src="${i.imagem_url}" class="item-img">
                <div class="item-info">
                    <h4>${i.produto_nome}</h4>
                    <p>Qtd: ${i.quantidade} | R$ ${i.preco_unitario}</p>
                </div>
            </div>
        `).join('');

        const card = document.createElement("div");
        card.classList.add("order-card");
        card.innerHTML = `
            <div class="order-header">
                <div>
                    <span class="order-id">Pedido #${p.id}</span>
                    <span class="order-date">Realizado em ${data}</span>
                </div>
                <span class="order-status">${p.status}</span>
            </div>
            
            <div class="order-body">
                <div class="order-items">
                    ${itensHtml}
                </div>
                
                <div class="order-actions">
                    <div>
                        <span class="total-label">Total</span>
                        <div class="total-value">R$ ${Number(p.total).toFixed(2)}</div>
                    </div>
                    <a href="../rastreamento/index.html?id=${p.id}" class="btn-track">
                        Rastrear Pedido
                    </a>
                </div>
            </div>
        `;
        listContainer.appendChild(card);
    });
}