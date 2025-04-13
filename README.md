# MechGear - Sistema de Gerenciamento para Oficinas Mecânicas

MechGear é um sistema web moderno e eficiente, desenvolvido para gerenciar oficinas mecânicas, oferecendo controle completo sobre clientes, ordens de serviço, serviços e equipamentos.

## 🚀 Funcionalidades

### **Gestão de Clientes, Pedidos, Equipamentos e Itens**
- Banco de dados de clientes, pedidos, equipamentos e itens.
- Gerenciamento dos dados de cada um.

### **Autenticação e Segurança**
- Login seguro com autenticação JWT.
- Controle de acesso baseado em roles (admin, usuário, etc.).
- Validação de token em todas as requisições.

## 🛠 Tecnologias Utilizadas

### **Frontend**
- **React** + **TypeScript**: Interface moderna e tipada.
- **Tailwind CSS**: Estilização rápida e responsiva.
- **Shadcn/ui**: Componentes reutilizáveis e acessíveis.
- **TanStack Query (React Query)**: Gerenciamento de estado assíncrono.
- **React Hook Form** + **Zod**: Formulários com validação robusta.
- **React Router**: Roteamento dinâmico e protegido.

### **Backend**
- **Spring Boot (Java)**: API robusta e escalável.
- **PostgreSQL**: Banco de dados relacional.
- **Autenticação JWT**: Segurança e controle de acesso.
- **API REST**: Comunicação eficiente entre frontend e backend.

## 📦 Instalação

### **Pré-requisitos**
- Node.js (versão 16 ou superior).
- Gerenciador de pacotes `npm` ou `yarn`.
- Backend configurado e rodando (Spring Boot).

### **Passos para Instalação**

1. Clone o repositório:
   ```bash
   git clone https://github.com/seuusuario/mechgear.git
   cd mechgear
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o arquivo `.env`:
   Crie um arquivo `.env` na raiz do projeto e configure as variáveis de ambiente, como a URL da API:
   ```
   REACT_APP_API_URL=http://localhost:8080/api
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

5. Acesse o sistema:
   Abra o navegador e acesse [http://localhost:8081](http://localhost:8081).

## 🧪 Testes

1. Execute os testes unitários:
   ```bash
   npm run test
   ```

2. Execute os testes de integração:
   ```bash
   npm run test:integration
   ```

## 📂 Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis
├── contexts/         # Contextos globais (Auth, Theme, etc.)
├── pages/            # Páginas do sistema (Login, Dashboard, etc.)
├── services/         # Configuração de APIs (Axios)
├── styles/           # Estilos globais
├── utils/            # Funções utilitárias
└── App.tsx           # Configuração principal do React
```

## 🤝 Contribuição

1. Faça um fork do projeto.
2. Crie uma branch para sua feature:
   ```bash
   git checkout -b minha-feature
   ```
3. Commit suas alterações:
   ```bash
   git commit -m "Adiciona minha nova feature"
   ```
4. Envie para o repositório remoto:
   ```bash
   git push origin minha-feature
   ```
5. Abra um Pull Request.

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.

---

Desenvolvido com ❤️ por [Seu Nome](https://github.com/seuusuario).