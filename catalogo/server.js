const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Produto = require("./models/Produto");

const app = express();
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect("mongodb://localhost:27017/loja", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Conectado ao MongoDB"))
.catch(err => console.error("Erro ao conectar:", err));

// Rota para buscar todos os produtos
app.get("/produtos", async (req, res) => {
  try {
    const produtos = await Produto.find();
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para adicionar produto (opcional, útil para testes)
app.post("/produtos", async (req, res) => {
  try {
    const produto = new Produto(req.body);
    await produto.save();
    res.json(produto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
