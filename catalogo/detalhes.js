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

    // Carregar Avaliações Reais (NOVO)
    carregarAvaliacoes(p.id);

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

// --- Lógica de Avaliações (NOVO) ---
let notaUsuario = 0;

// Função Visual das Estrelas (Input)
window.setNota = function(n) {
    notaUsuario = n;
    const estrelas = document.querySelectorAll('.star-btn');
    estrelas.forEach((s, index) => {
        s.style.color = index < n ? '#fbbf24' : '#3f3f46';
    });
}

// Carregar Dados da API e Renderizar na Tela
async function carregarAvaliacoes(produtoId) {
    try {
        const res = await fetch(`${API_URL}/avaliacoes.php?produto_id=${produtoId}`);
        const data = await res.json();
        
        // --- 1. Atualiza o Resumo no Topo (Pequeno) ---
        const starsHtml = '★'.repeat(Math.round(data.media)) + '☆'.repeat(5 - Math.round(data.media));
        document.querySelector('#rating-display .stars').innerText = starsHtml;
        document.getElementById('rating-value-small').innerText = data.media;
        document.getElementById('rating-count-small').innerText = `(${data.total} avaliações)`;

        // --- 2. Atualiza o Painel Grande (Inferior) ---
        document.getElementById('rating-value-big').innerText = data.media;
        document.getElementById('rating-count-big').innerText = `${data.total} avaliações`;
        
        // Estrelas estáticas grandes
        let starsBig = '';
        for(let i=0; i<5; i++) starsBig += i < Math.round(data.media) ? '★' : '☆';
        document.getElementById('stars-static').innerText = starsBig;

        // --- 3. Renderiza a Lista de Comentários ---
        const list = document.getElementById('comments-list');
        list.innerHTML = "";

        if (data.comentarios && data.comentarios.length > 0) {
            data.comentarios.forEach(c => {
                let cStars = '★'.repeat(c.nota) + '☆'.repeat(5 - c.nota);
                
                const div = document.createElement('div');
                div.classList.add('comment-card');
                div.innerHTML = `
                    <div class="comment-header">
                        <span class="comment-user">${c.nome}</span>
                        <span class="comment-date">${new Date(c.data_avaliacao).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <span class="comment-stars">${cStars}</span>
                    <p class="comment-text">${c.comentario || "<em>Sem comentário.</em>"}</p>
                `;
                list.appendChild(div);
            });
        } else {
            list.innerHTML = "<p style='color:#666; text-align:center; padding:20px;'>Nenhuma avaliação ainda. Seja o primeiro!</p>";
        }

        // Mostra a seção que estava oculta
        document.getElementById('reviews-area').classList.remove('hidden');

    } catch (err) {
        console.error("Erro ao carregar avaliações", err);
    }
}

// Enviar Avaliação
window.enviarAvaliacao = async function() {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
        alert("Você precisa fazer login para avaliar!");
        window.location.href = "../login/index.html";
        return;
    }
    if (notaUsuario === 0) {
        alert("Por favor, selecione uma nota (estrelas).");
        return;
    }

    const comentario = document.getElementById('review-comment').value;
    const produtoId = new URLSearchParams(window.location.search).get("id");

 try {
        const res = await fetch(`${API_URL}/avaliacoes.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                produto_id: produtoId,
                usuario_id: userId,
                nota: notaUsuario,
                comentario: comentario
            })
        });

        // Tenta ler a mensagem JSON do servidor
        const result = await res.json(); 

        if (res.ok) {
            alert(result.message || "Avaliação enviada!"); // Mensagem de sucesso
            document.getElementById('review-comment').value = "";
            setNota(0);
            carregarAvaliacoes(produtoId);
        } else {
            // AQUI: Mostra o erro vindo do PHP ("Você precisa comprar...")
            alert(result.message || "Erro ao processar."); 
        }
    } catch (err) {
        console.error(err);
        alert("Erro de conexão.");
    }
}