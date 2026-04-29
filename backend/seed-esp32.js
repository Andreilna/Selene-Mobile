const mongoose = require('mongoose');

// Importe seu Model de Dispositivo aqui (ajuste o caminho se necessário)
const Dispositivo = require('./models-mongodb/Dispositivo');

// Coloque sua string de conexão do MongoDB aqui ou use process.env.MONGO_URI
//const MONGO_URI = "url_do_seu_mongodb_aqui";

async function criarDispositivo() {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "selene" // 🔥 força o banco certo
    });

    console.log("📦 Conectado ao MongoDB...");

    const jaExiste = await Dispositivo.findOne({
      mac_address: "a4:f0:0f:75:75:68"
    });

    if (jaExiste) {
      console.log("⚠️ Já existe no banco correto");
      return;
    }

    const dispositivo = await Dispositivo.create({
      mac_address: "a4:f0:0f:75:75:68",
      nome: "ESP32",
      tipo: "ESP32_SENSORES",
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