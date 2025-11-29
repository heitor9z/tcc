const API_URL = "http://localhost/tcc/api";

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        // Se não tem ID, esconde o status e mostra a busca
        document.getElementById("order-status-state").classList.add("hidden");
        document.getElementById("search-order-state").classList.remove("hidden");
    } else {
        // Se tem ID, busca
        buscarStatusPedido(id);
    }
});

function buscarManual() {
    const id = document.getElementById("input-order-id").value;
    if(!id) return;
    window.location.href = `index.html?id=${id}`;
}

async function buscarStatusPedido(id) {
    try {
        const res = await fetch(`${API_URL}/buscar_pedido.php?id=${id}`);
        
        if(!res.ok) {
            // Se der erro 404, volta pra busca e avisa
            if(window.showToast) showToast("Pedido não encontrado.", "error");
            setTimeout(() => { window.location.href = "index.html"; }, 2000);
            return;
        }
        
        const pedido = await res.json();
        atualizarTela(pedido);

    } catch (err) {
        console.error(err);
        document.getElementById("order-id").innerText = "Erro ao carregar";
    }
}

function atualizarTela(pedido) {
    document.getElementById("order-id").innerText = `Pedido #${pedido.id}`;
    document.getElementById("text-status").innerText = pedido.status;
    document.getElementById("badge-status").innerText = pedido.status;

    const niveis = { "Pago": 1, "Preparando": 2, "A Caminho": 3, "Entregue": 4 };
    const nivelAtual = niveis[pedido.status] || 1;

    atualizarPasso("step-Pago", 1, nivelAtual);
    atualizarPasso("step-Preparando", 2, nivelAtual);
    atualizarPasso("step-Caminho", 3, nivelAtual);
    atualizarPasso("step-Entregue", 4, nivelAtual);
}

function atualizarPasso(elementId, nivelPasso, nivelAtual) {
    const el = document.getElementById(elementId);
    if(!el) return;
    el.classList.remove("completed", "active");
    if (nivelPasso < nivelAtual) el.classList.add("completed"); 
    else if (nivelPasso === nivelAtual) el.classList.add("active"); 
}