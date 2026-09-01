# 🌿 Salvus — Desafio Fullstack

> Aplicação fullstack desenvolvida para o desafio técnico de **Pessoa Estagiária da Salvus**.

Uma aplicação web pequena e completa para gerenciamento do fluxo de autenticação, conectando **Frontend + Backend + Banco de Dados**.

---

🎥 Demonstração

![alt text](salvus.gif)

## 🚀 Funcionalidades

| Funcionalidade           | Status |
| ------------------------ | :----: |
| 👤 Cadastro de usuário   |    ✅   |
| 🔐 Login                 |    ✅   |
| 🛡️ Área autenticada     |    ✅   |
| 🚪 Logout                |    ✅   |
| 💾 Persistência no banco |    ✅   |
| 🔑 Senhas com hash       |    ✅   |
| 🎫 Autenticação JWT      |    ✅   |
| ✅ Validação de dados     |    ✅   |
| ⚠️ Tratamento de erros   |    ✅   |
| 📱 Interface responsiva  |    ✅   |

---

## 🏗️ Arquitetura

O projeto é dividido em duas aplicações principais:

```text
salvus/
│
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   │
│   └── src/
│       ├── controllers/
│       ├── generated/
│       ├── lib/
│       ├── middlewares/
│       ├── routes/
│       ├── schemas/
│       └── server.ts
│
└── frontend/
    ├── public/
    └── src/
        ├── pages/
        ├── services/
        ├── App.tsx
        └── main.tsx
```

### Fluxo

```text
┌──────────────┐
│   Frontend   │
│ React + Vite │
└──────┬───────┘
       │
       │ HTTP / JSON
       ▼
┌──────────────┐
│   Backend    │
│ Express + TS │
└──────┬───────┘
       │
       │ Prisma
       ▼
┌──────────────┐
│  PostgreSQL  │
└──────────────┘
```

---

# 🛠️ Tecnologias

## Frontend

* **React**
* **TypeScript**
* **Vite**
* **React Router**
* **CSS**

## Backend

* **Node.js**
* **TypeScript**
* **Express**
* **Prisma**
* **Zod**
* **bcrypt**
* **JSON Web Token**

## Banco de dados

* **PostgreSQL**

---

# 🔐 Autenticação

O fluxo de autenticação funciona da seguinte maneira:

```text
                ┌─────────────┐
                │  Cadastro   │
                └──────┬──────┘
                       │
                       ▼
                ┌─────────────┐
                │    Login    │
                └──────┬──────┘
                       │
                       │ JWT
                       ▼
                ┌─────────────┐
                │    Home     │
                │ Autenticada │
                └──────┬──────┘
                       │
                       │ Logout
                       ▼
                ┌─────────────┐
                │    Login    │
                └─────────────┘
```

### Senha

A senha fornecida pelo usuário **não é armazenada em texto puro**.

Antes de ser persistida no banco, ela passa pelo `bcrypt`, resultando em um hash.

```text
Senha
  │
  ▼
bcrypt
  │
  ▼
Hash
  │
  ▼
PostgreSQL
```

### Sessão

Após um login válido, o backend gera um **JWT** contendo a identificação do usuário.

As requisições protegidas enviam o token através do header:

```http
Authorization: Bearer TOKEN
```

---

# 📡 API

## Cadastro

```http
POST /auth/register
```

### Entrada

```json
{
  "name": "Ana",
  "email": "ana@example.com",
  "password": "Senha123456"
}
```

### Resposta

```json
{
  "user": {
    "id": 1,
    "name": "Ana",
    "email": "ana@example.com"
  }
}
```

O endpoint rejeita:

* Dados inválidos
* E-mail já cadastrado

---

## Login

```http
POST /auth/login
```

### Entrada

```json
{
  "email": "ana@example.com",
  "password": "Senha123456"
}
```

### Resposta

```json
{
  "session": "JWT_TOKEN",
  "user": {
    "id": 1,
    "name": "Ana",
    "email": "ana@example.com"
  }
}
```

Credenciais inválidas retornam:

```json
{
  "error": "Credenciais inválidas"
}
```

A mesma mensagem é utilizada independentemente de o e-mail ou a senha estarem incorretos.

---

## Usuário autenticado

```http
GET /auth/me
```

Header:

```http
Authorization: Bearer TOKEN
```

### Resposta

```json
{
  "user": {
    "id": 1,
    "name": "Ana",
    "email": "ana@example.com"
  }
}
```

