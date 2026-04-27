const mongoose = require('mongoose');

const EstufaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome da estufa é obrigatório.'],
    trim: true
  },
  quantidade_compostos: {
    type: String, // Mantido como String caso você queira salvar "10 unidades", mas pode ser Number
    default: '0'
  },
  endereco_camera: {
    type: String,
    trim: true,
    default: ''
  },
  observacoes: {
    type: String,
    trim: true,
    default: ''
  },
  data_criacao: {
    type: String,
    default: () => new Date().toLocaleDateString('pt-BR')
  },
  status: {
    type: String,
    enum: ['Baixo', 'Médio', 'Alto'],
    default: 'Baixo'
  },
  // Opcional: Relacionar a estufa ao usuário que a criou
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  }
}, { 
  timestamps: true // Cria automaticamente os campos createdAt e updatedAt
});

module.exports = mongoose.model('Estufa', EstufaSchema);