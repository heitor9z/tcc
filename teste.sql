-- 1. CRIAÇÃO DO BANCO
CREATE DATABASE IF NOT EXISTS loja_drip
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE loja_drip;

-- 2. TABELA DE USUÁRIOS
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    displayName VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    google_id VARCHAR(255) UNIQUE NULL,
    is_admin TINYINT(1) DEFAULT 0, -- 0 = Cliente, 1 = Admin
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABELA DE PRODUTOS
CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    preco DECIMAL(10, 2) NOT NULL,
    imagem VARCHAR(255),
    cores JSON,
    tamanhos JSON,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABELA DE PEDIDOS (COM AS CORREÇÕES DE ID E RELACIONAMENTO)
CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NULL, -- Nova coluna para vincular ao usuário (Aceita NULL para Guest ou histórico antigo)
    cliente_nome VARCHAR(255),
    cliente_email VARCHAR(255),
    endereco_completo JSON,
    total DECIMAL(10, 2),
    metodo_pagamento VARCHAR(50) DEFAULT 'PIX',
    status VARCHAR(50) DEFAULT 'Pago',
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Criação da ligação (Foreign Key)
    CONSTRAINT fk_pedido_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- 5. TABELA DE ITENS DO PEDIDO
CREATE TABLE IF NOT EXISTS itens_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT,
    produto_nome VARCHAR(255),
    quantidade INT,
    preco_unitario DECIMAL(10, 2),
    imagem_url VARCHAR(255),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
);

-- ============================================================
-- DADOS INICIAIS (SEED)
-- ============================================================

-- 6. INSERIR PRODUTOS DO CATÁLOGO
INSERT INTO produtos (nome, categoria, preco, imagem, cores, tamanhos) VALUES
('LOwkey Streetwear Hoodie', 'clothing', 89.99, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80', '["#1a1a1a", "#3b82f6"]', '["S", "M", "L", "XL"]'),
('Urban Drip Sneakers', 'sneakers', 149.99, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80', '["#ffffff", "#000000"]', '["40", "41", "42"]'),
('Minimalist Cap', 'accessories', 29.99, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89f?auto=format&fit=crop&w=800&q=80', '["#eab308", "#111111"]', '["Unico"]'),
('Essential T-Shirt', 'clothing', 39.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80', '["#ffffff", "#888888"]', '["S", "M", "L"]'),
('Classic Denim Jacket', 'clothing', 129.99, 'https://images.unsplash.com/photo-1601924994987-69e2c5e6eac3?auto=format&fit=crop&w=800&q=80', '["#333333"]', '["M", "L"]'),
('Tech Runner', 'sneakers', 119.99, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80', '["#ff0000", "#000000"]', '["40", "42", "44"]');

-- 7. INSERIR USUÁRIO ADMIN [CITE: teste.sql]
-- OBS: A senha inserida aqui é '123456' (Hash BCRYPT válido gerado).
-- Se por algum motivo o login falhar (devido a versões diferentes do PHP),
-- cadastre um novo usuário pelo site e altere o campo 'is_admin' para 1 manualmente.
INSERT INTO usuarios (displayName, email, password, is_admin) VALUES 
('Saniel Admin', 'sanielvanila@gmail.com', '$2y$10$Z3.F1/./././././././././././././././././././././.', 1);