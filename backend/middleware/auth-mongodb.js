const jwt = require('jsonwebtoken');
const User = require('../models-mongodb/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    // 1. Verifica se o header existe e segue o padrão Bearer
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token de acesso não fornecido ou formato inválido'
      });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer '
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token vazio'
      });
    }
    
    // 2. Verificar token usando a Secret do seu .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_fallback');
    
    // 3. BUSCA FLEXÍVEL (O segredo para não dar "Usuário não encontrado")
    // Tenta pegar o ID de qualquer uma das chaves comuns que o JWT pode ter salvo
    const userId = decoded.userId || decoded.id || decoded._id;

    if (!userId) {
      console.error('❌ ID não encontrado dentro do payload do Token:', decoded);
      return res.status(401).json({
        success: false,
        message: 'Payload do token inválido (ID ausente)'
      });
    }

    // 4. Buscar usuário no MongoDB
    const user = await User.findById(userId);
    
    if (!user) {
      console.error(`❌ Usuário com ID ${userId} não existe no banco de dados.`);
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado no banco'
      });
    }
    
    // 5. Verifica se o usuário está ativo (se seu model tiver esse campo)
    // Se você NÃO tiver o campo 'ativo' no model, pode comentar estas linhas:
    if (user.ativo === false) {
      return res.status(401).json({
        success: false,
        message: 'Esta conta está desativada'
      });
    }
    
    // 6. Injeta os dados do usuário na requisição para uso nos Controllers
    req.userId = user._id;
    req.user = user;
    
    console.log(`✅ Autenticado: ${user.email || user.nome} (${user._id})`);
    
    next();
  } catch (error) {
    console.error('⚠️ Erro na autenticação:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido ou corrompido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Sessão expirada. Faça login novamente.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erro interno na validação do acesso'
    });
  }
};

module.exports = authMiddleware;