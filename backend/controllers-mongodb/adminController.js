const Admin = require("../models-mongodb/Admin");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

class adminController {
  // ==========================================
  // LOGIN
  // ==========================================
  static async login(req, res) {
    try {
      const { usuario, senha } = req.body;

      if (!usuario || !senha) {
        return res.status(400).json({
          success: false,
          message: "Usuário e senha são obrigatórios",
        });
      }

      const login = usuario.trim().toLowerCase();

      const admin = await Admin.findOne({
        $or: [{ usuario: login }, { email: login }],
      }).select("+senha");

      if (!admin || !(await admin.verificarSenha(senha))) {
        return res.status(401).json({
          success: false,
          message: "Usuário ou senha inválidos",
        });
      }

      if (!admin.ativo) {
        return res.status(401).json({
          success: false,
          message: "Administrador desativado",
        });
      }

      admin.ultimo_login = new Date();
      await admin.save();

      const token = jwt.sign(
        {
          adminId: admin._id,
          usuario: admin.usuario,
          nivel: admin.nivel_acesso,
        },
        process.env.JWT_SECRET || "secret_fallback",
        { expiresIn: "24h" },
      );

      return res.json({
        success: true,
        message: "Login realizado com sucesso",
        data: {
          token,
          admin: admin.toJSON(),
        },
      });
    } catch (error) {
      console.error("Erro login admin:", error);
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  }

  // ==========================================
  // CRIAR ADMIN (PROTEGIDO)
  // ==========================================
  static async criarAdmin(req, res) {
    try {
      const { usuario, senha, nome_completo, email, nivel_acesso } = req.body;

      if (!usuario || !senha || !nome_completo || !email) {
        return res.status(400).json({
          success: false,
          message: "Preencha todos os campos obrigatórios",
        });
      }

      const emailNormalizado = email.toLowerCase().trim();
      const usuarioNormalizado = usuario.toLowerCase().trim();

      const adminExistente = await Admin.findOne({
        $or: [{ usuario: usuarioNormalizado }, { email: emailNormalizado }],
      });

      if (adminExistente) {
        return res.status(400).json({
          success: false,
          message: "Usuário ou email já cadastrado",
        });
      }

      // 🔒 proteção: só superadmin pode criar outro superadmin
      if (nivel_acesso === "superadmin" && req.admin?.nivel !== "superadmin") {
        return res.status(403).json({
          success: false,
          message: "Sem permissão para criar superadmin",
        });
      }

      const admin = await Admin.create({
        usuario: usuarioNormalizado,
        senha,
        nome_completo,
        email: emailNormalizado,
        nivel_acesso: nivel_acesso || "admin",
      });

      return res.status(201).json({
        success: true,
        message: "Administrador criado com sucesso",
        data: admin.toJSON(),
      });
    } catch (error) {
      console.error("Erro criar admin:", error);
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  }

  // ==========================================
  // LISTAR ADMINS
  // ==========================================
  static async listarAdmins(req, res) {
    try {
      const admins = await Admin.find().select("-senha");

      return res.json({
        success: true,
        data: admins,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao listar admins",
      });
    }
  }

  // ==========================================
  // PERFIL
  // ==========================================
  static async perfil(req, res) {
    return res.json({
      success: true,
      data: req.admin,
    });
  }

  // ==========================================
  // ATUALIZAR PERFIL
  // ==========================================
  static async atualizarPerfil(req, res) {
    try {
      const adminId = req.admin._id;
      const { nome_completo, email, telefone } = req.body;

      const updateData = {};

      if (nome_completo) updateData.nome_completo = nome_completo.trim();
      if (email) updateData.email = email.toLowerCase().trim();
      if (telefone) updateData.telefone = telefone;

      const adminAtualizado = await Admin.findByIdAndUpdate(
        adminId,
        updateData,
        { new: true },
      ).select("-senha");

      return res.json({
        success: true,
        message: "Perfil atualizado",
        data: adminAtualizado,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao atualizar perfil",
      });
    }
  }

  // ==========================================
  // VERIFICAR TOKEN
  // ==========================================
  static async verificarToken(req, res) {
    return res.json({
      success: true,
      data: req.admin,
    });
  }
}

module.exports = AdminController;
