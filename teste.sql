USE loja_drip;

-- Tabela de Pedidos (Cabeçalho)
CREATE TABLE IF NOT EXISTS pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_nome VARCHAR(255),
    cliente_email VARCHAR(255),
    endereco_completo JSON,  -- Vamos salvar o endereço todo aqui
    total DECIMAL(10, 2),
    metodo_pagamento VARCHAR(50) DEFAULT 'PIX',
    status VARCHAR(50) DEFAULT 'Pago',
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Itens do Pedido (O que foi comprado)
CREATE TABLE IF NOT EXISTS itens_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT,
    produto_nome VARCHAR(255),
    quantidade INT,
    preco_unitario DECIMAL(10, 2),
    imagem_url VARCHAR(255),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
);