const Estufa = require('../models-mongodb/Estufa'); // Certifique-se de ter o Model

class EstufaController {
  static async listar(req, res) {
    try {
      // Busca todas as estufas no banco
      const estufas = await Estufa.find().sort({ createdAt: -1 });

      res.json({
        success: true,
        data: estufas
      });
    } catch (error) {
      console.error('Erro ao listar estufas:', error);
      res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
  }
}

module.exports = EstufaController;