<?php
// Inclui autoload do Composer (para JWT) e as classes
require_once 'vendor/autoload.php';
require_once 'classes/Conexao.php';
require_once 'classes/UsuarioDAO.php';

use Firebase\JWT\JWT;

// Configura cabeçalhos para API JSON e CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Chave secreta (do .env original)
$JWT_SECRET = 'sixfinalboss123';

$data = json_decode(file_get_contents("php://input"));

if (empty($data->email) || empty($data->password)) {
    http_response_code(400);
    echo json_encode(["message" => "Email e senha são obrigatórios."]);
    exit;
}

try {
    // 1. Conectar ao banco
    $pdo = (new Conexao())->conectar();
    
    // 2. Usar o DAO para buscar o usuário
    $usuarioDAO = new UsuarioDAO($pdo);
    $user = $usuarioDAO->buscarPorEmail($data->email);

    // 3. Validar a senha (igual ao server.js e aos exemplos PHP anteriores)
if (!$user) {
        http_response_code(401); // Não autorizado
        echo json_encode(["message" => "Email ou senha inválidos."]);
        exit;
    }

    // Etapa 2: Se o usuário existe, a senha está correta?
if (!password_verify($data->password, $user['password'])) {
        http_response_code(401); // Não autorizado
        echo json_encode(["message" => "Email ou senha inválidos."]);
        exit;
    }

    // 4. Gerar o Token (JWT)
    $payload = [
        'iat' => time(),
        'exp' => time() + (60 * 60), // 1 hora
        'id' => $user['id'],
        'email' => $user['email']
    ];
    $token = JWT::encode($payload, $JWT_SECRET, 'HS256');

    http_response_code(200);
    echo json_encode([
        "message" => "Login bem-sucedido!",
        "token" => $token
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Erro interno do servidor.", "error" => $e->getMessage()]);
}
?>