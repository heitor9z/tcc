<?php
// Api/google_login.php
require_once 'classes/Conexao.php';
require_once 'classes/UsuarioDAO.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

$data = json_decode(file_get_contents("php://input"));

// O frontend agora envia apenas o "credential" (Token JWT do Google)
if(empty($data->credential)) {
    http_response_code(400);
    echo json_encode(["message" => "Token do Google não fornecido."]);
    exit;
}

try {
    // 1. VALIDAR O TOKEN COM O GOOGLE
    // Esta URL verifica a validade do token JWT
    $url = "https://oauth2.googleapis.com/tokeninfo?id_token=" . $data->credential;
    
    // Faz a requisição ao Google (Requer allow_url_fopen = On no php.ini)
    $response = file_get_contents($url);
    
    if ($response === FALSE) {
        throw new Exception("Falha ao conectar com o Google.");
    }

    $googlePayload = json_decode($response);

    // Se o token for inválido ou expirado, o Google retorna erro
    if (isset($googlePayload->error)) {
        http_response_code(401);
        echo json_encode(["message" => "Token inválido."]);
        exit;
    }

    // DADOS REAIS DO GOOGLE
    $googleId = $googlePayload->sub; // ID único do usuário no Google
    $email = $googlePayload->email;
    $name = $googlePayload->name;

    // --- DAQUI PRA BAIXO É A LÓGICA DE BANCO IGUAL ANTES ---
    
    $pdo = (new Conexao())->conectar();
    
    // Verifica se usuário já existe pelo google_id
    $sqlCheck = "SELECT * FROM usuarios WHERE google_id = :gid";
    $stmtCheck = $pdo->prepare($sqlCheck);
    $stmtCheck->bindValue(':gid', $googleId);
    $stmtCheck->execute();
    
    $user = $stmtCheck->fetch(PDO::FETCH_ASSOC);

    // Se não existe, CRIA ou VINCULA
    if (!$user) {
        // Verifica se email já existe
        $sqlEmail = "SELECT id FROM usuarios WHERE email = :email";
        $stmtEmail = $pdo->prepare($sqlEmail);
        $stmtEmail->bindValue(':email', $email);
        $stmtEmail->execute();
        
        if($stmtEmail->rowCount() > 0) {
            // Vincula conta existente
            $sqlUpdate = "UPDATE usuarios SET google_id = :gid WHERE email = :email";
            $stmtUpdate = $pdo->prepare($sqlUpdate);
            $stmtUpdate->bindValue(':gid', $googleId);
            $stmtUpdate->bindValue(':email', $email);
            $stmtUpdate->execute();
        } else {
            // Cria nova conta
            $randomPass = password_hash(bin2hex(random_bytes(10)), PASSWORD_DEFAULT);
            $sqlInsert = "INSERT INTO usuarios (displayName, email, password, google_id) VALUES (:name, :email, :pass, :gid)";
            $stmtInsert = $pdo->prepare($sqlInsert);
            $stmtInsert->bindValue(':name', $name);
            $stmtInsert->bindValue(':email', $email);
            $stmtInsert->bindValue(':pass', $randomPass);
            $stmtInsert->bindValue(':gid', $googleId);
            $stmtInsert->execute();
        }
        
        $stmtCheck->execute();
        $user = $stmtCheck->fetch(PDO::FETCH_ASSOC);
    }

    // Login Sucesso
    echo json_encode([
        "message" => "Login Google realizado!",
        "user_id" => $user['id'],
        "user_name" => $user['displayName'],
        "is_admin" => $user['is_admin']
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Erro no servidor.", "error" => $e->getMessage()]);
}
?>