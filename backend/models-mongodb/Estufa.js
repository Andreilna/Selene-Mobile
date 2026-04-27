const mongoose = require('mongoose');

const EstufaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  data_criacao: { type: String, default: () => new Date().toLocaleDateString('pt-BR') },
  status: { type: String, default: 'Baixo' },
  // outros campos como quantidade, camera, etc.
}, { timestamps: true });

module.exports = mongoose.model('Estufa', EstufaSchema);