Sem uma sessão válida:

```json
{
  "error": "Não autorizado"
}
```

---

## Logout

```http
POST /auth/logout
```

Header:

```http
Authorization: Bearer TOKEN
```

### Resposta

```json
{
  "message": "Logout realizado com sucesso"
}
```

---

# 🗄️ Banco de Dados

O projeto utiliza PostgreSQL.

A entidade principal é:

```text
users
│
├── id
├── name
├── email
├── password
├── createdAt
└── updatedAt
```

O campo `email` possui restrição de unicidade.

As alterações do banco são controladas através de **Prisma Migrations**, permitindo reproduzir a estrutura do banco em outro ambiente.

---

# ⚙️ Como executar

## Pré-requisitos

Antes de executar o projeto, tenha instalado:

* Node.js
* npm
* PostgreSQL
* Git

---

## 1. Clonar o repositório

```bash
git clone https://github.com/AllanSantanna/Desafio-Salvus.git
cd Desafio-Salvus
```

---

## 2. Backend

Entre na pasta:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Configure o arquivo `.env` utilizando o `.env.example` como referência.

### Variáveis de ambiente

| Variável | Descrição |
| --- | --- |
| `DATABASE_URL` | URL de conexão com o banco PostgreSQL |
| `JWT_SECRET` | Chave secreta utilizada para assinar os tokens JWT |

Exemplo:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/salvus"
JWT_SECRET="sua-chave-secreta"
```

Execute as migrations:

```bash
npx prisma migrate dev
```

Inicie o servidor:

```bash
npm run dev
```

Backend:

```text
http://localhost:3000
```

---

## 3. Frontend

Em outro terminal:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Execute:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🧪 Validação

O projeto foi testado através dos principais fluxos da aplicação:

### Cadastro

```text
Cadastro → Usuário criado → Login
```

### Login

```text
E-mail + senha
       ↓
   Backend
       ↓
   JWT gerado
       ↓
Área autenticada
```

### Proteção

Uma tentativa de acessar a área autenticada sem uma sessão válida é bloqueada e o usuário é redirecionado para o login.

### Logout

```text
Área autenticada
       ↓
     Sair
       ↓
     Login
```

---

# 🔒 Boas práticas

O projeto segue algumas práticas importantes:

* Senhas armazenadas utilizando hash com `bcrypt`
* Segredos mantidos em variáveis de ambiente
* `.env` ignorado pelo Git
* `.env.example` disponibilizado para configuração
* Validação de entrada utilizando Zod
* E-mail único no banco de dados
* Mensagem genérica para credenciais inválidas
* Rotas autenticadas protegidas por JWT
* Migrations versionadas
* Separação entre controllers, routes, schemas e middlewares

---

# 📁 Configuração

O arquivo `.env` contém informações sensíveis e **não deve ser versionado**.

O projeto possui:

```text
.env
.env.example
.gitignore
```

O `.env.example` serve como modelo para configurar o ambiente local.

---

# 🔮 Melhorias futuras

Com mais tempo, algumas melhorias poderiam ser adicionadas:

* Testes automatizados
* Testes de integração
* Refresh tokens
* Cookies HTTP-only para sessão
* Documentação da API com Swagger/OpenAPI
* Deploy do frontend
* Deploy do backend
* CI/CD
* Monitoramento e logging estruturado

---

# 📌 Decisões técnicas

A escolha das tecnologias priorizou simplicidade, produtividade e facilidade de manutenção.

### TypeScript

Utilizado tanto no frontend quanto no backend para aumentar a segurança durante o desenvolvimento através da tipagem estática.

### React + Vite

Escolhidos para criar uma interface simples, rápida e componentizada.

### Express

Utilizado para criar uma API HTTP pequena e objetiva, adequada ao escopo do desafio.

### PostgreSQL

Escolhido por ser um banco relacional robusto e adequado para armazenar os usuários da aplicação.

### Prisma

Utilizado como ORM para facilitar o acesso ao banco e manter as alterações de schema versionadas através de migrations.

### Zod

Utilizado para validação dos dados recebidos pela API.

### bcrypt

Utilizado para armazenar as senhas de forma segura através de hash.

### JWT

Utilizado como mecanismo de sessão para identificar o usuário nas requisições protegidas.

---

# 👨‍💻 Autor

**Allan**

Projeto desenvolvido como parte do processo seletivo para Estágio.

---