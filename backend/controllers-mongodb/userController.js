const User = require("../models-mongodb/User");
const bcrypt = require("bcryptjs");

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

  // 👥 LISTAR USUÁRIOS (somente tipo user)
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

  // ✏️ atualizar perfil
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

  // ➕ CRIAR USUÁRIO (CADASTRO)
  static async criar(req, res) {
    try {
      const { nome_completo, email, senha, telefone, data_nascimento, tipo } =
        req.body;

      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({
          success: false,
          message: "Email já está em uso",
        });
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      const user = await User.create({
        nome_completo,
        email,
        senha: senhaHash,
        telefone: telefone || null,
        data_nascimento: data_nascimento || null,
        tipo: tipo || "user",
        ativo: true,
      });

      return res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao criar usuário",
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
