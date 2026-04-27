const mongoose = require('mongoose');

const MensagemSchema = new mongoose.Schema({
  remetenteId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  role: { type: String, enum: ['user', 'admin'] }, // Define quem mandou
  texto: String,
  timestamp: { type: Date, default: Date.now }
});

const SuporteSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // O dono do chamado
  status: { type: String, enum: ['ativo', 'encerrado'], default: 'ativo' },
  mensagens: [MensagemSchema],
  ultimaMensagem: Date
}, { timestamps: true });

module.exports = mongoose.model('Suporte', SuporteSchema);