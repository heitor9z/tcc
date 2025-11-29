<?php
// Api/salvar_pedido.php
require_once 'classes/Conexao.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

$data = json_decode(file_get_contents("php://input"));

if(empty($data->itens) || empty($data->cliente)) {
    http_response_code(400);
    echo json_encode(["message" => "Dados inválidos."]);
    exit;
}

try {
    $pdo = (new Conexao())->conectar();
    
    // --- ATUALIZAÇÃO: Inserção com usuario_id ---
    $sqlPedido = "INSERT INTO pedidos (usuario_id, cliente_nome, cliente_email, endereco_completo, total) 
                  VALUES (:uid, :nome, :email, :end, :total)";
                  
    $stmt = $pdo->prepare($sqlPedido);
    
    // Bind do ID (pode ser null)
    $stmt->bindValue(':uid', !empty($data->usuario_id) ? $data->usuario_id : null);
    
    $stmt->bindValue(':nome', $data->cliente->nome);
    $stmt->bindValue(':email', $data->cliente->email);
    $stmt->bindValue(':end', json_encode($data->endereco));
    $stmt->bindValue(':total', $data->total);
    $stmt->execute();
    
    $pedidoId = $pdo->lastInsertId();

    // 2. Salva os Itens
    $sqlItem = "INSERT INTO itens_pedido (pedido_id, produto_nome, quantidade, preco_unitario, imagem_url) VALUES (:pid, :nome, :qtd, :preco, :img)";
    $stmtItem = $pdo->prepare($sqlItem);

    foreach($data->itens as $item) {
        $stmtItem->bindValue(':pid', $pedidoId);
        $stmtItem->bindValue(':nome', $item->nome);
        $stmtItem->bindValue(':qtd', $item->quantidade);
        $stmtItem->bindValue(':preco', $item->preco);
        $stmtItem->bindValue(':img', $item->imagem);
        $stmtItem->execute();
    }

    echo json_encode(["message" => "Pedido salvo!", "pedido_id" => $pedidoId]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>