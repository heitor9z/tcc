<?php
require_once 'classes/Conexao.php';
require_once 'classes/UsuarioDAO.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

try {
    $pdo = (new Conexao())->conectar();
    $usuarioDAO = new UsuarioDAO($pdo);
    
    $count = $usuarioDAO->contarUsuarios();
    
    echo json_encode(["count" => $count]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Erro ao buscar contagem.", "error" => $e->getMessage()]);
}
?>