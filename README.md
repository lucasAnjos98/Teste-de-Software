# 📚 BookShare - Plataforma de Compartilhamento de Livros

## 🎯 Sobre o Projeto

O BookShare é uma plataforma completa para compartilhamento de livros baseada em sistema de pontuação. Usuários podem doar livros para ganhar pontos e usar esses pontos para pegar livros emprestados de outros usuários.

## ⚙️ Funcionalidades Principais

### 🏠 Página Principal
- Sistema de busca por título do livro ou autor
- Cards de livros com informações do dono e avaliação
- Estatísticas da plataforma em tempo real
- Interface responsiva e moderna

### 👤 Perfil do Usuário
- Dashboard completo com estatísticas pessoais
- Sistema de níveis com progressão visual
- Histórico de livros doados e emprestados
- Registro detalhado de transações de pontos

### 📖 Cadastro de Livros
- Formulário intuitivo com upload de imagem
- Validação automática de +10 pontos
- Preview antes da publicação
- Interface amigável com feedback visual

### 💬 Sistema de Mensagens
- Chat em tempo real entre usuários
- Conversas organizadas por livro
- Interface similar a aplicativos de mensagens
- Notificações de novas mensagens

### ⭐ Sistema de Avaliações
- Avaliação de 1 a 5 estrelas
- Comentários opcionais
- Histórico completo de avaliações
- Sistema de reputação visível

### 🔐 Autenticação
- Login e cadastro seguros
- Validação de formulários
- Interface intuitiva com tabs
- Recuperação de senha

## 🎨 Design e Tecnologia

### Stack Tecnológico
- **Frontend**: Next.js 15 com TypeScript
- **Estilização**: Tailwind CSS + shadcn/ui
- **Banco de Dados**: Prisma ORM com SQLite
- **Componentes**: Biblioteca completa shadcn/ui
- **Ícones**: Lucide React
- **Estado**: React hooks e Zustand

### Sistema de Pontuação
- **Doação**: +10 pontos automáticos
- **Empréstimo**: -5 pontos com validação
- **Validação**: Saldo mínimo de 5 pontos exigido
- **Transações**: Registro completo para auditoria

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── api/              # API endpoints
│   │   ├── books/        # CRUD de livros
│   │   ├── borrow/       # Sistema de empréstimos
│   │   └── users/        # Gestão de usuários
│   ├── auth/             # Login e cadastro
│   ├── profile/          # Perfil do usuário
│   ├── add-book/         # Cadastro de livros
│   ├── messages/         # Sistema de chat
│   ├── rate/             # Avaliações
│   ├── landing/          # Página de apresentação
│   └── page.tsx          # Página principal
├── components/
│   └── ui/               # Componentes shadcn/ui
└── lib/
    ├── db.ts             # Configuração Prisma
    └── utils.ts          # Utilitários
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalação
```bash
# Descompactar o arquivo
tar -xzf bookshare-project.tar.gz
cd bookshare-project

# Instalar dependências
npm install

# Configurar banco de dados
npm run db:push

# Iniciar servidor de desenvolvimento
npm run dev
```

### Acessar a Aplicação
- **Página Principal**: http://localhost:3000
- **Landing Page**: http://localhost:3000/landing
- **Cadastro/Login**: http://localhost:3000/auth
- **Perfil**: http://localhost:3000/profile
- **Cadastrar Livro**: http://localhost:3000/add-book
- **Mensagens**: http://localhost:3000/messages
- **Avaliações**: http://localhost:3000/rate

## 📊 Banco de Dados

### Schema Principal
- **User**: Informações do usuário, pontos, avaliações
- **Book**: Livros cadastrados com status
- **Transaction**: Histórico de pontos
- **Borrowing**: Empréstimos ativos e concluídos
- **Message**: Mensagens entre usuários
- **Rating**: Avaliações entre usuários

### Relacionamentos
- Usuário → Livros (1:N)
- Usuário → Transações (1:N)
- Livro → Empréstimos (1:N)
- Empréstimo → Mensagens (1:N)

## 🎯 Funcionalidades Implementadas

✅ **Sistema Completo de Pontuação**
- Validação automática de saldo
- Transações seguras com rollback
- Histórico detalhado

✅ **Interface Responsiva**
- Mobile-first design
- Componentes adaptativos
- Navegação intuitiva

✅ **Validações e Segurança**
- Validação de formulários
- Proteção contra fraudes
- Sistema de reputação

✅ **Experiência do Usuário**
- Feedback visual em todas ações
- Loading states
- Mensagens de erro claras

## 📱 Screenshots da Aplicação

A aplicação inclui:
- Dashboard principal com busca
- Perfil completo com estatísticas
- Sistema de chat em tempo real
- Formulários intuitivos
- Design moderno e profissional

## 🔧 Desenvolvimento

### Comandos Úteis
```bash
npm run dev          # Iniciar desenvolvimento
npm run build        # Build para produção
npm run lint         # Verificar código
npm run db:push      # Atualizar schema
npm run db:studio    # Prisma Studio
```

### Estrutura de Componentes
- Componentes reutilizáveis shadcn/ui
- Tipagem TypeScript completa
- Código limpo e documentado

## 📄 Licença

Este projeto foi desenvolvido como demonstração das capacidades da plataforma BookShare.

---

**BookShare** - Compartilhando conhecimento, um livro de cada vez. 📚
