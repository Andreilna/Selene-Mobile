# 📸 Endpoint - Última Foto da Câmera

## 🎯 Objetivo
Retornar informações da **última foto** tirada pela câmera de um dispositivo específico.

## 🔗 Endpoint

```
GET /api/v1/leituras/:dispositivo_id/ultima-foto
```

**Autenticação:** Requerida (usuário logado)

## 📝 Exemplo de Uso

```bash
curl -X GET http://localhost:3000/api/v1/leituras/507f1f77bcf86cd799439011/ultima-foto \
  -H "Authorization: Bearer <token>"
```

## 📤 Resposta de Sucesso

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "dispositivo": {
      "id": "507f1f77bcf86cd799439011",
      "nome": "ESP32-CAM_ABC123",
      "mac": "AA:BB:CC:DD:EE:FF",
      "tipo": "ESP32_CAM"
    },
    "foto": {
      "foto_path": "/fotos_cogumelos/507f1f77bcf86cd799439013/AA-BB-CC-DD-EE-FF/ESP32-CAM_1640995200.jpg",
      "tamanho_arquivo": 245760,
      "altura": 15.5,
      "client_ip": "192.168.1.100"
    },
    "timestamp": "2026-05-06T14:30:00.000Z"
  }
}
```

## 📤 Resposta de Erro (Nenhuma foto encontrada)

```json
{
  "success": false,
  "message": "Nenhuma foto encontrada para este dispositivo"
}
```

## 🔑 Campos da Resposta

### `data.dispositivo`
- `id`: ID único do dispositivo
- `nome`: Nome do dispositivo
- `mac`: Endereço MAC
- `tipo`: Tipo do dispositivo (ESP32_CAM)

### `data.foto`
- `foto_path`: Caminho relativo da foto salva no servidor
- `tamanho_arquivo`: Tamanho do arquivo em bytes
- `altura`: Altura da planta medida (opcional)
- `client_ip`: IP do dispositivo que enviou a foto

### `data.timestamp`
Data e hora em que a foto foi tirada (ISO 8601)

## 🌐 Acessando a Foto

Para acessar a foto diretamente, use o `foto_path` retornado:

```bash
# Exemplo de URL completa
http://localhost:3000/fotos_cogumelos/507f1f77bcf86cd799439013/AA-BB-CC-DD-EE-FF/ESP32-CAM_1640995200.jpg
```

## ⚙️ Detalhes Técnicos

### Filtro de Busca
- Busca apenas leituras do tipo `CAMERA`
- Ordena por `timestamp` descendente (mais recente primeiro)
- Retorna apenas a primeira (mais recente) encontrada

### Estrutura de Armazenamento
As fotos são salvas na estrutura:
```
fotos_cogumelos/
├── {usuario_id}/
│   └── {mac_normalizado}/
│       └── {equipamento}_{timestamp}.jpg
```

### Validação
- ✅ Verifica se o dispositivo existe
- ✅ Retorna erro 404 se nenhuma foto for encontrada
- ✅ Protegido por autenticação JWT

## 📊 Casos de Uso

### 1. **Dashboard de Monitoramento**
Mostrar a última foto capturada da estufa para monitoramento visual.

### 2. **Histórico de Crescimento**
Comparar fotos ao longo do tempo para acompanhar o crescimento das plantas.

### 3. **Alertas Visuais**
Exibir a última foto quando há alertas ou anomalias detectadas.

### 4. **Relatórios**
Incluir a foto mais recente em relatórios de status da estufa.

## 🔍 Exemplo de Integração no Frontend

```javascript
// Buscar última foto
const buscarUltimaFoto = async (dispositivoId) => {
  try {
    const response = await fetch(`/api/v1/leituras/${dispositivoId}/ultima-foto`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (data.success) {
      // Exibir foto
      const fotoUrl = `http://localhost:3000${data.data.foto.foto_path}`;
      document.getElementById('ultima-foto').src = fotoUrl;

      // Exibir informações
      document.getElementById('timestamp').textContent =
        new Date(data.data.timestamp).toLocaleString('pt-BR');
    }
  } catch (error) {
    console.error('Erro ao buscar foto:', error);
  }
};
```

## ✅ Checklist de Implementação

- ✅ Método `ultimaFoto()` no controller
- ✅ Rota `GET /:dispositivo_id/ultima-foto` criada
- ✅ Autenticação obrigatória
- ✅ Filtro por tipo `CAMERA`
- ✅ Ordenação por timestamp descendente
- ✅ Tratamento de erro para dispositivo não encontrado
- ✅ Tratamento de erro para foto não encontrada
- ✅ Retorno de dados estruturados
- ✅ Documentação completa