const Admin = require("../models-mongodb/Admin");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

class AdminController {
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

      res.json({
        success: true,
        message: "Login de administrador realizado com sucesso",
        data: {
          token,
          admin: admin.toJSON(),
        },
      });
    } catch (error) {
      console.error("Erro no login admin:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  }

  // ==========================================
  // RECUPERAR SENHA
  // ==========================================
  static async recuperarSenha(req, res) {
    try {
      const { email, usuario } = req.body;

      const login = (email || usuario || "").toLowerCase();

      const admin = await Admin.findOne({
        $or: [{ email: login }, { usuario: login }],
      });

      // 🔒 não revela se existe ou não
      if (!admin) {
        return res.json({
          success: true,
          message: "Se o usuário existir, você receberá instruções",
        });
      }

      const resetToken = crypto.randomBytes(20).toString("hex");

      admin.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      admin.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min

      await admin.save();

      // ⚠️ em produção: enviar email
      res.json({
        success: true,
        message: "Token gerado",
        token: resetToken,
      });
    } catch (error) {
      console.error("Erro ao recuperar senha admin:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  }

  // ==========================================
  // RECUPERAR SENHA
  // ==========================================
  static async recuperarSenha(req, res) {
    try {
      const { email, usuario } = req.body;

      const login = (email || usuario || "").toLowerCase();

      const admin = await Admin.findOne({
        $or: [{ email: login }, { usuario: login }],
      }).select("+senha");

      // 🔒 não revela se existe ou não
      if (!admin) {
        return res.json({
          success: true,
          message: "Se o usuário existir, você receberá instruções",
        });
      }

      // 🔥 gera senha temporária
      const novaSenha = Math.random().toString(36).slice(-8);

      admin.senha = novaSenha; // NÃO precisa hash manual
      await admin.save(); // 🔥 aqui aplica o bcrypt automaticamente

      res.json({
        success: true,
        message: "Senha redefinida",
        data: {
          nova_senha: novaSenha, // 🔥 mesmo padrão do USER
        },
      });
    } catch (error) {
      console.error("Erro ao recuperar senha admin:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  }

  // ==========================================
  // ALTERAR SENHA (LOGADO)
  // ==========================================
  static async alterarSenha(req, res) {
    try {
      const { senhaAtual, novaSenha } = req.body;

      const admin = await Admin.findById(req.admin._id).select("+senha");

      const senhaValida = await admin.verificarSenha(senhaAtual);

      if (!senhaValida) {
        return res.status(400).json({
          success: false,
          message: "Senha atual incorreta",
        });
      }

      admin.senha = novaSenha;
      await admin.save();

      res.json({
        success: true,
        message: "Senha alterada com sucesso",
      });
    } catch (error) {
      console.error("Erro ao alterar senha admin:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  }

  // ==========================================
  // CRIAR ADMIN
  // ==========================================
  static async criarAdmin(req, res) {
    try {
      const { usuario, senha, nome_completo, email, nivel_acesso } = req.body;

      const adminExistente = await Admin.findOne({
        $or: [{ usuario }, { email: email.toLowerCase() }],
      });

      if (adminExistente) {
        return res.status(400).json({
          success: false,
          message: "Usuário ou email já cadastrado",
        });
      }

      const admin = await Admin.create({
        usuario,
        senha,
        nome_completo,
        email: email.toLowerCase(),
        nivel_acesso: nivel_acesso || "admin",
      });

      res.status(201).json({
        success: true,
        message: "Administrador criado com sucesso",
        data: admin.toJSON(),
      });
    } catch (error) {
      console.error("Erro ao criar admin:", error);
      res.status(500).json({
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

      res.json({
        success: true,
        data: admins,
      });
    } catch (error) {
      console.error("Erro ao listar admins:", error);
      res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
      });
    }
  }

  // ==========================================
  // PERFIL
  // ==========================================
  static async perfil(req, res) {
    res.json({
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

      if (nome_completo) updateData.nome_completo = nome_completo;
      if (email) updateData.email = email.toLowerCase();
      if (telefone) updateData.telefone = telefone;

      const adminAtualizado = await Admin.findByIdAndUpdate(
        adminId,
        updateData,
        { new: true },
      );

      res.json({
        message: "Perfil atualizado",
        data: adminAtualizado,
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar perfil" });
    }
  }

  // ==========================================
  // VERIFICAR TOKEN
  // ==========================================
  static async verificarToken(req, res) {
    res.json({
      success: true,
      data: req.admin,
    });
  }
}

module.exports = AdminController;
