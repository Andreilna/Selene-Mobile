const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// Importe seu Model de Admin aqui (ajuste o caminho se necessário)
const Admin = require('./models-mongodb/Admin'); 

// Coloque sua string de conexão do MongoDB aqui ou use process.env.MONGO_URI
const MONGO_URI = 'mongodb://admin:1234567890qwerty@ac-x12nzmn-shard-00-00.8lnociv.mongodb.net:27017,ac-x12nzmn-shard-00-01.8lnociv.mongodb.net:27017,ac-x12nzmn-shard-00-02.8lnociv.mongodb.net:27017/?ssl=true&replicaSet=atlas-q1sjx4-shard-0&authSource=admin&appName=Selene'; 

async function criarUsuarioAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('📦 Conectado ao MongoDB...');

    // Limpa se já existir um admin com esse usuário (opcional para teste)
    // await Admin.deleteOne({ usuario: 'andrei_admin' });

    const admin = new Admin({
      usuario: 'andrei_admin',
      senha: 'suasenha123', // O model vai transformar em hash sozinho!
      nome_completo: 'Andrei Lucas',
      email: 'andrei@selene.com',
      nivel_acesso: 'superadmin', // Nível máximo
      ativo: true
    });

    await admin.save();

    console.log('---');
    console.log('✅ Administrador criado com sucesso!');
    console.log('👤 Usuário:', admin.usuario);
    console.log('📧 Email:', admin.email);
    console.log('---');

    process.exit();
  } catch (error) {
    if (error.code === 11000) {
      console.error('❌ Erro: Este usuário ou e-mail já está cadastrado.');
    } else {
      console.error('❌ Erro ao criar admin:', error);
    }
    process.exit(1);
  }
}

criarUsuarioAdmin();