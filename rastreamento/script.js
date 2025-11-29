// rastreamento/script.js

const API_URL = "http://localhost/tcc/api";

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        // Usa a notificação global
        if(window.showToast) showToast("Pedido não encontrado.", "error");
        else alert("Pedido não encontrado.");
        
        // Espera um pouco para o usuário ler antes de redirecionar
        setTimeout(() => {
            window.location.href = "../meus_pedidos/index.html";
        }, 2000);
        return;
    }

    buscarStatusPedido(id);
});

async function buscarStatusPedido(id) {
    try {
        const res = await fetch(`${API_URL}/buscar_pedido.php?id=${id}`);
        
        if(!res.ok) throw new Error("Erro ao buscar");
        
        const pedido = await res.json();
        atualizarTela(pedido);

    } catch (err) {
        console.error(err);
        document.getElementById("order-id").innerText = "Erro ao carregar";
        showToast("Erro ao buscar informações do pedido.", "error");
    }
}

function atualizarTela(pedido) {
    document.getElementById("order-id").innerText = `Pedido #${pedido.id}`;
    document.getElementById("text-status").innerText = pedido.status;
    document.getElementById("badge-status").innerText = pedido.status;

    // Lógica da Timeline
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

    if (nivelPasso < nivelAtual) {
        el.classList.add("completed"); 
    } else if (nivelPasso === nivelAtual) {
        el.classList.add("active"); 
    }
}