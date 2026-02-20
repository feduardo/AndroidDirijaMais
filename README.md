# 📱 AppDirijaMais

> Conectando alunos a instrutores de autoescola de forma simples e segura.

[![React Native](https://img.shields.io/badge/React%20Native-0.82.1-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## 🎯 Sobre o Projeto

AppDirijaMais é um aplicativo mobile que facilita a conexão entre alunos e instrutores de autoescola, permitindo:

- Busca de instrutores por localização e avaliação
- Agendamento de aulas práticas
- Sistema de avaliações e reviews
- Pagamento integrado
- Chat em tempo real

---

## 🏗️ Arquitetura

O projeto segue os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**:

```
src/
├── core/           # Configurações e constantes globais
├── domain/         # Regras de negócio (entities, use-cases, repositories)
├── infrastructure/ # Implementações (HTTP, storage, services)
├── presentation/   # UI (components, screens, navigation, state)
├── shared/         # Utilitários compartilhados
└── assets/         # Recursos estáticos
```

### Princípios Aplicados

- **SOLID**: Separação de responsabilidades
- **DRY**: Reutilização de código
- **Clean Code**: Código legível e manutenível
- **Dependency Injection**: Inversão de dependências
- **Repository Pattern**: Abstração de acesso a dados

---

## 🚀 Tecnologias

### Core

- **React Native 0.82.1** - Framework mobile
- **TypeScript 5.x** - Tipagem estática
- **Node.js 24.x** - Runtime JavaScript

### State Management

- **Zustand** - Gerenciamento de estado leve e performático

### Navegação

- **React Navigation** - Navegação entre telas

### Networking

- **Axios** - Cliente HTTP com interceptors

### Segurança

- **React Native Encrypted Storage** - Armazenamento seguro de tokens
- **JWT Auto-refresh** - Renovação automática de tokens

### Autenticação

- **Google Sign-In** - Login social

### Desenvolvimento

- **ESLint** - Linting
- **Prettier** - Formatação de código
- **TypeScript** - Type checking

### UI/UX

- **React Native Paper 5.x** - Material Design components
- **React Native Vector Icons** - Biblioteca de ícones (MaterialCommunityIcons)

---

## 📋 Pré-requisitos

- Node.js >= 24.x
- npm >= 11.x
- Android Studio (para Android)
- Java 17
- Android SDK
- Device físico ou emulador Android

---

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/AppDirijaMais.git
cd AppDirijaMais
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure variáveis de ambiente

Crie arquivo `.env.development`:

```env
API_URL=http://localhost:3000/api
API_TIMEOUT=30000
```

### 4. Configure Android SDK

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### 5. Inicie o Metro Bundler

```bash
npm start
```

### 6. Execute no Android

Em outro terminal:

```bash
npm run android
```

---

## 📱 Device Físico via WiFi

### Primeira conexão (USB necessário)

```bash
adb devices
adb tcpip 5555
```

### Conectar via WiFi

```bash
adb connect SEU_IP:5555
```

### Verificar conexão

```bash
adb devices
```

---

## 🧪 Testes

```bash
# Testes unitários
npm test

# Testes com coverage
npm run test:coverage

# Testes e2e
npm run test:e2e
```

---

## 📦 Build de Produção

### Android APK

```bash
cd android
./gradlew assembleRelease
```

APK gerado em: `android/app/build/outputs/apk/release/app-release.apk`

### Android Bundle (Play Store)

```bash
cd android
./gradlew bundleRelease
```

---

## 🔐 Segurança

O projeto implementa as seguintes medidas de segurança:

- ✅ Tokens armazenados com criptografia (EncryptedStorage)
- ✅ Auto-refresh de JWT em 401
- ✅ Nenhuma credencial hardcoded
- ✅ Validação client-side
- ✅ Logs sanitizados (sem dados sensíveis)
- ✅ Configuração por ambiente

Para mais detalhes, consulte [SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md)

---

## 📚 Estrutura de Pastas

```
AppDirijaMais/
├── android/                    # Código nativo Android
├── ios/                        # Código nativo iOS (futuro)
├── src/
│   ├── core/
│   │   ├── config/            # Configurações (env, api)
│   │   ├── constants/         # Constantes globais
│   │   ├── interceptors/      # HTTP interceptors
│   │   └── types/             # Types globais
│   ├── domain/
│   │   ├── entities/          # Entidades de negócio
│   │   ├── repositories/      # Interfaces de repositórios
│   │   └── use-cases/         # Casos de uso (regras de negócio)
│   ├── infrastructure/
│   │   ├── http/              # Cliente HTTP
│   │   ├── repositories/      # Implementações de repositórios
│   │   ├── storage/           # Armazenamento seguro
│   │   └── services/          # Serviços externos
│   ├── presentation/
│   │   ├── components/        # Componentes reutilizáveis
│   │   │   ├── InstructorCard.tsx
│   │   │   └── index.ts
│   │   ├── screens/           # Telas do app
│   │   │   ├── auth/          # Login, Register
│   │   │   ├── guest/         # HomeScreen (sem login)
│   │   │   ├── home/          # Home autenticada
│   │   │   ├── profile/       # Perfil usuário
│   │   │   ├── instructor/    # Detalhes instrutor
│   │   │   └── booking/       # Agendamento
│   │   ├── theme/             # Design System
│   │   │   ├── colors.ts      # Paleta de cores
│   │   │   ├── shadows.ts     # Sombras cross-platform
│   │   │   ├── paperTheme.ts  # Configuração Paper
│   │   │   └── index.ts       # Barrel export
│   │   ├── navigation/        # Configuração de rotas (futuro)
│   │   ├── state/             # State management (Zustand)
│   │   └── hooks/             # Custom hooks
│   ├── shared/
│   │   ├── utils/             # Funções utilitárias
│   │   ├── guards/            # Type guards
│   │   └── errors/            # Classes de erro
│   └── assets/                # Imagens, fonts, ícones
│       └── images/
│           └── logodirijamais.jpeg
├── babel.config.js            # Babel + module resolver
├── tsconfig.json              # TypeScript + paths
├── CHANGELOG.md               # Histórico de mudanças
├── ROADMAP.md                 # Planejamento do projeto
├── SECURITY_CHECKLIST.md      # Checklist de segurança
└── README.md                  # Este arquivo
```

---

## 🗺️ Roadmap

Consulte [ROADMAP.md](ROADMAP.md) para ver o planejamento detalhado.

### ✅ Concluído

- ✅ Estrutura Clean Architecture
- ✅ Design System base (cores, tipografia, sombras)
- ✅ HomeScreen Guest (busca + ações rápidas + lista instrutores)
- ✅ Componente InstructorCard reutilizável
- ✅ React Native Paper + Vector Icons configurados

### 🔄 Em Andamento

- [ ] LoginScreen completa
- [ ] React Navigation (AuthStack + MainStack)
- [ ] RegisterScreen

### 📋 Próximas Entregas

- [ ] Backend inicial (Hostinger)
- [ ] Tela de detalhes do instrutor
- [ ] Sistema de agendamento

### Próximas Entregas

- [ ] Telas de autenticação (Login/Register)
- [ ] Navegação completa
- [ ] Design system
- [ ] Backend inicial

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add: nova feature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 Convenção de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração de código
- `test:` Testes
- `chore:` Tarefas gerais

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.

---

## 👥 Equipe

- **Desenvolvedor Principal** - [Roberto Caldeira Flores Junior](https://github.com/seu-usuario)

---

## 📞 Contato

- Email: contato@dirijamais.com.br
- Website: [dirijamais.com.br](https://dirijamais.com.br)

---
