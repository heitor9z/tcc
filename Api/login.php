<?php
// Api/login.php
require_once 'classes/Conexao.php';
require_once 'classes/UsuarioDAO.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$data = json_decode(file_get_contents("php://input"));

if (empty($data->email) || empty($data->password)) {
    http_response_code(400);
    echo json_encode(["message" => "Email e senha são obrigatórios."]);
    exit;
}

try {
    $pdo = (new Conexao())->conectar();
    $usuarioDAO = new UsuarioDAO($pdo);
    $user = $usuarioDAO->buscarPorEmail($data->email);

    if (!$user) {
        http_response_code(401);
        echo json_encode(["message" => "Email incorreto."]);
        exit;
    }

    if (!password_verify($data->password, $user['password'])) {
        http_response_code(401);
        echo json_encode(["message" => "Senha incorreta."]);
        exit;
    }

    // Login Sucesso! Retornamos apenas os dados necessários para a sessão no front
    http_response_code(200);
    echo json_encode([
        "message" => "Login realizado com sucesso!",
        "user_id" => $user['id'],
        "user_name" => $user['displayName'],
        "is_admin" => $user['is_admin'] // Dica: Útil se quiser validar admin no front
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Erro interno no servidor.", "error" => $e->getMessage()]);
}
?>