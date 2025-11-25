<?php
// Api/criar_produto.php
require_once 'classes/Conexao.php';
require_once 'classes/ProdutoDAO.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

// Recebe o JSON do frontend
$data = json_decode(file_get_contents("php://input"));

// Validação básica
if(empty($data->nome) || empty($data->preco) || empty($data->imagem)) {
    http_response_code(400);
    echo json_encode(["message" => "Dados incompletos."]);
    exit;
}

try {
    $pdo = (new Conexao())->conectar();
    $produtoDAO = new ProdutoDAO($pdo);
    
    // Converte string de cores/tamanhos em array se necessário, 
    // mas o frontend já vai mandar array.
    
    $produtoDAO->inserir(
        $data->nome,
        $data->categoria,
        $data->preco,
        $data->imagem,
        $data->cores,    // Array vindo do JS
        $data->tamanhos  // Array vindo do JS
    );

    http_response_code(201);
    echo json_encode(["message" => "Produto criado com sucesso!"]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Erro ao criar produto.", "error" => $e->getMessage()]);
}
?>