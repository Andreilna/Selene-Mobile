# Selene-Mobile

> Sistema Selene para monitoramento de estufas e sensores com backend Node.js/MongoDB e aplicativo mobile Expo/React Native.

## 📁 Estrutura do Projeto

- `backend/` - API REST com Node.js, Express e MongoDB.
- `Selene/` - Aplicativo mobile com Expo, Expo Router e React Native.

## 🛠️ Ferramentas Utilizadas

### Backend
- Node.js
- Express
- MongoDB via Mongoose
- Multer + Cloudinary para uploads de imagens
- Socket.io para comunicação em tempo real
- dotenv para variáveis de ambiente
- Helmet e CORS para segurança

### Mobile
- Expo
- Expo Router
- React Native
- Axios para chamadas HTTP
- AsyncStorage para armazenamento local
- Expo Notifications, Audio, Clipboard, entre outros módulos Expo

## ✅ Pré-requisitos

Antes de executar o app mobile, instale:

- Node.js (recomendado 18.x ou superior)
- npm
- Expo CLI opcionalmente: `npm install -g expo-cli`

> O backend já está publicado no Render, então não é necessário rodá-lo localmente.

## 📱 Como rodar o app mobile

1. Abra um terminal na pasta `Selene/`.
2. Instale dependências:
   ```bash
   npm install
   ```
3. Inicie o Expo:
   ```bash
   npm start
   ```
4. No painel do Expo, use uma das opções:
   - `Run on Android device/emulator`
   - `Run on iOS simulator` (macOS)
   - `Run in web browser`

### Comandos úteis do Expo
- `npm run android` - executa no emulador Android
- `npm run ios` - executa no emulador iOS
- `npm run web` - executa no navegador
- `npm run lint` - verifica regras do ESLint

## 🔧 Observações importantes

- A aplicação mobile consome a API do backend publicado no Render. Garanta que a URL da API esteja configurada corretamente em `Selene/services/api.ts`.
- Se usar `localhost` no emulador Android apenas para desenvolvimento local do backend, troque por `10.0.2.2` quando necessário.
- O backend não precisa ser executado localmente neste fluxo: use o serviço já implantado.

## 🧩 Recursos adicionais

- `backend/routes/` - rotas da API
- `backend/models-mongodb/` - modelos do MongoDB
- `Selene/app/` - telas e rotas do aplicativo
- `Selene/constants/` - configurações e rotas da aplicação mobile
- `Selene/hooks/` - hooks customizados para auth, tema e API
- `Selene/services/` - serviços de API e autenticação

## 🧪 Testes e desenvolvimento

- Use `npm start` no Expo para desenvolvimento mobile com recarga instantânea.

## 📝 Observação final

Este projeto é uma solução híbrida com backend em Node.js e frontend mobile em Expo. Ajuste as variáveis de ambiente e URLs conforme o ambiente de desenvolvimento ou produção.