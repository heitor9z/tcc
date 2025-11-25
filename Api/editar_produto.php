<?php
require_once 'classes/Conexao.php';
require_once 'classes/ProdutoDAO.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

$data = json_decode(file_get_contents("php://input"));

if(empty($data->id) || empty($data->nome)) {
    http_response_code(400);
    echo json_encode(["message" => "ID e Nome são obrigatórios."]);
    exit;
}

try {
    $pdo = (new Conexao())->conectar();
    $produtoDAO = new ProdutoDAO($pdo);
    
    $produtoDAO->atualizar(
        $data->id,
        $data->nome,
        $data->categoria,
        $data->preco,
        $data->imagem,
        $data->cores,
        $data->tamanhos
    );

    echo json_encode(["message" => "Produto atualizado com sucesso!"]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Erro ao atualizar.", "error" => $e->getMessage()]);
}
?>