// catalogo/detalhes.js

const API_URL = "http://localhost/tcc/api";

// Elementos da Tela
const loading = document.getElementById("loading");
const content = document.getElementById("product-content");
const imgEl = document.getElementById("prod-img");
const nameEl = document.getElementById("prod-name");
const catEl = document.getElementById("prod-category");
const priceEl = document.getElementById("prod-price");
const colorContainer = document.getElementById("color-container");
const sizeContainer = document.getElementById("size-container");
const btnAdd = document.getElementById("btn-add-cart");

// Variáveis de Estado
let produtoAtual = null;
let corSelecionada = null;
let tamanhoSelecionado = null;

// 1. Inicialização
document.addEventListener("DOMContentLoaded", () => {
    // Pega o ID da URL (ex: detalhes.html?id=5)
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        alert("Produto não especificado.");
        window.location.href = "index.html";
        return;
    }

    carregarProduto(id);
});

// 2. Buscar Produto no Backend
async function carregarProduto(id) {
    try {
        const res = await fetch(`${API_URL}/produtos.php`);
        const produtos = await res.json();
        
        // Encontra o produto pelo ID
        // Nota: Como o ID no banco é número e na URL é string, usamos == (não ===)
        produtoAtual = produtos.find(p => p.id == id);

        if (!produtoAtual) {
            loading.innerText = "Produto não encontrado.";
            return;
        }

        renderizarDetalhes(produtoAtual);

    } catch (err) {
        console.error(err);
        loading.innerText = "Erro ao carregar produto.";
    }
}

// 3. Renderizar na Tela
function renderizarDetalhes(p) {
    // Tratamento de Arrays (o banco pode mandar JSON string ou array dependendo da versão PHP)
    const cores = Array.isArray(p.cores) ? p.cores : (p.cores ? JSON.parse(p.cores) : []);
    const tamanhos = Array.isArray(p.tamanhos) ? p.tamanhos : (p.tamanhos ? JSON.parse(p.tamanhos) : []);

    // Preenche textos e imagem
    imgEl.src = p.imagem;
    nameEl.innerText = p.nome;
    catEl.innerText = p.categoria;
    priceEl.innerText = `R$ ${Number(p.preco).toFixed(2)}`;

    // Renderiza Bolinhas de Cor
    colorContainer.innerHTML = cores.map(cor => `
        <div class="color-option" 
             style="background-color: ${cor};" 
             onclick="selecionarCor(this, '${cor}')"
             title="${cor}">
        </div>
    `).join('');

    // Renderiza Botões de Tamanho
    sizeContainer.innerHTML = tamanhos.map(tam => `
        <div class="size-option" 
             onclick="selecionarTamanho(this, '${tam}')">
             ${tam}
        </div>
    `).join('');

    // Mostra conteúdo e esconde loading
    loading.classList.add("hidden");
    content.classList.remove("hidden");
}

// 4. Funções de Seleção (Globais para o HTML acessar ou via listener)
window.selecionarCor = function(el, cor) {
    // Remove classe 'selected' de todos
    document.querySelectorAll('.color-option').forEach(c => c.classList.remove('selected'));
    // Adiciona no clicado
    el.classList.add('selected');
    corSelecionada = cor;
}

window.selecionarTamanho = function(el, tam) {
    // Remove classe 'selected' de todos
    document.querySelectorAll('.size-option').forEach(s => s.classList.remove('selected'));
    // Adiciona no clicado
    el.classList.add('selected');
    tamanhoSelecionado = tam;
}

// 5. Adicionar ao Carrinho
if(btnAdd) {
    btnAdd.addEventListener("click", () => {
        if (!corSelecionada || !tamanhoSelecionado) {
            alert("Por favor, selecione uma cor e um tamanho.");
            return;
        }

        // Cria objeto para o carrinho com as opções escolhidas
        const itemParaCarrinho = {
            ...produtoAtual,
            corEscolhida: corSelecionada,
            tamanhoEscolhido: tamanhoSelecionado
        };

        adicionarAoLocalStorage(itemParaCarrinho);
    });
}

function adicionarAoLocalStorage(produto) {
    let carrinho = JSON.parse(localStorage.getItem('drip_carrinho')) || [];
    
    // Verifica se já existe item idêntico (mesmo ID + mesma Cor + mesmo Tamanho)
    const index = carrinho.findIndex(item => 
        item.id === produto.id && 
        item.corEscolhida === produto.corEscolhida && 
        item.tamanhoEscolhido === produto.tamanhoEscolhido
    );
    
    if (index !== -1) {
        carrinho[index].quantidade += 1;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
    }
    
    localStorage.setItem('drip_carrinho', JSON.stringify(carrinho));
    
    // Feedback Visual
    btnAdd.innerText = "Adicionado! ✓";
    btnAdd.style.backgroundColor = "#10b981"; // Verde
    
    setTimeout(() => {
        // Redireciona para o Carrinho
        window.location.href = "../carrinho/index.html";
    }, 800);
}