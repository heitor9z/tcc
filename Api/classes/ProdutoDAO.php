<?php
require_once 'Produto.php';

class ProdutoDAO {
    private $pdo;

    public function __construct(PDO $pdo) {
        $this->pdo = $pdo;
    }

    public function buscarTodos() {
        $sql = "SELECT * FROM produtos ORDER BY id DESC";
        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll();
    }

    public function inserir($nome, $categoria, $preco, $imagem, $cores, $tamanhos) {
        $sql = "INSERT INTO produtos (nome, categoria, preco, imagem, cores, tamanhos) 
                VALUES (:nome, :categoria, :preco, :imagem, :cores, :tamanhos)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':nome', $nome);
        $stmt->bindValue(':categoria', $categoria);
        $stmt->bindValue(':preco', $preco);
        $stmt->bindValue(':imagem', $imagem);
        $stmt->bindValue(':cores', json_encode($cores)); 
        $stmt->bindValue(':tamanhos', json_encode($tamanhos));
        return $stmt->execute();
    }

    // --- NOVOS MÉTODOS ---

    public function atualizar($id, $nome, $categoria, $preco, $imagem, $cores, $tamanhos) {
        $sql = "UPDATE produtos SET nome = :nome, categoria = :categoria, preco = :preco, 
                imagem = :imagem, cores = :cores, tamanhos = :tamanhos WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':nome', $nome);
        $stmt->bindValue(':categoria', $categoria);
        $stmt->bindValue(':preco', $preco);
        $stmt->bindValue(':imagem', $imagem);
        $stmt->bindValue(':cores', json_encode($cores));
        $stmt->bindValue(':tamanhos', json_encode($tamanhos));
        $stmt->bindValue(':id', $id);
        return $stmt->execute();
    }

    public function excluir($id) {
        $sql = "DELETE FROM produtos WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':id', $id);
        return $stmt->execute();
    }
}
?>