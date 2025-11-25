<?php
require_once 'classes/Conexao.php';
require_once 'classes/ProdutoDAO.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

$data = json_decode(file_get_contents("php://input"));

if(empty($data->id)) {
    http_response_code(400);
    echo json_encode(["message" => "ID obrigatório."]);
    exit;
}

try {
    $pdo = (new Conexao())->conectar();
    $produtoDAO = new ProdutoDAO($pdo);
    
    $produtoDAO->excluir($data->id);

    echo json_encode(["message" => "Produto excluído!"]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Erro ao excluir.", "error" => $e->getMessage()]);
}
?>