<?php
// Api/status_pix.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$id = $_GET['id'] ?? '0';

// Inicia sessão para guardar o tempo deste "pedido" específico
session_start();
$sessionKey = 'pix_start_' . $id;

if (!isset($_SESSION[$sessionKey])) {
    // Se é a primeira vez que pergunta, marca o horário de agora
    $_SESSION[$sessionKey] = time();
    echo json_encode(["status" => "pending", "message" => "Aguardando pagamento..."]);
} else {
    // Se já perguntou antes, vê quanto tempo passou
    $tempoPassado = time() - $_SESSION[$sessionKey];

    // SIMULAÇÃO: Aprova automaticamente após 10 segundos
    if ($tempoPassado > 10) {
        echo json_encode(["status" => "approved", "message" => "Pagamento confirmado!"]);
        // Limpa a sessão para não bugar testes futuros
        unset($_SESSION[$sessionKey]);
    } else {
        echo json_encode(["status" => "pending", "message" => "Aguardando... (" . (10 - $tempoPassado) . "s)"]);
    }
}
?>