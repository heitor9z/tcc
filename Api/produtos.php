<?php
require_once 'classes/Conexao.php';
require_once 'classes/ProdutoDAO.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

try {
    $pdo = (new Conexao())->conectar();
    $produtoDAO = new ProdutoDAO($pdo);
    
    $produtos = $produtoDAO->buscarTodos();
    
    // IMPORTANTE: O seu frontend espera 'cores' e 'tamanhos' como Arrays.
    // O banco guarda como string JSON. Vamos converter (como o server.js fazia).
    foreach ($produtos as $key => $produto) {
        $produtos[$key]['cores'] = !empty($produto['cores']) ? json_decode($produto['cores']) : [];
        $produtos[$key]['tamanhos'] = !empty($produto['tamanhos']) ? json_decode($produto['tamanhos']) : [];
    }
    
    echo json_encode($produtos);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Erro ao buscar produtos.", "error" => $e->getMessage()]);
}
?>