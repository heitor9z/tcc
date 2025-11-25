<?php
require_once 'classes/Conexao.php';
require_once 'classes/UsuarioDAO.php'; // Vamos precisar adicionar um método aqui

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

$data = json_decode(file_get_contents("php://input"));

if(empty($data->name) || empty($data->email) || empty($data->password)) {
    http_response_code(400);
    echo json_encode(["message" => "Preencha todos os campos."]);
    exit;
}

try {
    $pdo = (new Conexao())->conectar();
    
    // Verificar se email já existe
    $sqlCheck = "SELECT id FROM usuarios WHERE email = :email";
    $stmtCheck = $pdo->prepare($sqlCheck);
    $stmtCheck->bindValue(":email", $data->email);
    $stmtCheck->execute();
    
    if($stmtCheck->rowCount() > 0) {
        http_response_code(409); // Conflict
        echo json_encode(["message" => "Este email já está cadastrado."]);
        exit;
    }

    // Inserir novo usuário
    // IMPORTANTE: Usar password_hash para segurança!
    $hash = password_hash($data->password, PASSWORD_DEFAULT);
    
    $sqlInsert = "INSERT INTO usuarios (displayName, email, password) VALUES (:name, :email, :pass)";
    $stmtInsert = $pdo->prepare($sqlInsert);
    $stmtInsert->bindValue(":name", $data->name);
    $stmtInsert->bindValue(":email", $data->email);
    $stmtInsert->bindValue(":pass", $hash);
    
    if($stmtInsert->execute()) {
        http_response_code(201);
        echo json_encode(["message" => "Usuário criado com sucesso!"]);
    } else {
        throw new Exception("Erro ao inserir no banco.");
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Erro interno.", "error" => $e->getMessage()]);
}
?>