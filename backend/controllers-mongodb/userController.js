const User = require("../models-mongodb/User");

class userController {
  // 👤 perfil do usuário logado
  static async perfil(req, res) {
    try {
      const user = await User.findById(req.userId).select("-senha");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuário não encontrado",
        });
      }

      return res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao buscar perfil",
      });
    }
  }

  // 🔥 LISTAR USUÁRIOS (SOMENTE USER)
  static async listar(req, res) {
    try {
      const usuarios = await User.find({ tipo: "user" }).select(
        "_id nome_completo email",
      );

      return res.json({
        success: true,
        data: usuarios,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao listar usuários",
      });
    }
  }

  // ✏️ atualizar perfil (CORRIGIDO)
  static async atualizarPerfil(req, res) {
    try {
      const { nome_completo, email } = req.body;

      const user = await User.findByIdAndUpdate(
        req.userId,
        { nome_completo, email },
        { new: true },
      ).select("-senha");

      return res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao atualizar perfil",
      });
    }
  }

  // 📡 ping online
  static async ping(req, res) {
    return res.json({
      success: true,
      message: "online",
      user: req.userId,
    });
  }
}

module.exports = userController;
