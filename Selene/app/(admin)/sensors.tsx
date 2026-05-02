import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import { Picker } from "@react-native-picker/picker";

/* =======================
   TYPES
======================= */
type Usuario = {
  _id: string;
  nome: string;
  email: string;
};

export default function AdminSensors() {
  const [nome, setNome] = useState("");
  const [mac, setMac] = useState("");
  const [localizacao, setLocalizacao] = useState("");

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioId, setUsuarioId] = useState("");

  const [tipo, setTipo] = useState<"ESP32_SENSORES" | "ESP32_CAM">(
    "ESP32_SENSORES"
  );

  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const token = "SEU_TOKEN_AQUI";

  /* =======================
     BUSCAR USUÁRIOS
  ======================= */
  const fetchUsuarios = async () => {
    try {
      setLoadingUsers(true);

      const res = await fetch(
        "https://SEU_BACKEND.onrender.com/api/v1/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      console.log("USERS:", data);

      const lista = data?.data || data || [];

      setUsuarios(Array.isArray(lista) ? lista : []);
    } catch (err: any) {
      console.log("Erro usuários:", err.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  /* =======================
     CRIAR DISPOSITIVO
  ======================= */
  const criarDispositivo = async () => {
    if (!nome || !mac || !usuarioId) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "https://SEU_BACKEND.onrender.com/api/v1/dispositivos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mac_address: mac.trim(),
            nome: nome.trim(),
            tipo,
            localizacao: localizacao.trim() || null,
            usuario_id: usuarioId,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      Alert.alert("Sucesso", "Dispositivo criado!");

      setNome("");
      setMac("");
      setLocalizacao("");
      setUsuarioId("");
      setTipo("ESP32_SENSORES");
    } catch (err: any) {
      Alert.alert("Erro", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} />

        <Text style={styles.label}>MAC</Text>
        <TextInput style={styles.input} value={mac} onChangeText={setMac} />

        <Text style={styles.label}>Localização</Text>
        <TextInput
          style={styles.input}
          value={localizacao}
          onChangeText={setLocalizacao}
        />

        {/* USERS */}
        <Text style={styles.label}>Usuário</Text>

        {loadingUsers ? (
          <ActivityIndicator />
        ) : (
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={usuarioId}
              onValueChange={(value: string) => setUsuarioId(value)}
            >
              <Picker.Item label="Selecione um usuário" value="" />

              {usuarios.map((u) => (
                <Picker.Item
                  key={u._id}
                  label={`${u.nome} (${u.email})`}
                  value={u._id}
                />
              ))}
            </Picker>
          </View>
        )}

        {/* TIPO */}
        <Text style={styles.label}>Tipo</Text>

        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              tipo === "ESP32_SENSORES" && styles.typeButtonActive,
            ]}
            onPress={() => setTipo("ESP32_SENSORES")}
          >
            <Text>Sensor</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              tipo === "ESP32_CAM" && styles.typeButtonActive,
            ]}
            onPress={() => setTipo("ESP32_CAM")}
          >
            <Text>Cam</Text>
          </TouchableOpacity>
        </View>

        {/* BOTÃO */}
        <TouchableOpacity
          style={styles.button}
          onPress={criarDispositivo}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Criar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* =======================
   STYLE
======================= */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  card: { backgroundColor: "#fff", padding: 20, borderRadius: 15 },

  label: { fontWeight: "bold", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },

  pickerBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 15,
  },

  row: { flexDirection: "row", gap: 10, marginBottom: 15 },

  typeButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#95C159",
    borderRadius: 10,
    alignItems: "center",
  },

  typeButtonActive: {
    backgroundColor: "#95C159",
  },

  button: {
    backgroundColor: "#2A3A56",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: { color: "#fff", fontWeight: "bold" },
});
