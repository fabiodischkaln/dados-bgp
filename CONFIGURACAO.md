# Dados GBP — Guia de Configuração

## Estrutura do projeto

```
dados-gbp/
├── index.html        ← Portal web (seguro, sem chaves)
├── api/
│   └── suggest.js    ← Função serverless (IA para respostas)
├── vercel.json       ← Configuração da Vercel
├── .env.example      ← Modelo das variáveis de ambiente
├── .gitignore        ← Protege arquivos sensíveis
└── CONFIGURACAO.md   ← Este arquivo
```

---

## Passo 1 — Subir no GitHub

1. Crie um repositório público chamado `dados-gbp`
2. Faça upload de todos os arquivos desta pasta
3. **NUNCA crie um arquivo `.env` — use apenas as variáveis de ambiente da Vercel**

---

## Passo 2 — Configurar variáveis na Vercel

Após importar o repositório na Vercel, vá em:
**Settings → Environment Variables** e adicione cada variável:

| Nome da variável | Onde encontrar o valor |
|---|---|
| `FIREBASE_API_KEY` | Firebase → Configurações do projeto → Seus apps |
| `FIREBASE_AUTH_DOMAIN` | idem (ex: dados-gbp.firebaseapp.com) |
| `FIREBASE_PROJECT_ID` | idem (ex: dados-gbp) |
| `FIREBASE_STORAGE_BUCKET` | idem |
| `FIREBASE_MESSAGING_SENDER_ID` | idem |
| `FIREBASE_APP_ID` | idem |
| `ADMIN_EMAIL` | Seu e-mail de administrador |
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys |

---

## Passo 3 — Configurar regras de segurança no Firebase

No Firebase → Firestore → Regras, cole:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Apenas usuários autenticados acessam
    match /{document=**} {
      allow read, write: if request.auth != null;
    }

    // Clientes só veem seus próprios dados
    match /avaliacoes/{doc} {
      allow read: if request.auth != null &&
        resource.data.clienteEmail == request.auth.token.email;
    }

    match /alertas/{doc} {
      allow read: if request.auth != null &&
        resource.data.clienteEmail == request.auth.token.email;
    }

    match /metricas/{doc} {
      allow read: if request.auth != null &&
        resource.data.clienteEmail == request.auth.token.email;
    }
  }
}
```

---

## Passo 4 — Criar seu usuário admin

No Firebase → Authentication → Usuários → Adicionar usuário:
- E-mail: seu e-mail (o mesmo que colocou em ADMIN_EMAIL)
- Senha: uma senha forte

---

## Passo 5 — Criar usuário para cada cliente

Para cada cliente, repita no Firebase → Authentication → Adicionar usuário:
- E-mail: e-mail do cliente
- Senha: senha inicial (pode ser simples, o cliente poderá trocar depois)

Depois no portal, acesse como admin → Clientes → Novo Cliente → preencha os dados.

---

## Pronto!

Seu portal estará disponível em `https://dados-gbp.vercel.app`
