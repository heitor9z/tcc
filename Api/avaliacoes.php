<?php
// Api/avaliacoes.php
require_once 'classes/Conexao.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$method = $_SERVER['REQUEST_METHOD'];
$pdo = (new Conexao())->conectar();

// GET: Buscar estatísticas e lista de comentários (Não muda nada aqui)
if ($method === 'GET') {
    $produto_id = $_GET['produto_id'] ?? 0;
    
    $sqlMedia = "SELECT COUNT(*) as total, AVG(nota) as media FROM avaliacoes WHERE produto_id = :pid";
    $stmtMedia = $pdo->prepare($sqlMedia);
    $stmtMedia->bindValue(':pid', $produto_id);
    $stmtMedia->execute();
    $stats = $stmtMedia->fetch(PDO::FETCH_ASSOC);
    
    $sqlLista = "SELECT a.nota, a.comentario, a.data_avaliacao, u.displayName as nome 
                 FROM avaliacoes a 
                 JOIN usuarios u ON a.usuario_id = u.id 
                 WHERE a.produto_id = :pid 
                 ORDER BY a.data_avaliacao DESC";
    $stmtLista = $pdo->prepare($sqlLista);
    $stmtLista->bindValue(':pid', $produto_id);
    $stmtLista->execute();
    $comentarios = $stmtLista->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "media" => $stats['media'] ? number_format($stats['media'], 1) : "0.0",
        "total" => $stats['total'],
        "comentarios" => $comentarios
    ]);
    exit;
}

// POST: Salvar avaliação (AQUI ESTÁ A MUDANÇA)
if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if(empty($data->produto_id) || empty($data->usuario_id) || empty($data->nota)) {
        http_response_code(400);
        echo json_encode(["message" => "Dados incompletos."]);
        exit;
    }

    try {
        // 1. Descobrir o NOME do produto pelo ID (pois itens_pedido salva o nome)
        $stmtProd = $pdo->prepare("SELECT nome FROM produtos WHERE id = :pid");
        $stmtProd->bindValue(':pid', $data->produto_id);
        $stmtProd->execute();
        $produto = $stmtProd->fetch(PDO::FETCH_ASSOC);

        if (!$produto) {
            http_response_code(404);
            echo json_encode(["message" => "Produto não encontrado."]);
            exit;
        }

        // 2. VERIFICAÇÃO DE COMPRA REAL
        // Busca se existe algum pedido deste usuário contendo este produto
        $sqlCompra = "
            SELECT p.id 
            FROM pedidos p
            JOIN itens_pedido i ON i.pedido_id = p.id
            WHERE p.usuario_id = :uid 
            AND i.produto_nome = :pnome
            LIMIT 1
        ";
        $stmtCompra = $pdo->prepare($sqlCompra);
        $stmtCompra->bindValue(':uid', $data->usuario_id);
        $stmtCompra->bindValue(':pnome', $produto['nome']);
        $stmtCompra->execute();

        if ($stmtCompra->rowCount() === 0) {
            // Se não achou pedido, BLOQUEIA
            http_response_code(403); // Forbidden
            echo json_encode(["message" => "Você precisa comprar este produto antes de avaliar."]);
            exit;
        }

        // 3. Verifica se já avaliou (para atualizar ou inserir)
        // Isso garante que ele avalie 'uma vez' (uma nota ativa por produto)
        $check = $pdo->prepare("SELECT id FROM avaliacoes WHERE produto_id = :pid AND usuario_id = :uid");
        $check->bindValue(':pid', $data->produto_id);
        $check->bindValue(':uid', $data->usuario_id);
        $check->execute();

        if($check->rowCount() > 0) {
            // Atualiza nota existente
            $sql = "UPDATE avaliacoes SET nota = :nota, comentario = :com, data_avaliacao = NOW() WHERE produto_id = :pid AND usuario_id = :uid";
        } else {
            // Insere nova
            $sql = "INSERT INTO avaliacoes (produto_id, usuario_id, nota, comentario) VALUES (:pid, :uid, :nota, :com)";
        }

        $stmt = $pdo->prepare($sql);
        $stmt->bindValue(':pid', $data->produto_id);
        $stmt->bindValue(':uid', $data->usuario_id);
        $stmt->bindValue(':nota', $data->nota);
        $stmt->bindValue(':com', $data->comentario ?? '');
        $stmt->execute();

        echo json_encode(["message" => "Avaliação enviada com sucesso!"]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>