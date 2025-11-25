<?php
class Conexao {
    /**
     * @return PDO 
     */
    public function conectar() {
        // Dados do seu projeto tcc (do .env original)
        $host = 'localhost'; 
        $dbname = 'loja_drip'; // <-- CORRIGIDO
        $user = 'root';
        $pass = ''; 
        $dsn = "mysql:host={$host};dbname={$dbname};charset=utf8mb4";

        try {
            $pdo = new PDO($dsn, $user, $pass);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            // Define o modo de fetch padrão para array associativo
            $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            return $pdo;

        } catch (PDOException $e) {
            die("Erro na conexão com o banco de dados: " . $e->getMessage());
        }
    }
}
?>