<?php
require_once 'classes/Conexao.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

try {
    $pdo = (new Conexao())->conectar();
    
    // Buscar Produtos
    $stmtProd = $pdo->query("SELECT * FROM produtos ORDER BY id DESC");
    $produtos = $stmtProd->fetchAll(PDO::FETCH_ASSOC);

    // Buscar Pedidos
    $stmtPed = $pdo->query("SELECT * FROM pedidos ORDER BY id DESC");
    $pedidos = $stmtPed->fetchAll(PDO::FETCH_ASSOC);

    // Buscar Itens de cada pedido
    foreach($pedidos as $key => $pedido) {
        $stmtItens = $pdo->prepare("SELECT * FROM itens_pedido WHERE pedido_id = :pid");
        $stmtItens->bindValue(':pid', $pedido['id']);
        $stmtItens->execute();
        $pedidos[$key]['itens'] = $stmtItens->fetchAll(PDO::FETCH_ASSOC);
        
        // Decodificar JSON do endereço
        $pedidos[$key]['endereco_completo'] = json_decode($pedido['endereco_completo']);
    }

    echo json_encode([
        "produtos" => $produtos,
        "pedidos" => $pedidos
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>