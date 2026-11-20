# MyClinic Web

Aplicação web do **MyClinic**, sistema de gestão para Microempreendedores Individuais (MEIs) da área da saúde. Consome a [MyClinic API](https://github.com/myclinicorg/myclinic-api).

Projeto acadêmico construído com Next.js seguindo a [documentação oficial](https://nextjs.org/docs) e a estrutura do curso [Next.js Learn](https://nextjs.org/learn/dashboard-app).

## Stack

- [Next.js 16](https://nextjs.org/docs) (App Router, Turbopack) e React 19
- TypeScript
- [Tailwind CSS 4](https://tailwindcss.com/docs)
- ESLint

## Pré-requisitos

- Node.js 20.9+
- [MyClinic API](https://github.com/myclinicorg/myclinic-api) rodando (por padrão em `http://localhost:3000`)

## Como rodar

```bash
npm install
cp .env.example .env
npm run dev
```

A aplicação sobe em `http://localhost:3001`.

## Variáveis de ambiente

| Variável | Descrição |
| --- | --- |
| `API_URL` | URL da MyClinic API, usada pelo servidor do Next.js |

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia em modo desenvolvimento |
| `npm run build` / `npm start` | Compila e executa a versão de produção |
| `npm run lint` | Lint (ESLint) |

## Estrutura

```
app/
  lib/   tipos, funções de leitura de dados, Server Actions, sessão e utilitários
  ui/    componentes de interface e estilos globais
proxy.ts protege as rotas da área logada
```

## Convenções

- Uma branch por implementação (`feat/`, `fix/`, `chore/`, `docs/`), integrada à `main` ao final.
- Commits em [Conventional Commits](https://www.conventionalcommits.org/pt-br), em português.
