# 💉 Gestor de Vacinação — Front-end (Mobile)

<div align="center">

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![React Native](https://img.shields.io/badge/React_Native-0.85-61DAFB?logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-56-000020?logo=expo&logoColor=white)
![React Navigation](https://img.shields.io/badge/React_Navigation-7-6B52AE)
![Axios](https://img.shields.io/badge/Axios-1.x-5A29E4?logo=axios&logoColor=white)

**Aplicativo mobile para gestão de campanhas e registros de vacinação, consumindo a API REST do back-end.**

</div>

---

## 📋 Sobre o Projeto

Aplicativo **React Native (Expo)** que consome a API do **Gestor de Vacinação**. Permite
cadastrar e gerenciar pacientes, profissionais, unidades, vacinas, lotes, atendimentos,
doses, registros de aplicação, campanhas, notificações e situação vacinal — com login por
token, validações em tela e seleção por listas/calendário (sem digitar IDs ou datas à mão).

Desenvolvido para a **Avaliação A3** da Unidade Curricular **Sistemas Distribuídos e
Mobile** — UniRitter / Ânima Educação. O foco é um app **simples, funcional e intuitivo**,
executável via **Expo Go**.

---

## 🏗️ Arquitetura

```
2026-1-SDM-Segunda-Noite-ZS-10-RN/
├── App.js                       # Raiz: AuthProvider + navegação
├── src/
│   ├── components/              # Componentes reutilizáveis
│   │   ├── CampoTexto.js        # Input de texto com erro/ajuda
│   │   ├── CampoData.js         # Seletor de data (calendário nativo)
│   │   ├── CampoHora.js         # Seletor de hora (relógio nativo)
│   │   ├── Seletor.js           # Dropdown que lista registros (em vez de ID)
│   │   └── formStyles.js        # Estilos e paleta de cores compartilhados
│   ├── contexts/
│   │   └── AuthContext.js       # Login, logout e token (AsyncStorage)
│   ├── hooks/
│   │   ├── useColecao.js        # Coleção para Seletor ({ valor, rotulo })
│   │   ├── useLista.js          # Lista de uma tela (trata paginação)
│   │   └── useMapaNomes.js      # Resolve ID -> nome nas listas
│   ├── navigation/
│   │   └── AppNavigator.js      # Stack; alterna entre Login e app
│   ├── screens/                 # Telas por módulo (List + Form)
│   │   ├── LoginScreen.js
│   │   ├── Home.js
│   │   ├── pessoas/  unidades/  vacinas/  perfis/  calendario/
│   │   ├── atendimentos/  registros/  campanhas/
│   │   └── notificacoes/  situacao/
│   └── services/
│       ├── api.js               # Axios + token + interceptor de 401
│       └── erros.js             # Mensagens de erro da API
├── app.json
└── package.json
```

---

## 🚀 Tecnologias

| Tecnologia | Versão | Finalidade |
|---|---|---|
| React Native | 0.85 | Framework mobile |
| Expo | 56 | Build e execução (Expo Go) |
| React Navigation | 7 | Navegação por stack |
| Axios | 1.x | Cliente HTTP para a API |
| AsyncStorage | 2.2 | Persistência do token de login |
| DateTimePicker | 9.1 | Seletor nativo de data e hora |

---

## 📱 Módulos / Telas

| Grupo | Telas |
|---|---|
| Cadastros | Pacientes, Profissionais, Unidades, Vacinas, Lotes |
| Atendimento | Perfis de Saúde, Calendário Vacinal, Atendimentos, Doses, Registros |
| Gestão | Campanhas, Notificações, Situação Vacinal |

Cada módulo tem uma tela de **lista** (com excluir) e um **formulário** de cadastro/edição.

---

## ⚙️ Configuração e Execução Local

### Pré-requisitos

- Node.js LTS instalado
- App **Expo Go** no celular (Android/iOS)
- Back-end rodando e acessível na mesma rede

### 1. Clonar e instalar

```bash
git clone https://github.com/anleaes/2026-1-SDM-Segunda-Noite-ZS-10-RN.git
cd 2026-1-SDM-Segunda-Noite-ZS-10-RN
npm install
```

### 2. Apontar para a API

O app lê a URL da API da variável `EXPO_PUBLIC_API_URL`. Use o **IP do computador**
que roda o back-end (não `localhost`, pois o celular não o enxerga):

```bash
# Windows (PowerShell)
$env:EXPO_PUBLIC_API_URL = "http://SEU_IP:8000/api"
```

> Sem a variável, o app usa `http://10.116.10.101:8000/api` (mobile) ou
> `http://127.0.0.1:8000/api` (web).

### 3. Iniciar o Expo

```bash
npx expo start
```

Escaneie o QR Code com o **Expo Go**. Na primeira vez após instalar dependências
nativas, limpe o cache: `npx expo start -c`.

### 4. Login

Use um usuário cadastrado no back-end (ex.: `professor` / `vacinas123`).

---

## 🔐 Autenticação

O login envia usuário/senha para `/api/auth/login/`, recebe um **token** e o guarda no
AsyncStorage. O token é enviado em todas as requisições (`Authorization: Token <token>`).
Ao receber `401`, o app encerra a sessão automaticamente e volta para a tela de login.

---

## 🔀 Padrão Git

Branching por feature com Pull Requests e Merges:

```
main
└── feat/<descrição-da-feature>
```

---

## 👥 Desenvolvedores

| Nome | GitHub | Responsabilidade |
|---|---|---|
| Guilherme Perlasca | [@guiperlasca](https://github.com/guiperlasca) | Setup, pessoas, unidades, vacinas, perfis |
| Fillipe Brito | [@FillipeBrito1](https://github.com/FillipeBrito1) | Calendario, atendimentos, registros |
| Daniel Chiaramonte | [@danielchiaramonte](https://github.com/danielchiaramonte) | Campanhas, notificacoes, situacao |

---

## 📄 Contexto Acadêmico

Disciplina: **Sistemas Distribuídos e Mobile** — UniRitter / Ânima Educação
Professor: **Antonio Leães** — Semestre 2026/1

Repositório back-end: [2026-1-SDM-Segunda-Noite-ZS-10](https://github.com/anleaes/2026-1-SDM-Segunda-Noite-ZS-10)
