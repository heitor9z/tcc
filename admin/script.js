const API_URL = "http://localhost/tcc/api";
let listaProdutosGlobal = [];
let idParaDeletar = null;

// --- Inicialização ---
document.addEventListener("DOMContentLoaded", () => {
    carregarDados();
    setupCustomSelect('wrapper-categoria', 'categoria', 'trigger-text-categoria');
    setupCustomSelect('wrapper-edit-categoria', 'edit-categoria', 'trigger-text-edit-categoria');
});

// --- FUNÇÃO DE TOAST (Substitui Alert) ---
function showToast(msg, type = 'success') {
    const toast = document.getElementById('admin-toast');
    const text = document.getElementById('toast-text');
    const icon = document.getElementById('toast-icon');
    
    // Configura
    text.innerText = msg;
    if (type === 'success') {
        toast.className = 'admin-toast success show';
        icon.innerHTML = '✅'; 
    } else {
        toast.className = 'admin-toast error show';
        icon.innerHTML = '❌'; 
    }

    // Esconde depois de 3 seg
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// --- Lógica do Select Customizado ---
function setupCustomSelect(wrapperId, inputId, textId) {
    const wrapper = document.getElementById(wrapperId);
    const input = document.getElementById(inputId);
    const textSpan = document.getElementById(textId);
    if(!wrapper || !input) return;

    const trigger = wrapper.querySelector('.custom-select-trigger');
    const options = wrapper.querySelectorAll('.custom-option');

    trigger.addEventListener('click', (e) => {
        document.querySelectorAll('.custom-select-wrapper').forEach(w => {
            if (w !== wrapper) w.classList.remove('open');
        });
        wrapper.classList.toggle('open');
        e.stopPropagation();
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            options.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            
            const value = option.getAttribute('data-value');
            const label = option.innerText;
            
            input.value = value;
            textSpan.innerText = label;
            textSpan.style.color = "#fff";
            
            wrapper.classList.remove('open');
            if(window.limparErro) window.limparErro(input);
        });
    });

    window.addEventListener('click', () => {
        wrapper.classList.remove('open');
    });
}

// --- Navegação ---
window.showTab = function(tabName, btnElement) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.menu-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(`tab-${tabName}`).classList.remove('hidden');
    if (btnElement) btnElement.classList.add('active');
    if(tabName === 'pedidos' || tabName === 'produtos') carregarDados();
}

// --- Carregar Dados ---
async function carregarDados() {
    try {
        const res = await fetch(`${API_URL}/dados_admin.php`);
        const data = await res.json();
        listaProdutosGlobal = data.produtos; 
        renderizarPedidos(data.pedidos);
        renderizarProdutos(data.produtos);
    } catch (err) {
        console.error("Erro dashboard:", err);
    }
}

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
                ${end.rua}, ${end.cidade}<br>
                Total: R$ ${p.total}
            </div>
            <div class="order-items">${itensHtml}</div>
        `;
        lista.appendChild(card);
    });
}

window.atualizarStatus = async function(id, novoStatus) {
    try {
        await fetch(`${API_URL}/atualizar_pedido.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status: novoStatus })
        });
        showToast("Status atualizado!");
    } catch(e) { showToast("Erro ao atualizar.", "error"); }
}

