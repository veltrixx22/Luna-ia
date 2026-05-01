# Luna AI

Luna AI é um app web/PWA mobile-first para acompanhar ciclo menstrual, sintomas, histórico e previsões estimadas. O projeto não usa login, Firebase, Supabase, Prisma, PostgreSQL, MongoDB ou qualquer banco externo.

Todos os dados ficam salvos no próprio aparelho da usuária usando IndexedDB.

## Stack

- React + Vite
- TypeScript
- CSS puro premium/mobile-first
- IndexedDB nativo
- PWA com `manifest.json`, service worker e tela offline
- Assistente Luna AI local com respostas educativas e seguras

## Instalar dependências

```bash
npm install
```

## Rodar localmente

```bash
npm run dev
```

Acesse o endereço que aparecer no terminal, geralmente:

```bash
http://localhost:5173
```

## Build de produção

```bash
npm run build
```

## Preview do build

```bash
npm run preview
```

## Deploy na Vercel

1. Envie este projeto para um repositório no GitHub.
2. Entre na Vercel.
3. Clique em **Add New Project**.
4. Selecione o repositório da Luna AI.
5. Framework preset: **Vite**.
6. Build command: `npm run build`.
7. Output directory: `dist`.
8. Deploy.

O arquivo `vercel.json` já inclui rewrite para as rotas do app funcionarem ao recarregar páginas como `/dashboard`, `/cycle` e `/ai`.

## Como os dados locais funcionam

O app cria um banco local chamado:

```txt
luna_ai_local_db
```

Stores criadas no IndexedDB:

- `profile`
- `cycles`
- `symptomLogs`
- `aiMessages`
- `settings`

Os dados persistem ao fechar e abrir o app no mesmo navegador/aparelho. Porém, se a usuária limpar os dados do navegador, trocar de aparelho ou desinstalar o app, os dados podem ser perdidos.

## Instalar como app no celular

No Android/Chrome:

1. Abra a URL do app.
2. Toque no menu do navegador.
3. Escolha **Adicionar à tela inicial** ou use o botão **Instalar no celular** dentro da tela de configurações.

O PWA possui:

- `manifest.json`
- ícones 192x192 e 512x512
- `theme_color`
- service worker
- página offline
- tags mobile/Apple no `index.html`

## Backup: exportar e importar

A usuária pode exportar um arquivo JSON com:

- perfil
- ciclos
- sintomas
- mensagens da Luna AI
- configurações

Nome do arquivo:

```txt
luna-ai-backup-YYYY-MM-DD.json
```

Na importação, o app valida a estrutura do arquivo e pede confirmação antes de substituir os dados atuais.

## Aviso importante sobre privacidade

Os dados são armazenados apenas no dispositivo/navegador da usuária. A Luna AI não envia registros para banco externo.

Use a opção de exportar backup para guardar uma cópia segura.

## Aviso médico

A Luna AI oferece informações educativas e estimativas com base nos dados informados. Ela não substitui médicos, exames, diagnósticos ou tratamentos profissionais.

Em casos de dor intensa, sangramento anormal, suspeita de gravidez, desmaio, febre, sintomas de infecção ou qualquer urgência, procure atendimento médico.
