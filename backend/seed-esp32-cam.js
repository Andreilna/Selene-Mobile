const mongoose = require('mongoose');

// Importe seu Model de Dispositivo aqui (ajuste o caminho se necessário)
const Dispositivo = require('./models-mongodb/Dispositivo');

// Coloque sua string de conexão do MongoDB aqui ou use process.env.MONGO_URI
const MONGO_URI = "mongodb://admin:1234567890qwerty@ac-x12nzmn-shard-00-00.8lnociv.mongodb.net:27017,ac-x12nzmn-shard-00-01.8lnociv.mongodb.net:27017,ac-x12nzmn-shard-00-02.8lnociv.mongodb.net:27017/?ssl=true&replicaSet=atlas-q1sjx4-shard-0&authSource=admin&appName=Selene";

async function criarDispositivo() {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "selene" // 🔥 força o banco certo
    });

    console.log("📦 Conectado ao MongoDB...");

    const jaExiste = await Dispositivo.findOne({
      mac_address: "88:57:21:c1:61:5c"
    });

    if (jaExiste) {
      console.log("⚠️ Já existe no banco correto");
      return;
    }

    const dispositivo = await Dispositivo.create({
      mac_address: "88:57:21:c1:61:5c",
      nome: "ESP32-CAMERA",
      tipo: "ESP32_CAM",
      localizacao: "Estufa de Cogumelos",
      usuario: "69ea4c05def22a316d8c201b",
      online: true,
      ultima_comunicacao: new Date(),
      ativo: true
    });

    console.log("✅ Criado no banco certo:", dispositivo.mac_address);

  } catch (err) {
    console.error("❌ Erro:", err);
  } finally {
    await mongoose.disconnect();
  }
}

criarDispositivo();