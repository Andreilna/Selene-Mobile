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
        "_id nome_completo email telefone data_cadastro ativo",
      ).sort({ data_cadastro: -1 });

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

  // 👤 BUSCAR USUÁRIO POR ID (somente admin)
  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;

      const usuario = await User.findById(id).select("-senha");

      if (!usuario || usuario.tipo !== "user") {
        return res.status(404).json({
          success: false,
          message: "Usuário não encontrado",
        });
      }

      return res.json({
        success: true,
        data: usuario,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao buscar usuário",
      });
    }
  }

  // ✏️ ATUALIZAR USUÁRIO (somente admin)
  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome_completo, email, telefone, ativo } = req.body;

      const usuario = await User.findById(id);

      if (!usuario || usuario.tipo !== "user") {
        return res.status(404).json({
          success: false,
          message: "Usuário não encontrado",
        });
      }

      // Verificar se email já está em uso por outro usuário
      if (email && email !== usuario.email) {
        const emailExistente = await User.findOne({ email });
        if (emailExistente) {
          return res.status(400).json({
            success: false,
            message: "Email já está em uso",
          });
        }
      }

      const usuarioAtualizado = await User.findByIdAndUpdate(
        id,
        {
          nome_completo: nome_completo || usuario.nome_completo,
          email: email || usuario.email,
          telefone: telefone !== undefined ? telefone : usuario.telefone,
          ativo: ativo !== undefined ? ativo : usuario.ativo,
        },
        { new: true },
      ).select("-senha");

      return res.json({
        success: true,
        data: usuarioAtualizado,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao atualizar usuário",
      });
    }
  }

  // 🗑️ DELETAR USUÁRIO (somente admin)
  static async deletar(req, res) {
    try {
      const { id } = req.params;

      const usuario = await User.findById(id);

      if (!usuario || usuario.tipo !== "user") {
        return res.status(404).json({
          success: false,
          message: "Usuário não encontrado",
        });
      }

      await User.findByIdAndDelete(id);

      return res.json({
        success: true,
        message: "Usuário deletado com sucesso",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao deletar usuário",
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
        data_cadastro: new Date(),
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
