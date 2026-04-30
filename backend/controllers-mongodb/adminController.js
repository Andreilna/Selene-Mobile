const Admin = require('../models-mongodb/Admin');
const jwt = require('jsonwebtoken');

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
          message: 'Usuário e senha são obrigatórios'
        });
      }

      const login = usuario.trim().toLowerCase();

      // 🔥 busca por usuario OU email
      const admin = await Admin.findOne({
        $or: [
          { usuario: login },
          { email: login }
        ]
      }).select('+senha');

      if (!admin || !(await admin.verificarSenha(senha))) {
        return res.status(401).json({
          success: false,
          message: 'Usuário ou senha inválidos'
        });
      }

      if (!admin.ativo) {
        return res.status(401).json({
          success: false,
          message: 'Administrador desativado'
        });
      }

      admin.ultimo_login = new Date();
      await admin.save();

      const token = jwt.sign(
        {
          adminId: admin._id,
          nivel: admin.nivel_acesso
        },
        process.env.JWT_SECRET || 'secret_fallback',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        data: {
          token,
          admin: admin.toJSON()
        }
      });

    } catch (error) {
      console.error('Erro no login admin:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // ==========================================
  // PERFIL
  // ==========================================
  static async perfil(req, res) {
    try {
      res.json({
        data: req.admin
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar perfil" });
    }
  }

  // ==========================================
  // ATUALIZAR PERFIL
  // ==========================================
  static async atualizarPerfil(req, res) {
    try {
      const adminId = req.admin._id;
      const { nome_completo, email, telefone } = req.body;

      const adminAtualizado = await Admin.findByIdAndUpdate(
        adminId,
        { nome_completo, email, telefone },
        { new: true }
      );

      res.json({
        message: "Perfil atualizado",
        data: adminAtualizado,
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar perfil" });
    }
  }
}

module.exports = AdminController;