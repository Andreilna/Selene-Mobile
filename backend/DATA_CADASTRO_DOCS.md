# 📋 Documentação - Campo data_cadastro

## 🎯 Objetivo
Adicionar um campo `data_cadastro` que registra automaticamente a data em que o usuário foi cadastrado pelo admin no sistema.

## 🔧 Mudanças Implementadas

### 1. Modelo User.js
- ✅ Adicionado campo `data_cadastro` do tipo `Date`
- ✅ Valor padrão: `Date.now` (preenchido automaticamente no momento da criação)

### 2. Controller userController.js
- ✅ **CREATE**: Campo `data_cadastro` é preenchido automaticamente no método `criar()`
- ✅ **READ (List)**: Método `listar()` retorna usuários com `data_cadastro`
- ✅ **READ (By ID)**: Novo método `buscarPorId()` para buscar usuário específico
- ✅ **UPDATE**: Novo método `atualizar()` para atualizar dados do usuário
- ✅ **DELETE**: Novo método `deletar()` para remover usuário

### 3. Rotas userRoutes.js
Rotas CRUD completas (somente admin):

```
POST   /api/users              - Criar novo usuário (com data_cadastro automática)
GET    /api/users              - Listar todos os usuários
GET    /api/users/:id          - Buscar usuário por ID
PUT    /api/users/:id          - Atualizar dados do usuário
DELETE /api/users/:id          - Deletar usuário

GET    /api/users/me           - Perfil do usuário autenticado
PUT    /api/users/me           - Atualizar perfil do usuário logado
POST   /api/users/ping         - Verificar status online
```

## 📦 Estrutura de Dados

### Usuário com data_cadastro
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "nome_completo": "João Silva",
  "email": "joao@example.com",
  "telefone": "11987654321",
  "data_nascimento": "1990-05-15",
  "tipo": "user",
  "ativo": true,
  "data_cadastro": "2026-05-06T10:30:00.000Z",
  "criado_em": "2026-05-06T10:30:00.000Z",
  "atualizado_em": "2026-05-06T10:30:00.000Z"
}
```

## 🚀 Migração para Usuários Existentes

Para adicionar `data_cadastro` aos usuários que não possuem este campo:

```bash
cd backend
node migrations/add-data-cadastro.js
```

**Resultado:**
- Usuarios sem `data_cadastro` receberão a data atual
- Usuários que já possuem o campo não serão afetados

## 📝 Exemplos de Uso

### Criar usuário (com data_cadastro automática)
```bash
POST /api/users
Headers: Authorization: Bearer <admin-token>

Body:
{
  "nome_completo": "Maria Santos",
  "email": "maria@example.com",
  "senha": "senha123",
  "telefone": "11987654321",
  "data_nascimento": "1995-08-20"
}
```

### Listar usuários com data de cadastro
```bash
GET /api/users
Headers: Authorization: Bearer <admin-token>
```

**Retorno:** Array de usuários ordenados por data_cadastro (mais recentes primeiro)

### Buscar usuário por ID
```bash
GET /api/users/507f1f77bcf86cd799439011
Headers: Authorization: Bearer <admin-token>
```

### Atualizar dados do usuário
```bash
PUT /api/users/507f1f77bcf86cd799439011
Headers: Authorization: Bearer <admin-token>

Body:
{
  "nome_completo": "Maria Silva Santos",
  "email": "maria.silva@example.com",
  "telefone": "11998765432",
  "ativo": true
}
```

### Deletar usuário
```bash
DELETE /api/users/507f1f77bcf86cd799439011
Headers: Authorization: Bearer <admin-token>
```

## ⚙️ Detalhes Técnicos

### Campo data_cadastro
- **Tipo:** Date
- **Obrigatório:** Não (preenchido automaticamente)
- **Padrão:** `Date.now` (data/hora atual no momento do cadastro)
- **Editável:** Não (apenas leitura nos métodos CRUD)
- **Formato:** ISO 8601 (e.g., "2026-05-06T10:30:00.000Z")

### Validação e Segurança
- ✅ Requer autenticação admin para todas as operações CRUD
- ✅ Validação de email único
- ✅ Senha é hashada com bcrypt
- ✅ Senha não é retornada nas respostas da API
- ✅ Tipos de usuário são restritos (apenas "user" para usuários normais)

## 🔍 Teste de API

Usar a coleção Postman ou curl para testar as rotas:

```bash
# Listar usuários
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer <admin-token>"

# Buscar usuário específico
curl -X GET http://localhost:3000/api/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <admin-token>"

# Deletar usuário
curl -X DELETE http://localhost:3000/api/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <admin-token>"
```

## ✅ Checklist de Implementação

- ✅ Campo `data_cadastro` adicionado ao modelo
- ✅ Campo preenchido automaticamente na criação
- ✅ Métodos CRUD completos no controller
- ✅ Rotas CRUD implementadas
- ✅ Script de migração para dados existentes
- ✅ Autenticação admin em todas as rotas sensíveis
- ✅ Validações aplicadas
- ✅ Retorno de dados seguro (sem senha)
