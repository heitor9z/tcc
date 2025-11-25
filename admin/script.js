const API_URL = "http://localhost/tcc/api";
let listaProdutosGlobal = [];

// --- CORREÇÃO: Navegação de Abas ---
window.showTab = function(tabName, btnElement) {
    // 1. Esconde todas as abas
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    
    // 2. Remove classe 'active' de TODOS os botões do menu
    document.querySelectorAll('.menu-btn').forEach(el => el.classList.remove('active'));

    // 3. Mostra a aba certa
    document.getElementById(`tab-${tabName}`).classList.remove('hidden');
    
    // 4. Ativa o botão que foi CLICADO (agora é infalível)
    if (btnElement) {
        btnElement.classList.add('active');
    }

    // 5. Se for aba de pedidos ou produtos, recarrega os dados
    if(tabName === 'pedidos' || tabName === 'produtos') {
        carregarDados();
    }
}

// --- Carregar Dados ---
async function carregarDados() {
    try {
        console.log("Buscando dados..."); // Debug
        const res = await fetch(`${API_URL}/dados_admin.php`);
        const data = await res.json();
        
        // Guarda produtos na memória para edição
        listaProdutosGlobal = data.produtos; 
        
        renderizarPedidos(data.pedidos);
        renderizarProdutos(data.produtos);

    } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
        document.getElementById("products-list-body").innerHTML = `<tr><td colspan="5" style="text-align:center; color:red;">Erro de conexão com API</td></tr>`;
    }
}

// --- Renderizar Pedidos ---
function renderizarPedidos(pedidos) {
    const lista = document.getElementById("orders-list");
    lista.innerHTML = "";
    
    if(!pedidos || pedidos.length === 0) {
        lista.innerHTML = "<p style='padding:20px; color:#888;'>Nenhuma venda encontrada.</p>";
        return;
    }

    pedidos.forEach(p => {
        let itensHtml = p.itens.map(i => `<div class="order-item-row"><span>${i.quantidade}x ${i.produto_nome}</span></div>`).join('');
        const end = p.endereco_completo || {};
        const enderecoStr = `${end.rua}, ${end.cidade}`;

        const statusOptions = `
            <option value="Pago" ${p.status === 'Pago' ? 'selected' : ''}>Pago</option>
            <option value="Preparando" ${p.status === 'Preparando' ? 'selected' : ''}>Preparando</option>
            <option value="A Caminho" ${p.status === 'A Caminho' ? 'selected' : ''}>A Caminho</option>
            <option value="Entregue" ${p.status === 'Entregue' ? 'selected' : ''}>Entregue</option>
        `;

        const card = document.createElement("div");
        card.classList.add("order-card");
        card.innerHTML = `
            <div class="order-header">
                <span class="order-id">#${p.id}</span>
                <select onchange="atualizarStatus(${p.id}, this.value)" class="status-select">${statusOptions}</select>
            </div>
            <div class="client-info">
                <strong>${p.cliente_nome}</strong><br>
                ${enderecoStr}<br>
                Total: R$ ${p.total}
            </div>
            <div class="order-items">${itensHtml}</div>
        `;
        lista.appendChild(card);
    });
}

// --- Atualizar Status Pedido ---
window.atualizarStatus = async function(id, novoStatus) {
    try {
        await fetch(`${API_URL}/atualizar_pedido.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status: novoStatus })
        });
    } catch(e) { alert("Erro ao atualizar status."); }
}

// --- Renderizar Produtos ---
function renderizarProdutos(produtos) {
    const tbody = document.getElementById("products-list-body");
    tbody.innerHTML = "";
    
    if (!produtos || produtos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px;">Nenhum produto cadastrado.</td></tr>`;
        return;
    }

    produtos.forEach(p => {
        // Formata JSON
        const cores = p.cores ? JSON.parse(p.cores).length : 0;
        const tamanhos = p.tamanhos ? JSON.parse(p.tamanhos).join(', ') : '-';

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><img src="${p.imagem}" class="prod-img-mini"></td>
            <td>${p.nome}</td>
            <td>R$ ${Number(p.preco).toFixed(2)}</td>
            <td style="font-size:0.8rem; color:#aaa">${cores} cores <br> Tam: ${tamanhos}</td>
            <td>
                <button class="btn-action btn-edit" onclick="abrirModalEdicao(${p.id})">Editar</button>
                <button class="btn-action btn-delete" onclick="deletarProduto(${p.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// --- Funções de Produto (CRUD) ---
window.deletarProduto = async function(id) {
    if(!confirm("Tem certeza?")) return;
    try {
        await fetch(`${API_URL}/deletar_produto.php`, { method: "POST", body: JSON.stringify({ id }) });
        carregarDados();
    } catch(e) { alert("Erro."); }
}

window.abrirModalEdicao = function(id) {
    const p = listaProdutosGlobal.find(item => item.id == id);
    if(!p) return;

    document.getElementById('edit-id').value = p.id;
    document.getElementById('edit-nome').value = p.nome;
    document.getElementById('edit-preco').value = p.preco;
    document.getElementById('edit-categoria').value = p.categoria;
    document.getElementById('edit-imagem').value = p.imagem;

    const coresAtuais = p.cores ? JSON.parse(p.cores) : [];
    document.querySelectorAll('input[name="edit-cor"]').forEach(cb => cb.checked = coresAtuais.includes(cb.value));

    const tamsAtuais = p.tamanhos ? JSON.parse(p.tamanhos) : [];
    document.querySelectorAll('input[name="edit-tamanho"]').forEach(cb => cb.checked = tamsAtuais.includes(cb.value));

    document.getElementById('edit-modal').classList.remove('hidden');
}

window.closeEditModal = function() {
    document.getElementById('edit-modal').classList.add('hidden');
}

// --- Salvar Novo ---
document.getElementById("product-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nome = document.getElementById("nome").value;
    const preco = document.getElementById("preco").value;
    const categoria = document.getElementById("categoria").value;
    const imagem = document.getElementById("imagem").value;
    const cores = []; document.querySelectorAll('input[name="cor"]:checked').forEach(c => cores.push(c.value));
    const tamanhos = []; document.querySelectorAll('input[name="tamanho"]:checked').forEach(t => tamanhos.push(t.value));

    if (cores.length === 0 || tamanhos.length === 0) { alert("Selecione cor e tamanho."); return; }

    try {
        await fetch(`${API_URL}/criar_produto.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, preco, categoria, imagem, cores, tamanhos })
        });
        alert("Produto cadastrado!");
        carregarDados();
        document.getElementById("product-form").reset();
    } catch (error) { alert("Erro."); }
});

// --- Salvar Edição ---
document.getElementById('edit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    const nome = document.getElementById('edit-nome').value;
    const preco = document.getElementById('edit-preco').value;
    const categoria = document.getElementById('edit-categoria').value;
    const imagem = document.getElementById('edit-imagem').value;
    const cores = []; document.querySelectorAll('input[name="edit-cor"]:checked').forEach(c => cores.push(c.value));
    const tamanhos = []; document.querySelectorAll('input[name="edit-tamanho"]:checked').forEach(t => tamanhos.push(t.value));

    try {
        await fetch(`${API_URL}/editar_produto.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, nome, preco, categoria, imagem, cores, tamanhos })
        });
        alert("Atualizado!");
        closeEditModal();
        carregarDados();
    } catch(err) { alert("Erro."); }
});

// Inicializa
carregarDados();