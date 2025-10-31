// 1. Importar Módulos
require("dotenv").config(); // Carrega variáveis do .env
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 2. Configurações Iniciais
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

// 3. Middlewares
app.use(cors()); // Permite que o frontend acesse o backend
app.use(express.json()); // Habilita o parsing de JSON

// Habilita o Express a servir os arquivos estáticos (HTML, CSS, JS)
app.use(express.static(__dirname));

// 4. Conexão com MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 5. Rotas da API (Focadas no Login)

/**
 * ROTA: Fazer login
 * POST /api/login
 */
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email e senha são obrigatórios." });
    }

    try {
        // 1. Buscar o usuário pelo email
        const sql = "SELECT * FROM usuarios WHERE email = ?";
        const [rows] = await pool.query(sql, [email]);

        if (rows.length === 0) {
            // Usuário não encontrado
            return res.status(401).json({ message: "Email ou senha inválidos." });
        }

        const user = rows[0];

        // 2. Comparar a senha enviada com a senha criptografada no banco
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            // Senha incorreta
            return res.status(401).json({ message: "Email ou senha inválidos." });
        }

        // 3. Gerar um Token (JWT) para autenticação
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: "1h" 
        });

        res.json({ message: "Login bem-sucedido!", token: token });

    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
});

/**
 * ROTA: Obter contagem de usuários
 * GET /api/user-count
 * (Usada no rodapé da página de login)
 */
app.get("/api/user-count", async (req, res) => {
    try {
        const sql = "SELECT COUNT(*) as total FROM usuarios";
        const [rows] = await pool.query(sql);
        
        const count = rows[0].total;
        res.json({ count: count });

    } catch (error) {
        console.error("Erro ao buscar contagem:", error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
});

/*
  ======================================================
   NOVA ROTA - (Vinda do catalogo/server.js)
  ======================================================
*/
/**
 * ROTA: Buscar todos os produtos
 * GET /api/produtos
 * (Usada na página de catálogo)
 */
app.get("/api/produtos", async (req, res) => {
    try {
        // 1. Buscar todos os produtos da nova tabela 'produtos'
        const sql = "SELECT * FROM produtos";
        const [produtos] = await pool.query(sql);
        
        // 2. Enviar os produtos como JSON
        res.json(produtos);

    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
});
/*
  ======================================================
   FIM DA NOVA ROTA
  ======================================================
*/


// Rota para Registro (para depois)
app.post("/api/register", async (req, res) => {
    // ... (Aqui virá o código da página de registro quando você for mexer nela)
    // Por enquanto, podemos deixar um placeholder:
     res.status(501).json({ message: "Rota de registro ainda não implementada." });
});


// 6. Iniciar o Servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Frontend disponível em http://localhost:${PORT}/login/index.html`);
});