<?php
require_once 'Produto.php';

class ProdutoDAO {
    private $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }

    /**
     * Busca todos os produtos do catálogo.
     * @return array
     */
    public function buscarTodos() {
        $sql = "SELECT * FROM produtos ORDER BY nome";
        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll(); // Retorna como array associativo
    }
}
?>