CREATE DATABASE IF NOT EXISTS loja_drip
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE loja_drip;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    displayName VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    google_id VARCHAR(255) UNIQUE NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/*
  NOVA TABELA DE PRODUTOS
  (Baseada no seu catalogo/produto.js)
*/
CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    preco DECIMAL(10, 2) NOT NULL,
    imagem VARCHAR(255),
    /* Usamos JSON para armazenar as arrays de cores e tamanhos.
      É mais simples para o TCC do que criar tabelas de junção.
    */
    cores JSON,
    tamanhos JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);