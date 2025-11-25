const API_URL = "http://localhost/tcc/api";
let listaProdutosGlobal = []; // Para guardar os produtos carregados

// --- Navegação de Abas ---
window.showTab = function(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.menu-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(`tab-${tabName}`).classList.remove('hidden');
    
    // Ativa botão menu
    const btn = Array.from(document.querySelectorAll('.menu-btn'))
                     .find(b => b.innerText.toLowerCase().includes(tabName.substring(0,3)));
    if(btn) btn.classList.add('active');

    // Se for aba de gestão, recarrega
    if(tabName === 'pedidos' || tabName === 'produtos') carregarDados();
}

// --- Carregar Dados ---
async function carregarDados() {
    try {
        const res = await fetch(`${API_URL}/dados_admin.php`);
        const data = await res.json();
        
        listaProdutosGlobal = data.produtos; // Salva para usar na edição
        renderizarPedidos(data.pedidos);
        renderizarProdutos(data.produtos);
    } catch (err) { console.error("Erro:", err); }
}

// --- Renderizar Pedidos ---
function renderizarPedidos(pedidos) {
    const lista = document.getElementById("orders-list");
    lista.innerHTML = "";
    if(!pedidos || pedidos.length === 0) { lista.innerHTML = "<p>Nenhuma venda encontrada.</p>"; return; }

    pedidos.forEach(p => {
        let itensHtml = p.itens.map(i => `<div class="order-item-row"><span>${i.quantidade}x ${i.produto_nome}</span><span>R$ ${i.preco_unitario}</span></div>`).join('');
        const end = p.endereco_completo || {};
        const enderecoStr = `${end.rua}, ${end.cidade} - ${end.estado}`;

        const card = document.createElement("div");
        card.classList.add("order-card");
        card.innerHTML = `
            <div class="order-header"><span class="order-id">#${p.id}</span><span class="order-status">${p.status}</span></div>
            <div class="client-info">
                <strong>${p.cliente_nome}</strong> (${p.cliente_email})<br>
                ${enderecoStr}<br>
                <strong>Total: R$ ${p.total}</strong>
            </div>
            <div class="order-items">${itensHtml}</div>
        `;
        lista.appendChild(card);
    });
}

// --- Renderizar Produtos na Tabela ---
function renderizarProdutos(produtos) {
    const tbody = document.getElementById("products-list-body");
    tbody.innerHTML = "";
    produtos.forEach(p => {
        // Formata JSON para texto legível
        const cores = p.cores ? JSON.parse(p.cores).length : 0;
        const tamanhos = p.tamanhos ? JSON.parse(p.tamanhos).join(', ') : '-';

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><img src="${p.imagem}" class="prod-img-mini"></td>
            <td>${p.nome}</td>
            <td>R$ ${p.preco}</td>
            <td style="font-size:0.8rem; color:#aaa">${cores} cores <br> Tam: ${tamanhos}</td>
            <td>
                <button class="btn-action btn-edit" onclick="abrirModalEdicao(${p.id})">Editar</button>
                <button class="btn-action btn-delete" onclick="deletarProduto(${p.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// --- DELETAR Produto ---
window.deletarProduto = async function(id) {
    if(!confirm("Tem certeza que deseja apagar este produto?")) return;

    try {
        await fetch(`${API_URL}/deletar_produto.php`, {
            method: "POST", body: JSON.stringify({ id })
        });
        alert("Produto excluído!");
        carregarDados();
    } catch(e) { alert("Erro ao excluir."); }
}

// --- EDITAR Produto (Abrir Modal) ---
window.abrirModalEdicao = function(id) {
    const p = listaProdutosGlobal.find(item => item.id == id);
    if(!p) return;

    // Preenche campos
    document.getElementById('edit-id').value = p.id;
    document.getElementById('edit-nome').value = p.nome;
    document.getElementById('edit-preco').value = p.preco;
    document.getElementById('edit-categoria').value = p.categoria;
    document.getElementById('edit-imagem').value = p.imagem;

    // Marca Checkboxes de Cores
    const coresAtuais = p.cores ? JSON.parse(p.cores) : [];
    document.querySelectorAll('input[name="edit-cor"]').forEach(cb => {
        cb.checked = coresAtuais.includes(cb.value);
    });

    // Marca Checkboxes de Tamanhos
    const tamsAtuais = p.tamanhos ? JSON.parse(p.tamanhos) : [];
    document.querySelectorAll('input[name="edit-tamanho"]').forEach(cb => {
        cb.checked = tamsAtuais.includes(cb.value);
    });

    document.getElementById('edit-modal').classList.remove('hidden');
}

window.closeEditModal = function() {
    document.getElementById('edit-modal').classList.add('hidden');
}

// --- SALVAR EDIÇÃO ---
document.getElementById('edit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('edit-id').value;
    const nome = document.getElementById('edit-nome').value;
    const preco = document.getElementById('edit-preco').value;
    const categoria = document.getElementById('edit-categoria').value;
    const imagem = document.getElementById('edit-imagem').value;

    const cores = []; 
    document.querySelectorAll('input[name="edit-cor"]:checked').forEach(c => cores.push(c.value));
    
    const tamanhos = []; 
    document.querySelectorAll('input[name="edit-tamanho"]:checked').forEach(t => tamanhos.push(t.value));

    try {
        const res = await fetch(`${API_URL}/editar_produto.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, nome, preco, categoria, imagem, cores, tamanhos })
        });
        
        if(res.ok) {
            alert("Produto atualizado!");
            closeEditModal();
            carregarDados();
        }
    } catch(err) { alert("Erro ao atualizar."); }
});

// --- SALVAR NOVO ---
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
        const res = await fetch(`${API_URL}/criar_produto.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, preco, categoria, imagem, cores, tamanhos })
        });
        if (res.ok) { alert("Produto cadastrado!"); document.getElementById("product-form").reset(); }
    } catch (error) { alert("Erro de conexão."); }
});

carregarDados();