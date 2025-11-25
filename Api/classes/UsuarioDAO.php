<?php
require_once 'Usuario.php';

class UsuarioDAO {
    private $pdo;

    /**
     * @param PDO $pdo Uma conexão PDO ativa
     */
    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }

    /**
     * Busca um usuário pelo email.
     * @param string $email
     * @return array|false
     */
    public function buscarPorEmail($email) {
        $sql = "SELECT * FROM usuarios WHERE email = :email";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':email', $email);
        $stmt->execute();
        return $stmt->fetch(); // Retorna como array associativo (definido na Conexao.php)
    }
    
    /**
     * Conta o total de usuários registrados.
     * @return int
     */
    public function contarUsuarios() {
        $sql = "SELECT COUNT(*) FROM usuarios";
        $stmt = $this->pdo->query($sql);
        return (int)$stmt->fetchColumn(); // Retorna apenas a contagem
    }
}
?>