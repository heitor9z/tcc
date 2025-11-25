<?php
// Api/meus_pedidos.php
require_once 'classes/Conexao.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Pega o email da URL (ex: meus_pedidos.php?email=joao@gmail.com)
$email = $_GET['email'] ?? '';

if(empty($email)) {
    echo json_encode([]);
    exit;
}

try {
    $pdo = (new Conexao())->conectar();
    
    // Busca pedidos deste email
    $sql = "SELECT * FROM pedidos WHERE cliente_email = :email ORDER BY id DESC";
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':email', $email);
    $stmt->execute();
    $pedidos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Para cada pedido, busca os itens
    foreach($pedidos as $key => $pedido) {
        $stmtItens = $pdo->prepare("SELECT * FROM itens_pedido WHERE pedido_id = :pid");
        $stmtItens->bindValue(':pid', $pedido['id']);
        $stmtItens->execute();
        $pedidos[$key]['itens'] = $stmtItens->fetchAll(PDO::FETCH_ASSOC);
        
        // Formata endereço
        $pedidos[$key]['endereco_completo'] = json_decode($pedido['endereco_completo']);
    }

    echo json_encode($pedidos);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>