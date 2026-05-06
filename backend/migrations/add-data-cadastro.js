/**
 * Script de migração para adicionar data_cadastro aos usuários existentes
 * Execução: node migrations/add-data-cadastro.js
 */

const mongoose = require("mongoose");
const User = require("../models-mongodb/User");
const db = require("../config/mongodb");

async function migrarDataCadastro() {
  try {
    console.log("🔄 Iniciando migração de data_cadastro...");

    // Conectar ao banco de dados
    await db.conectar();
    console.log("✅ Conectado ao MongoDB");

    // Buscar todos os usuários sem data_cadastro
    const usuariosSemData = await User.find({
      data_cadastro: { $exists: false },
    });

    console.log(
      `📊 Encontrados ${usuariosSemData.length} usuários sem data_cadastro`,
    );

    if (usuariosSemData.length === 0) {
      console.log("✅ Todos os usuários já possuem data_cadastro");
      await mongoose.disconnect();
      return;
    }

    // Atualizar usuários
    const result = await User.updateMany(
      { data_cadastro: { $exists: false } },
      { $set: { data_cadastro: new Date() } },
    );

    console.log(`✅ ${result.modifiedCount} usuários foram atualizados`);
    console.log("🎉 Migração concluída com sucesso!");

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Erro na migração:", error.message);
    process.exit(1);
  }
}

// Executar migração
migrarDataCadastro();