function renderizarProdutos(produtos) {
    const tbody = document.getElementById("products-list-body");
    tbody.innerHTML = "";
    if (!produtos || produtos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px;">Nenhum produto.</td></tr>`;
        return;
    }
    produtos.forEach(p => {
        const cores = p.cores ? JSON.parse(p.cores).length : 0;
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><img src="${p.imagem}" class="prod-img-mini"></td>
            <td>${p.nome}</td>
            <td>R$ ${Number(p.preco).toFixed(2)}</td>
            <td style="font-size:0.8rem; color:#aaa">${cores} cores | ${p.categoria}</td>
            <td>
                <button class="btn-action btn-edit" onclick="abrirModalEdicao(${p.id})">Editar</button>
                <button class="btn-action btn-delete" onclick="deletarProduto(${p.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// --- Modais ---
window.deletarProduto = function(id) {
    idParaDeletar = id;
    document.getElementById('confirm-modal').classList.remove('hidden');
}
window.fecharModalConfirmacao = function() {
    idParaDeletar = null;
    document.getElementById('confirm-modal').classList.add('hidden');
}
document.getElementById('btn-confirm-delete').addEventListener('click', async () => {
    if (!idParaDeletar) return;
    try {
        await fetch(`${API_URL}/deletar_produto.php`, { 
            method: "POST", body: JSON.stringify({ id: idParaDeletar }) 
        });
        fecharModalConfirmacao();
        carregarDados();
        showToast("Produto excluído.");
    } catch(e) { showToast("Erro ao excluir.", "error"); }
});

// --- Modal de Edição ---
window.abrirModalEdicao = function(id) {
    const p = listaProdutosGlobal.find(item => item.id == id);
    if(!p) return;

    document.getElementById('edit-id').value = p.id;
    document.getElementById('edit-nome').value = p.nome;
    document.getElementById('edit-preco').value = p.preco;
    document.getElementById('edit-imagem').value = p.imagem;

    const editInput = document.getElementById('edit-categoria');
    const editText = document.getElementById('trigger-text-edit-categoria');
    editInput.value = p.categoria;
    const labels = { 'clothing': 'Roupas', 'sneakers': 'Tênis', 'accessories': 'Acessórios' };
    editText.innerText = labels[p.categoria] || p.categoria;
    editText.style.color = "#fff";

    const coresAtuais = p.cores ? JSON.parse(p.cores) : [];
    document.querySelectorAll('input[name="edit-cor"]').forEach(cb => cb.checked = coresAtuais.includes(cb.value));
    
    const tamsAtuais = p.tamanhos ? JSON.parse(p.tamanhos) : [];
    document.querySelectorAll('input[name="edit-tamanho"]').forEach(cb => cb.checked = tamsAtuais.includes(cb.value));

    document.getElementById('edit-modal').classList.remove('hidden');
}

window.closeEditModal = function() {
    document.getElementById('edit-modal').classList.add('hidden');
}

// --- Validação Visual Auxiliar ---
function mostrarErroCustomizado(elementName, formId, msg) {
    const input = document.querySelector(`#${formId} input[name="${elementName}"]`);
    if(!input) return;
    const container = input.closest('.form-group');
    const oldMsg = container.querySelector('.error-msg-chk');
    if(oldMsg) oldMsg.remove();
    const span = document.createElement('span');
    span.className = 'error-msg error-msg-chk';
    span.style.color = '#ef4444';
    span.style.fontSize = '0.8rem';
    span.style.display = 'block';
    span.style.marginTop = '5px';
    span.innerText = msg;
    container.appendChild(span);
}
function limparErrosCustomizados() {
    document.querySelectorAll('.error-msg-chk').forEach(e => e.remove());
}

// --- Submit (Criar) ---
document.getElementById("product-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    limparErrosCustomizados();

    const nome = document.getElementById("nome").value;
    const preco = document.getElementById("preco").value;
    const categoria = document.getElementById("categoria").value;
    const imagem = document.getElementById("imagem").value;
    
    const cores = []; document.querySelectorAll('input[name="cor"]:checked').forEach(c => cores.push(c.value));
    const tamanhos = []; document.querySelectorAll('input[name="tamanho"]:checked').forEach(t => tamanhos.push(t.value));

    let hasError = false;
    if (cores.length === 0) {
        mostrarErroCustomizado("cor", "product-form", "Selecione uma cor.");
        hasError = true;
    }
    if (tamanhos.length === 0) {
        mostrarErroCustomizado("tamanho", "product-form", "Selecione um tamanho.");
        hasError = true;
    }
    if (hasError) return;

    try {
        await fetch(`${API_URL}/criar_produto.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, preco, categoria, imagem, cores, tamanhos })
        });
        showToast("Produto cadastrado com sucesso!"); // USA TOAST AQUI
        carregarDados();
        document.getElementById("product-form").reset();
        document.getElementById("trigger-text-categoria").innerText = "Selecione uma categoria";
        document.getElementById("trigger-text-categoria").style.color = "#a1a1aa";
    } catch (error) { showToast("Erro ao criar.", "error"); }
});

// --- Submit (Editar) ---
document.getElementById('edit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    limparErrosCustomizados();

    const id = document.getElementById('edit-id').value;
    const nome = document.getElementById('edit-nome').value;
    const preco = document.getElementById('edit-preco').value;
    const categoria = document.getElementById('edit-categoria').value;
    const imagem = document.getElementById('edit-imagem').value;
    const cores = []; document.querySelectorAll('input[name="edit-cor"]:checked').forEach(c => cores.push(c.value));
    const tamanhos = []; document.querySelectorAll('input[name="edit-tamanho"]:checked').forEach(t => tamanhos.push(t.value));

    let hasError = false;
    if (cores.length === 0) {
        mostrarErroCustomizado("edit-cor", "edit-form", "Selecione uma cor.");
        hasError = true;
    }
    if (tamanhos.length === 0) {
        mostrarErroCustomizado("edit-tamanho", "edit-form", "Selecione um tamanho.");
        hasError = true;
    }
    if (hasError) return;

    try {
        await fetch(`${API_URL}/editar_produto.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, nome, preco, categoria, imagem, cores, tamanhos })
        });
        showToast("Produto atualizado!"); // USA TOAST AQUI
        closeEditModal();
        carregarDados();
    } catch(err) { showToast("Erro ao atualizar.", "error"); }
});