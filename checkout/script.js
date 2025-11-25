// checkout/script.js

// --- TRAVA DE SEGURANÇA ---
// Se não tiver email salvo, chuta pro login imediatamente
if (!localStorage.getItem("user_email")) {
    alert("Acesso negado. Faça login primeiro.");
    window.location.href = "../login/index.html";
}

// --- Elementos do DOM ---
const itemsContainer = document.getElementById("checkout-items");
const subtotalEl = document.getElementById("summary-subtotal");
const discountEl = document.getElementById("summary-discount");
const totalEl = document.getElementById("summary-total");
const btnFinish = document.getElementById("btn-finish");

// Elementos do Modal
const modal = document.getElementById("pix-modal");
const closeModalBtn = document.getElementById("close-modal");
const btnConfirmPayment = document.getElementById("btn-confirm-payment");
const btnCopy = document.getElementById("btn-copy");
const qrImage = document.querySelector(".qr-img");
const copyInput = document.querySelector(".copy-input-group input");
const timerEl = document.getElementById("timer");

// --- Dados do Pedido ---
const carrinho = JSON.parse(localStorage.getItem('drip_carrinho')) || [];
const frete = 12.99;
const descontoPix = 0.05; // 5%
let totalFinalParaPix = 0; 
let checkInterval = null; 

// --- CLASSE PIX ---
class Pix {
    constructor(chave, nome, cidade, txid, valor) {
        this.chave = chave;
        this.nome = nome;
        this.cidade = cidade;
        this.txid = txid;
        this.valor = valor.toFixed(2);
    }
    getValue(id, value) { const size = String(value.length).padStart(2, "0"); return id + size + value; }
    getPayload() {
        let payload = this.getValue("00", "01") + this.getValue("26", this.getValue("00", "br.gov.bcb.pix") + this.getValue("01", this.chave)) + this.getValue("52", "0000") + this.getValue("53", "986") + this.getValue("54", this.valor) + this.getValue("58", "BR") + this.getValue("59", this.nome) + this.getValue("60", this.cidade) + this.getValue("62", this.getValue("05", this.txid)) + "6304";
        return payload + this.getCRC16(payload);
    }
    getCRC16(payload) {
        let crc = 0xFFFF;
        for (let i = 0; i < payload.length; i++) {
            crc ^= payload.charCodeAt(i) << 8;
            for (let j = 0; j < 8; j++) {
                if ((crc & 0x8000) !== 0) crc = (crc << 1) ^ 0x1021;
                else crc = (crc << 1);
            }
        }
        return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, "0");
    }
}

// --- Renderização ---
function renderCheckout() {
    itemsContainer.innerHTML = "";
    let subtotal = 0;
    if (carrinho.length === 0) return;

    carrinho.forEach(item => {
        const totalItem = item.preco * item.quantidade;
        subtotal += totalItem;
        
        const cor = item.corEscolhida || "-";
        const tam = item.tamanhoEscolhido || "-";

        const div = document.createElement("div");
        div.classList.add("summary-item");
        div.innerHTML = `
            <img src="${item.imagem}" class="s-img">
            <div class="s-info">
                <h4>${item.nome}</h4>
                <p>Qtd: ${item.quantidade} <span style="font-size:0.7rem; opacity:0.7">(${cor}/${tam})</span></p>
            </div>
            <div class="s-price">R$ ${totalItem.toFixed(2)}</div>
        `;
        itemsContainer.appendChild(div);
    });

    const valorDesconto = subtotal * descontoPix;
    const totalFinal = subtotal + frete - valorDesconto;
    totalFinalParaPix = totalFinal;

    subtotalEl.innerText = `R$ ${subtotal.toFixed(2)}`;
    discountEl.innerText = `- R$ ${valorDesconto.toFixed(2)}`;
    totalEl.innerText = `R$ ${totalFinal.toFixed(2)}`;
}

// --- Timer Visual ---
let timerInterval;
function startTimer() {
    let duration = 15 * 60; 
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        timerEl.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        if (--duration < 0) { clearInterval(timerInterval); modal.classList.add("hidden"); }
    }, 1000);
}

// --- MONITORAMENTO AUTOMÁTICO ---
function monitorarPix(idTransacao) {
    if (checkInterval) clearInterval(checkInterval);
    checkInterval = setInterval(async () => {
        try {
            const response = await fetch(`http://localhost/tcc/api/status_pix.php?id=${idTransacao}`);
            const data = await response.json();
            if (data.status === 'approved') {
                clearInterval(checkInterval);
                clearInterval(timerInterval);
                document.querySelector(".modal-header h2").innerText = "Pagamento Aprovado! ✅";
                setTimeout(() => finalizarCompra(), 1500);
            }
        } catch (error) { console.error(error); }
    }, 3000);
}

// --- FINALIZAR COMPRA ---
async function finalizarCompra() {
    const nome = document.getElementById("nome").value + " " + document.getElementById("sobrenome").value;
    const email = document.getElementById("email").value;
    const endereco = {
        rua: document.getElementById("endereco").value,
        cidade: document.getElementById("cidade").value,
        estado: document.getElementById("estado").value,
        cep: document.getElementById("cep").value
    };

    const pedidoData = {
        cliente: { nome, email },
        endereco: endereco,
        total: totalFinalParaPix,
        itens: carrinho
    };

    try {
        await fetch("http://localhost/tcc/api/salvar_pedido.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pedidoData)
        });
        
        localStorage.removeItem('drip_carrinho');
        window.location.href = "../rastreamento/index.html"; 
    } catch (err) {
        console.error(err);
        window.location.href = "../rastreamento/index.html"; 
    }
}

// --- Event Listeners ---
btnFinish.addEventListener("click", (e) => {
    e.preventDefault();
    const inputs = document.querySelectorAll("input[required]");
    let valid = true;
    inputs.forEach(input => { if(!input.value) valid = false; });
    if(!valid) { alert("Preencha todos os campos."); return; }

    const ID_TRANSACAO = "LOD" + Math.floor(Math.random() * 100000);
    const pix = new Pix("test@lowkeydrip.com", "Lowkey Drip", "BRASILIA", ID_TRANSACAO, totalFinalParaPix);
    const payload = pix.getPayload();

    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(payload)}`;
    copyInput.value = payload;

    modal.classList.remove("hidden");
    startTimer();
    monitorarPix(ID_TRANSACAO);
});

closeModalBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    clearInterval(timerInterval);
    clearInterval(checkInterval);
});

btnCopy.addEventListener("click", () => {
    copyInput.select();
    navigator.clipboard.writeText(copyInput.value);
    btnCopy.innerText = "Copiado!";
    setTimeout(() => btnCopy.innerText = "Copiar", 2000);
});

btnConfirmPayment.addEventListener("click", () => {
    btnConfirmPayment.innerText = "Verificando...";
    setTimeout(finalizarCompra, 1000);
});

renderCheckout();