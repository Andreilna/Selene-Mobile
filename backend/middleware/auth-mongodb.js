const jwt = require("jsonwebtoken");
const User = require("../models-mongodb/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Verifica header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Token de acesso não fornecido ou formato inválido",
      });
    }

    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token vazio",
      });
    }

    // 2. Verifica token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret_fallback",
    );

    // 3. Extrai ID (tenta várias chaves comuns)
    const userId =
      decoded.userId || decoded.id || decoded._id || decoded.adminId;

    if (!userId) {
      console.error(
        "❌ ID não encontrado dentro do payload do Token:",
        decoded,
      );

      return res.status(401).json({
        success: false,
        message: "Payload do token inválido (ID ausente)",
      });
    }

    // 4. Buscar usuário
    const user = await User.findById(userId);

    if (!user) {
      console.error(`❌ Usuário com ID ${userId} não existe no banco.`);

      return res.status(401).json({
        success: false,
        message: "Usuário não encontrado no banco",
      });
    }

    // 5. Verificar ativo
    if (user.ativo === false) {
      return res.status(401).json({
        success: false,
        message: "Esta conta está desativada",
      });
    }

    // 6. Injetar usuário
    req.userId = user._id;
    req.user = user;

    next();
  } catch (error) {
    console.error("⚠️ Erro na autenticação:", error.message);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token inválido ou corrompido",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Sessão expirada. Faça login novamente.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Erro interno na validação do acesso",
    });
  }
};

module.exports = authMiddleware;