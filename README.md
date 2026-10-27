# OldModeno

Aplicativo para ajudar idosos a aprenderem a usar o smartphone com toques suaves e sem força desnecessária.

## Sobre o projeto

Este projeto foi desenvolvido com o apoio do **Google AI Studio**, que auxiliou na geração de código, estruturação da aplicação e integração com a API do Gemini.

O OldModeno é uma trilha de 5 desafios interativos focada em prática de toque suave para idosos, incluindo:

- Deslizar a tela para cima/baixo (Desafio 1)
- Segurar a barra (Desafio 2)
- Estourar bolhas (Desafio 3)
- Múltiplas bolhas (Desafio 4)
- Parque de brincadeiras livre (Desafio 5)

O progresso é salvo localmente no navegador, permitindo que o usuário retome de onde parou.

## Tecnologias utilizadas

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [@google/genai](https://www.npmjs.com/package/@google/genai) (Gemini AI)
- [Express](https://expressjs.com/)
- [lucide-react](https://lucide.dev/)
- [motion](https://motion.dev/)
- [dotenv](https://www.npmjs.com/package/dotenv)

## Como rodar na sua máquina

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- Uma chave de API do [Google AI Studio](https://aistudio.google.com/) (Gemini)

### Passo a passo

1. Clone este repositório:

```bash
git clone https://github.com/seu-usuario/oldModerno.git
cd oldModerno
```

2. Instale as dependências:

```bash
npm install
```

3. Crie o arquivo de variáveis de ambiente baseado no exemplo:

```bash
cp .env.example .env
```

4. Edite o arquivo `.env` e insira sua chave da Gemini:

```env
GEMINI_API_KEY="SUA_CHAVE_DA_GEMINI_AQUI"
APP_URL="http://localhost:3000"
```

5. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:3000`.

### Outros scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento na porta 3000 |
| `npm run build` | Gera a build de produção |
| `npm run preview` | Faz preview da build de produção |
| `npm run lint` | Executa a verificação de tipos do TypeScript |

## Estrutura do projeto

```
oldModerno/
├── src/
│   ├── main.tsx              # Ponto de entrada do React
│   ├── App.tsx               # Componente principal com navegação e desafios
│   ├── index.css             # Estilos globais
│   ├── constants.ts          # Temas e desafios
│   ├── types.ts              # Tipos TypeScript
│   ├── components/           # Componentes reutilizáveis
│   └── utils/                # Utilitários (storage, sons)
├── index.html                # HTML principal
├── vite.config.ts            # Configuração do Vite
├── tsconfig.json             # Configuração do TypeScript
├── package.json              # Dependências e scripts
├── .env.example              # Exemplo de variáveis de ambiente
└── metadata.json             # Metadados do projeto
```

## Licença

Este projeto está sob a licença MIT.

---

Feito com 💙 e Google AI Studio