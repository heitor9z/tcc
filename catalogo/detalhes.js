// catalogo/detalhes.js

const API_URL = "http://localhost/tcc/api";
const loading = document.getElementById("loading");
const content = document.getElementById("product-content");
const imgEl = document.getElementById("prod-img");
const nameEl = document.getElementById("prod-name");
const catEl = document.getElementById("prod-category");
const priceEl = document.getElementById("prod-price");
const colorContainer = document.getElementById("color-container");
const sizeContainer = document.getElementById("size-container");
const btnAdd = document.getElementById("btn-add-cart");

let produtoAtual = null;
let corSelecionada = null;
let tamanhoSelecionado = null;

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) {
        window.location.href = "index.html";
        return;
    }
    carregarProduto(id);
});

async function carregarProduto(id) {
    try {
        const res = await fetch(`${API_URL}/produtos.php`);
        const produtos = await res.json();
        produtoAtual = produtos.find(p => p.id == id);

        if (!produtoAtual) {
            loading.innerText = "Produto não encontrado.";
            return;
        }
        renderizarDetalhes(produtoAtual);
    } catch (err) {
        loading.innerText = "Erro ao carregar produto.";
    }
}

function renderizarDetalhes(p) {
    const cores = Array.isArray(p.cores) ? p.cores : (p.cores ? JSON.parse(p.cores) : []);
    const tamanhos = Array.isArray(p.tamanhos) ? p.tamanhos : (p.tamanhos ? JSON.parse(p.tamanhos) : []);

    imgEl.src = p.imagem;
    nameEl.innerText = p.nome;
    catEl.innerText = p.categoria;
    priceEl.innerText = `R$ ${Number(p.preco).toFixed(2)}`;

    colorContainer.innerHTML = cores.map(cor => `
        <div class="color-option" style="background-color: ${cor};" onclick="selecionarCor(this, '${cor}')" title="${cor}"></div>
    `).join('');

    sizeContainer.innerHTML = tamanhos.map(tam => `
        <div class="size-option" onclick="selecionarTamanho(this, '${tam}')">${tam}</div>
    `).join('');

    carregarAvaliacoes(p.id);
    loading.classList.add("hidden");
    content.classList.remove("hidden");
}

window.selecionarCor = function(el, cor) {
    document.querySelectorAll('.color-option').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    corSelecionada = cor;
}

window.selecionarTamanho = function(el, tam) {
    document.querySelectorAll('.size-option').forEach(s => s.classList.remove('selected'));
    el.classList.add('selected');
    tamanhoSelecionado = tam;
}

if(btnAdd) {
    btnAdd.addEventListener("click", () => {
        if (!corSelecionada || !tamanhoSelecionado) {
            // AQUI USAMOS O TOAST EM VEZ DE ALERT
            if(window.showToast) showToast("Selecione uma cor e um tamanho.", "error");
            else alert("Selecione cor e tamanho.");
            return;
        }

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
    const index = carrinho.findIndex(item => 
        item.id === produto.id && item.corEscolhida === produto.corEscolhida && item.tamanhoEscolhido === produto.tamanhoEscolhido
    );
    
    if (index !== -1) carrinho[index].quantidade += 1;
    else carrinho.push({ ...produto, quantidade: 1 });
    
    localStorage.setItem('drip_carrinho', JSON.stringify(carrinho));
    
    btnAdd.innerText = "Adicionado! ✓";
    btnAdd.style.backgroundColor = "#10b981";
    
    setTimeout(() => { window.location.href = "../carrinho/index.html"; }, 800);
}

// --- Lógica de Avaliações ---
let notaUsuario = 0;
window.setNota = function(n) {
    notaUsuario = n;
    const estrelas = document.querySelectorAll('.star-btn');
    estrelas.forEach((s, index) => { s.style.color = index < n ? '#fbbf24' : '#3f3f46'; });
}

async function carregarAvaliacoes(produtoId) {
    try {
        const res = await fetch(`${API_URL}/avaliacoes.php?produto_id=${produtoId}`);
        const data = await res.json();
        
        const starsHtml = '★'.repeat(Math.round(data.media)) + '☆'.repeat(5 - Math.round(data.media));
        document.querySelector('#rating-display .stars').innerText = starsHtml;
        document.getElementById('rating-value-small').innerText = data.media;
        document.getElementById('rating-count-small').innerText = `(${data.total} avaliações)`;

        document.getElementById('rating-value-big').innerText = data.media;
        document.getElementById('rating-count-big').innerText = `${data.total} avaliações`;
        
        let starsBig = '';
        for(let i=0; i<5; i++) starsBig += i < Math.round(data.media) ? '★' : '☆';
        document.getElementById('stars-static').innerText = starsBig;

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
        document.getElementById('reviews-area').classList.remove('hidden');
    } catch (err) { console.error("Erro ao carregar avaliações", err); }
}

window.enviarAvaliacao = async function() {
    const userId = localStorage.getItem("user_id");
    if (!userId) {
        showToast("Você precisa fazer login para avaliar!", "error");
        setTimeout(() => window.location.href = "../login/index.html", 2000);
        return;
    }
    if (notaUsuario === 0) {
        showToast("Por favor, selecione uma nota (estrelas).", "error");
        return;
    }

    const comentario = document.getElementById('review-comment').value;
    const produtoId = new URLSearchParams(window.location.search).get("id");

    try {
        const res = await fetch(`${API_URL}/avaliacoes.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ produto_id: produtoId, usuario_id: userId, nota: notaUsuario, comentario: comentario })
        });
        const result = await res.json(); 

        if (res.ok) {
            showToast("Avaliação enviada com sucesso!");
            document.getElementById('review-comment').value = "";
            setNota(0);
            carregarAvaliacoes(produtoId);
        } else {
            showToast(result.message || "Erro ao processar.", "error");
        }
    } catch (err) {
        showToast("Erro de conexão.", "error");
    }
}