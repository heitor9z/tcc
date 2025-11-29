<?php
// Api/meus_pedidos.php
require_once 'classes/Conexao.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Recebe email e ID
$email = $_GET['email'] ?? '';
$id = $_GET['id'] ?? 0;

if(empty($email) && empty($id)) {
    echo json_encode([]);
    exit;
}

try {
    $pdo = (new Conexao())->conectar();
    
    // --- ATUALIZAÇÃO: Busca Híbrida ---
    // Busca por usuario_id (novos pedidos vinculados) OU cliente_email (pedidos antigos ou guest)
    $sql = "SELECT * FROM pedidos 
            WHERE usuario_id = :id OR cliente_email = :email 
            ORDER BY id DESC";
            
    $stmt = $pdo->prepare($sql);
    $stmt->bindValue(':id', $id);
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