<?php
require_once 'classes/Conexao.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$id = $_GET['id'] ?? '';

if(empty($id)) {
    http_response_code(400);
    echo json_encode(["message" => "ID necessário."]);
    exit;
}

try {
    $pdo = (new Conexao())->conectar();
    
    $stmt = $pdo->prepare("SELECT * FROM pedidos WHERE id = :id");
    $stmt->bindValue(':id', $id);
    $stmt->execute();
    $pedido = $stmt->fetch(PDO::FETCH_ASSOC);

    if($pedido) {
        echo json_encode($pedido);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Pedido não encontrado."]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>