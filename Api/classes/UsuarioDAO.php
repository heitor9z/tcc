<?php
// Api/classes/UsuarioDAO.php

class UsuarioDAO {
    private $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }

    public function buscarPorEmail($email) {
        $sql = "SELECT * FROM usuarios WHERE email = :email";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':email', $email);
        $stmt->execute();
        return $stmt->fetch(); // Retorna array, não precisa da classe Usuario
    }
    
    public function contarUsuarios() {
        $sql = "SELECT COUNT(*) FROM usuarios";
        $stmt = $this->pdo->query($sql);
        return (int)$stmt->fetchColumn();
    }
}
?>