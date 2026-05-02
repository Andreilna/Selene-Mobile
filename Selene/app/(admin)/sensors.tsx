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
    "ESP32_SENSORES",
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

      const res = await fetch("https://SEU_BACKEND.onrender.com/api/v1/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setUsuarios(data.data);
      }
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

      const response = await fetch(
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
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao criar dispositivo");
      }

      Alert.alert("Sucesso", "Dispositivo criado com sucesso!");

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
        <Text style={styles.label}>Nome do Dispositivo</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Ex: Sensor Cogumelo"
        />

        <Text style={styles.label}>MAC Address</Text>
        <TextInput
          style={styles.input}
          value={mac}
          onChangeText={setMac}
          placeholder="Ex: 88:57:21:c1:61:5c"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Localização</Text>
        <TextInput
          style={styles.input}
          value={localizacao}
          onChangeText={setLocalizacao}
          placeholder="Ex: Sala de Cultivo"
        />

        {/* =======================
           USUÁRIOS
        ======================= */}
        <Text style={styles.label}>Usuário dono</Text>

        {loadingUsers ? (
          <ActivityIndicator />
        ) : (
          <View style={styles.pickerBox}>
            <Picker
              selectedValue={usuarioId}
              onValueChange={(value: string) => setUsuarioId(value)}
            >
              <Picker.Item label="Selecione um usuário" value="" />

              {usuarios.map((user) => (
                <Picker.Item
                  key={user._id}
                  label={`${user.nome} (${user.email})`}
                  value={user._id}
                />
              ))}
            </Picker>
          </View>
        )}

        {/* =======================
           TIPO
        ======================= */}
        <Text style={styles.label}>Tipo de Dispositivo</Text>

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

        {/* =======================
           BOTÃO
        ======================= */}
        <TouchableOpacity
          style={styles.button}
          onPress={criarDispositivo}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Criar Dispositivo</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* =======================
   STYLES
======================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
    justifyContent: "center",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 25,
    elevation: 4,
  },

  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2A3A56",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#F8FBF8",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },

  pickerBox: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
    backgroundColor: "#F8FBF8",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#95C159",
    alignItems: "center",
    marginHorizontal: 5,
  },

  typeButtonActive: {
    backgroundColor: "#95C159",
  },

  button: {
    backgroundColor: "#2A3A56",
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
