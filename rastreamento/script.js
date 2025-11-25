const API_URL = "http://localhost/tcc/api";

document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        alert("Pedido não encontrado.");
        window.location.href = "../meus_pedidos/index.html";
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
    }
}

function atualizarTela(pedido) {
    document.getElementById("order-id").innerText = `Pedido #${pedido.id}`;
    document.getElementById("text-status").innerText = pedido.status;
    document.getElementById("badge-status").innerText = pedido.status;

    // Lógica da Timeline
    // Mapeia os status para níveis (1 a 4)
    const niveis = {
        "Pago": 1,
        "Preparando": 2,
        "A Caminho": 3,
        "Entregue": 4
    };

    const nivelAtual = niveis[pedido.status] || 1;

    // Atualiza as classes CSS
    atualizarPasso("step-Pago", 1, nivelAtual);
    atualizarPasso("step-Preparando", 2, nivelAtual);
    atualizarPasso("step-Caminho", 3, nivelAtual); // "A Caminho" no banco, ID simplificado no HTML
    atualizarPasso("step-Entregue", 4, nivelAtual);
}

function atualizarPasso(elementId, nivelPasso, nivelAtual) {
    const el = document.getElementById(elementId);
    if(!el) return; // Proteção caso ID não bata

    // Remove classes antigas
    el.classList.remove("completed", "active");

    if (nivelPasso < nivelAtual) {
        el.classList.add("completed"); // Já passou
    } else if (nivelPasso === nivelAtual) {
        el.classList.add("active"); // Está aqui agora
    }
    // Se for maior, fica sem classe (cinza/pendente)
}