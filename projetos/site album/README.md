# Nosso Álbum — GitHub Pages + Worker + JSON no GitHub

Esse projeto entrega um site bonito de álbuns com:

- login por usuário e senha
- criação e exclusão de álbuns
- upload de foto e vídeo
- visualização em tela cheia
- botão para baixar arquivo
- exclusão de foto, vídeo e álbum
- armazenamento em JSON no GitHub
- mídia salva no próprio repositório GitHub
- acesso compartilhado para você e sua namorada

## Arquitetura real que funciona

**Importante:** um site puro no GitHub Pages **não consegue gravar arquivos e JSON com segurança sozinho**.

Por isso, a solução foi feita assim:

- **Frontend**: GitHub Pages
- **Banco simples**: `data/db.json` dentro de um repositório GitHub
- **Arquivos**: pasta `storage/...` no mesmo repositório GitHub
- **Backend seguro**: Cloudflare Worker, que grava no GitHub pela API

Assim você mantém o **armazenamento no GitHub em JSON**, mas sem expor seu token GitHub no navegador.

---

## Estrutura

```bash
frontend/              # site estático
worker/                # backend Cloudflare Worker
scripts/hash-password.mjs
data/db.example.json   # modelo inicial do banco JSON
```

---

## 1) Criar o repositório de armazenamento

Crie um repositório no GitHub, por exemplo:

```bash
album-storage
```

Dentro dele, crie:

```bash
data/db.json
```

Copie o conteúdo de `data/db.example.json` para esse arquivo.

---

## 2) Gerar o hash das senhas

No terminal:

```bash
node scripts/hash-password.mjs suaSenhaAqui
```

Faça isso para cada senha e troque `TROQUE_PELO_HASH` dentro de `data/db.json`.

Exemplo final:

```json
{
  "users": [
    {
      "username": "voce",
      "displayName": "Você",
      "passwordHash": "HASH_1"
    },
    {
      "username": "ela",
      "displayName": "Sua Namorada",
      "passwordHash": "HASH_2"
    }
  ],
  "albums": []
}
```

---

## 3) Criar token do GitHub

Crie um **Fine-grained Personal Access Token** com permissão de:

- Contents: Read and Write

Esse token será usado só no Worker, nunca no frontend.

---

## 4) Configurar o Worker

Entre na pasta do worker:

```bash
cd worker
npm install
```

Edite `wrangler.toml` e troque:

- `GITHUB_OWNER`
- `GITHUB_REPO`
- `PUBLIC_MEDIA_BASE`

Exemplo:

```toml
GITHUB_OWNER = "seuusuario"
GITHUB_REPO = "album-storage"
GITHUB_BRANCH = "main"
PUBLIC_MEDIA_BASE = "https://raw.githubusercontent.com/seuusuario/album-storage/main"
```

Agora configure os segredos:

```bash
npx wrangler secret put GITHUB_TOKEN
npx wrangler secret put AUTH_SECRET
```

- `GITHUB_TOKEN`: seu token do GitHub
- `AUTH_SECRET`: uma senha longa aleatória para assinar sessões

Depois publique:

```bash
npm run deploy
```

O Wrangler vai te dar uma URL parecida com:

```bash
https://album-github-worker.seu-subdominio.workers.dev
```

---

## 5) Configurar o frontend

Abra `frontend/app.js` e troque:

```js
const API_BASE = 'https://SEU-WORKER.exemplo.workers.dev';
```

pela URL real do seu Worker.

---

## 6) Publicar no GitHub Pages

Suba a pasta `frontend` em outro repositório, por exemplo:

```bash
nosso-album-site
```

Depois ative o GitHub Pages apontando para a pasta raiz ou `/docs`.

Se quiser usar essa estrutura exatamente como está, basta publicar os arquivos de `frontend/` na raiz do repositório do site.

---

## 7) Como funciona no uso

- você entra com usuário e senha
- cria um álbum
- abre o álbum
- envia foto ou vídeo
- o Worker grava:
  - o arquivo em `storage/...`
  - o registro no `data/db.json`
- qualquer pessoa com login vê tudo atualizado

---

## Limitações importantes

### Privacidade
Se o repositório de mídia for público, quem tiver o link direto do arquivo consegue abrir.

Para um álbum realmente privado, o ideal é:

- repositório privado
- servir mídia pelo Worker em rota protegida

Eu deixei a versão mais simples e prática para subir rápido.

### Tamanho de arquivo
GitHub não é ideal para vídeos grandes. Para muitos vídeos pesados, o melhor seria Cloudinary, Supabase Storage ou R2.

---

## Melhorias fáceis de adicionar depois

- capa personalizada por álbum
- comentários nas mídias
- curtidas
- campo de data especial
- filtro por foto ou vídeo
- modo romântico com fundo de fotos do casal
- álbum com senha separada

