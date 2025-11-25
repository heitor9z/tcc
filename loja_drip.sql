-- 1. Criação do Banco de Dados
CREATE DATABASE IF NOT EXISTS loja_drip
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE loja_drip;

-- 2. Tabela de Usuários (Com suporte a Admin)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    displayName VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    google_id VARCHAR(255) UNIQUE NULL,
    is_admin TINYINT(1) DEFAULT 0, -- 0 = Comum, 1 = Admin
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Produtos (Suporte a Arrays JSON para cores/tamanhos)
CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    preco DECIMAL(10, 2) NOT NULL,
    imagem VARCHAR(255),
    cores JSON,     -- Ex: ["#000", "#fff"]
    tamanhos JSON,  -- Ex: ["M", "L", "XL"]
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabela de Pedidos (Para o Admin ver as vendas)
CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_nome VARCHAR(255),
    cliente_email VARCHAR(255),
    endereco_completo JSON, -- Guarda Rua, Cidade, CEP tudo junto
    total DECIMAL(10, 2),
    metodo_pagamento VARCHAR(50) DEFAULT 'PIX',
    status VARCHAR(50) DEFAULT 'Pago', -- Como é Pix simulado, já nasce pago
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabela de Itens do Pedido (O que tinha dentro de cada pedido)
CREATE TABLE IF NOT EXISTS itens_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT,
    produto_nome VARCHAR(255),
    quantidade INT,
    preco_unitario DECIMAL(10, 2),
    imagem_url VARCHAR(255),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
);

-- 6. Inserção dos Produtos Iniciais (Seu Catálogo Base)
INSERT INTO produtos (nome, categoria, preco, imagem, cores, tamanhos) VALUES
('LOwkey Streetwear Hoodie', 'clothing', 89.99, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80', '["#1a1a1a", "#3b82f6"]', '["S", "M", "L", "XL"]'),
('Urban Drip Sneakers', 'sneakers', 149.99, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80', '["#ffffff", "#000000"]', '["40", "41", "42"]'),
('Minimalist Cap', 'accessories', 29.99, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89f?auto=format&fit=crop&w=800&q=80', '["#eab308", "#111111"]', '["Unico"]'),
('Essential T-Shirt', 'clothing', 39.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80', '["#ffffff", "#888888"]', '["S", "M", "L"]'),
('Classic Denim Jacket', 'clothing', 129.99, 'https://images.unsplash.com/photo-1601924994987-69e2c5e6eac3?auto=format&fit=crop&w=800&q=80', '["#333333"]', '["M", "L"]'),
('Tech Runner', 'sneakers', 119.99, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80', '["#ff0000", "#000000"]', '["40", "42", "44"]');

-- 7. Configuração de Admin (Opcional - Rode isso após criar sua conta)
-- UPDATE usuarios SET is_admin = 1 WHERE email = 'seu@email.com';