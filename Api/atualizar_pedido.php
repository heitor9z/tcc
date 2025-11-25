<?php
require_once 'classes/Conexao.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

$data = json_decode(file_get_contents("php://input"));

if(empty($data->id) || empty($data->status)) {
    http_response_code(400);
    echo json_encode(["message" => "ID e Status são obrigatórios."]);
    exit;
}

try {
    $pdo = (new Conexao())->conectar();
    
    $sql = "UPDATE pedidos SET status = :status WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':status', $data->status);
    $stmt->bindValue(':id', $data->id);
    $stmt->execute();

    echo json_encode(["message" => "Status atualizado com sucesso!"]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>