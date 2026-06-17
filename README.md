# eduardoccz.github.io

Portfólio pessoal estático hospedado no GitHub Pages.

## Visualizar localmente

Abra o arquivo `index.html` diretamente no browser. Nenhum servidor ou build step necessário.

> **Nota:** alguns browsers bloqueiam `fetch()` para arquivos locais (protocolo `file://`). Se os dados não carregarem, use uma extensão como *Live Server* no VS Code ou rode `python -m http.server` na raiz do projeto.

## Atualizar o currículo

Edite **somente** o arquivo `data/profile.json` e faça push para `main`. O GitHub Actions detectará o push e publicará automaticamente a nova versão.

```
data/profile.json  ←  único arquivo a editar
```

## Ativar o GitHub Pages (primeira vez)

1. Acesse **Settings → Pages** no repositório.
2. Em **Source**, selecione **GitHub Actions**.
3. Faça um push qualquer para `main` — o workflow `deploy.yml` cuidará do resto.
4. A URL do site aparecerá na seção Pages após o primeiro deploy.

## Estrutura do repositório

```
/
├── index.html                  página principal
├── style.css                   estilos (dark theme, responsivo)
├── main.js                     renderização dinâmica via fetch + DOM
├── data/
│   └── profile.json            ← EDITE AQUI para atualizar o currículo
├── .github/
│   └── workflows/
│       └── deploy.yml          deploy automático via GitHub Actions
└── README.md
```

## Estrutura do `profile.json`

| Campo | Tipo | Descrição |
|---|---|---|
| `name` | string | Nome completo |
| `title` | string | Cargo principal |
| `subtitle` | string | Linha de especialidades |
| `location` | string | Cidade / Estado |
| `email` | string | Email de contato |
| `linkedin` | string | URL do perfil LinkedIn |
| `github` | string | URL do perfil GitHub |
| `summary` | string | Parágrafo de apresentação |
| `experience` | array | Histórico de empregos (ver abaixo) |
| `education` | array | Formação acadêmica |
| `certifications` | array | Certificações |
| `skills` | object | Mapa de categorias → lista de tecnologias |
| `languages` | array | Idiomas e nível |

### Entrada de `experience`

```json
{
  "company": "Nome da Empresa",
  "role": "Cargo",
  "period": "Mês Ano – Mês Ano",
  "location": "Cidade, UF",
  "highlights": ["Conquista 1", "Conquista 2"],
  "skills": ["Java", "AWS", "Kafka"]
}
```

Entradas consecutivas com o mesmo `company` são agrupadas automaticamente na linha do tempo.
