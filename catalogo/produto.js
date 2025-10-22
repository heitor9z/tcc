const mongoose = require("mongoose");

const ProdutoSchema = new mongoose.Schema({
  nome: String,
  categoria: String,
  preco: Number,
  imagem: String,
  cores: [String],
  tamanhos: [String]
});

module.exports = mongoose.model("Produto", ProdutoSchema);
