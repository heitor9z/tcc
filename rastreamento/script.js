// rastreamento/script.js

document.addEventListener("DOMContentLoaded", () => {
    // 1. Gera ou recupera um ID de pedido
    // Tenta pegar da URL (ex: ?id=LOD123) ou gera um aleatório
    const params = new URLSearchParams(window.location.search);
    let orderId = params.get("id");

    if (!orderId) {
        orderId = "LOD" + Math.floor(Math.random() * 90000 + 10000);
    }

    document.getElementById("order-id").innerText = `Pedido #${orderId}`;

    // 2. Simulação de "Live Update" (Opcional)
    // Isso faria o status mudar sozinho depois de um tempo para demonstração
    /*
    setTimeout(() => {
        alert("Atualização: O entregador está próximo!");
    }, 10000);
    */
});