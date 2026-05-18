# Yellow Focus

App de produtividade pessoal (tarefas, hábitos, pomodoro e notas) construído com React + TypeScript + Vite + Tailwind v4, com persistência em Firebase Firestore e fallback em localStorage.

## Rodando localmente

**Pré-requisitos:** Node.js 18+

1. Instalar dependências:
   ```
   npm install
   ```

2. (Opcional) Sobrescrever a configuração do Firebase via variáveis de ambiente — crie um arquivo `.env.local` na raiz:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   VITE_FIREBASE_DATABASE_ID=...
   ```
   Se não informar, usa o `firebase-applet-config.json`.

3. Rodar em modo dev:
   ```
   npm run dev
   ```
   Acesse http://localhost:3000

## Scripts

- `npm run dev` — servidor de desenvolvimento Vite
- `npm run build` — build de produção em `dist/`
- `npm run preview` — preview do build
- `npm run lint` — checagem de tipos TypeScript
- `npm run clean` — remove `dist/`

## Estrutura

```
src/
  components/   → CalendarView, TaskSection, HabitTracker, PomodoroTimer, NotesArea
  context/      → AppContext (estado global + auth)
  services/     → syncService (Firestore)
  lib/          → firebase (init)
```

## Deploy

Configurado para Vercel (ver `vercel.json`). Suba o repositório e configure as variáveis `VITE_FIREBASE_*` no painel do Vercel.

## Notas de segurança

- A autenticação atual é caseira: senhas são hasheadas com SHA-256 + salt antes de ir para o Firestore, mas o ideal é migrar para **Firebase Authentication** para ter MFA, recuperação de senha, sessões seguras e regras `request.auth`.
- As regras em `firestore.rules` foram apertadas (sem `list`/`delete`), mas ainda permitem leitura por email — para segurança completa é preciso passar a usar `request.auth.uid` após migrar para Firebase Auth.
