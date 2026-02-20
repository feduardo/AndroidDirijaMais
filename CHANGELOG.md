# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Planejado

- Telas de autenticação (Login/Register)
- Navegação entre telas
- Design system base
- Backend inicial

---

## [0.1.0] - 2025-12-08

### Adicionado

- Estrutura inicial do projeto React Native 0.82.1
- Arquitetura Clean Architecture (Domain/Infrastructure/Presentation)
- Configuração de ambiente de desenvolvimento
  - Node.js 24.x
  - VSCode com extensões essenciais
  - Prettier + ESLint
  - Android SDK
- Dependências core instaladas
  - React Navigation
  - Zustand (state management)
  - Axios (HTTP client)
  - React Native Encrypted Storage
  - Google Sign-In
- Camada de Domínio
  - Entity: User, UserRole
  - Repository interface: IAuthRepository
  - Use Cases: LoginUseCase, GoogleLoginUseCase
- Camada de Infraestrutura
  - HTTP Client com interceptors
  - Auto-refresh de tokens (401 handler)
  - SecureStorage (armazenamento criptografado)
  - AuthRepository (implementação)
- Camada de Apresentação
  - AuthStore (Zustand)
  - Hook customizado: useAuth
  - Classes de erro customizadas
- Documentação
  - SECURITY_CHECKLIST.md
  - ROADMAP.md
  - CHANGELOG.md (este arquivo)
- Configuração de segurança
  - Tokens armazenados com criptografia
  - Configuração por ambiente (dev/prod)
  - Validação client-side

### Segurança

- Implementado armazenamento seguro de tokens (EncryptedStorage)
- Auto-refresh de JWT em respostas 401
- Nenhuma credencial hardcoded
- Logs sanitizados (sem tokens/senhas)
- Configuração separada por ambiente

### Infraestrutura

- Conexão via WiFi com device físico (ADB)
- Gradle 9.0.0 configurado
- Java 17 configurado
- Android NDK instalado
- Metro Bundler funcionando

---

## [0.0.1] - 2025-12-08

### Adicionado

- Inicialização do projeto
- Estrutura de pastas criada
- Configuração inicial do Git

---

## Tipos de Mudanças

- `Adicionado` para novas funcionalidades
- `Modificado` para mudanças em funcionalidades existentes
- `Depreciado` para funcionalidades que serão removidas
- `Removido` para funcionalidades removidas
- `Corrigido` para correções de bugs
- `Segurança` para vulnerabilidades corrigidas

---

**Formato de Data:** AAAA-MM-DD (ISO 8601)

## [0.2.0] - 2025-12-09

### Adicionado

- **Design System Base**
  - Paleta de cores definida (Primary, Secondary, Error, Warning, Text)
  - Sistema de sombras cross-platform (iOS/Android)
  - Tipografia padronizada (React Native Paper variants)
  - Configuração de tema global (paperTheme.ts)
- **Interface do Usuário**
  - HomeScreen Guest completa
    - Header com localização e botão de login
    - Logo DirijaMais
    - Barra de busca funcional
    - Grid 2x2 de ações rápidas (Primeira Habilitação, Curso Teórico, Aulas Práticas, Instrutores)
    - Lista horizontal de instrutores recomendados
  - Componente InstructorCard
    - Avatar, nome, categoria, avaliação
    - Preço por hora
    - Ícones visuais (estrela, carro)
    - Estilo responsivo e reutilizável

- **Bibliotecas**
  - React Native Paper 5.x (Material Design)
  - React Native Vector Icons (MaterialCommunityIcons)
  - Babel Module Resolver (aliases @/)

### Modificado

- Estrutura de pastas reorganizada
  - `src/presentation/screens/guest/` (telas sem autenticação)
  - `src/presentation/screens/auth/` (telas de login)
  - `src/presentation/components/` (componentes reutilizáveis)
  - `src/presentation/theme/` (design system)

- App.tsx refatorado para usar PaperProvider

### Corrigido

- Conflito de tipos com react-native-vector-icons
- Importações de módulos (@/ paths)
- Cache do TypeScript (tsconfig.json + babel.config.js)
- Export/import de componentes (barrel exports)

### Técnico

- TypeScript paths configurados com babel-plugin-module-resolver
- Cross-platform shadows (Platform.OS === 'ios')
- Tipagem completa em todos os componentes

## [0.3.0] - 2025-12-13

### Adicionado

- **Navegação Completa**
  - React Navigation configurado (Stack Navigator)
  - RootNavigator com navegação entre Home e Login
  - GuestStack para telas sem autenticação
  - AuthStack para telas de autenticação
  - Navegação do botão "Entrar" (header) → LoginScreen
  - Botão "Voltar" no LoginScreen com SafeAreaInsets

- **LoginScreen Completa**
  - Campos de email e senha (TextInput do React Native Paper)
  - Validação visual de campos
  - Botão "Entrar" com loading state
  - Link "Esqueci minha senha"
  - Divisor "ou"
  - Botão "Entrar com Google" (preparado para integração)
  - Mock de login (setTimeout simulando API)
  - Ícones nos inputs (email-outline, lock-outline)

- **Melhorias na HomeScreen**
  - Ajuste de espaçamento (seção instrutores menos espaçada)
  - Título alterado de "Instrutores perto de você" para "Instrutores Mais Indicados"
  - Navegação funcional do header para LoginScreen

### Bibliotecas Adicionadas

- `@react-navigation/native` ^7.1.24
- `@react-navigation/stack` ^7.6.12
- `@react-navigation/bottom-tabs` ^7.8.12
- `react-native-screens` ^4.18.0
- `react-native-safe-area-context` ^5.6.2
- `react-native-gesture-handler` (dependência do Navigation)

### Técnico

- TypeScript types para navegação (ParamLists)
- SafeAreaInsets para status bar/notch
- CompositeNavigationProp para navegação aninhada
- Loading states em formulários
- Gesture Handler configurado globalmente (App.tsx)

### Corrigido

- Erro de navegação aninhada (RNGestureHandlerModule)
- Tipos de navegação entre stacks
- Cache do TypeScript após adicionar Navigation
- Redundância semântica no título da seção de instrutores

✨ Home (Tela Inicial)

Estrutura completa da HomeScreen implementada

Header com localização e acesso ao login

Logo centralizada com hierarquia visual ajustada

Barra de busca funcional (Searchbar)

Grid de Ações Rápidas:

Primeira Habilitação

Curso Teórico

Aulas Práticas

Instrutores Próximos

Seção “Instrutores Mais Indicados” criada

Lista horizontal com cards reutilizáveis (InstructorCard)

Ajustes finos de espaçamento e hierarquia visual

Remoção de redundância conceitual (“perto de você” vs “indicados”)

🧩 Componentização

Criação do componente InstructorCard

Avatar, nome, categoria, avaliação e preço/hora

Estilização consistente com o design system

Exportação correta via presentation/components/index.ts

Organização de imports e tipagem com TypeScript

🎨 Design & UX

Ajustes de espaçamento entre seções (grid → lista)

Refinamento visual para manter fluxo natural da tela

Decisão consciente sobre uso da logo (presente onde não compete com conteúdo)

Linguagem clara e amigável para títulos e seções

🔐 Login

Implementação completa da LoginScreen

Inputs de e-mail e senha

Botão “Entrar”

Link “Esqueci minha senha”

Login com Google (ícone customizado em vermelho)

Uso de SafeAreaInsets para posicionamento correto

Botão de voltar funcional

Estrutura preparada para futura integração com API

Navegação para Register prevista (rota ainda não criada, sem impacto no build)

🧭 Navegação

Configuração inicial do React Navigation

NavigationContainer

GuestStack

Simplificação do RootNavigator para evitar dependências inexistentes

Tipagem correta com NativeStackNavigationProp

🛠️ Infra / Build

Instalação e uso de dependências confiáveis:

react-native-vector-icons

react-native-gesture-handler

react-native-safe-area-context

@react-navigation/\*

Correção de warnings de ESLint (componentes não definidos dentro do render)

Build Android executado com sucesso

App instalado e rodando em dispositivo físico via ADB

✅ Estado Atual

UI base sólida e consistente

Arquitetura preparada para:

Autenticação real

Cadastro (Register)

Listagem dinâmica de instrutores

Regras de negócio do novo modelo sem autoescola

## [0.4.0] - 2025-12-14

### Adicionado

- **RegisterScreen Completa**
  - Formulário de cadastro com 7 campos validados
  - Máscaras automáticas para CPF (###.###.###-##) e Telefone ((##) #####-####)
  - Validação inline com feedback por campo
  - Validação de CPF algorítmica (dígitos verificadores)
  - Validação de senha forte (8+ chars, maiúscula, minúscula, número, especial)
  - Toggle "olho" para visualizar senha digitada
  - Checkbox obrigatório de termos de uso e política de privacidade
  - Links clicáveis nos termos (preparados para telas futuras)
  - Navegação bidirecional: Login ↔ Register
  - Scroll automático para campos com erro
  - Integração completa com useAuth.register()

- **Utilities (Shared Layer)**
  - `src/utils/validators.ts`
    - `validateEmail()`: regex RFC 5322
    - `validateCPF()`: validação completa com dígitos verificadores
    - `validatePhone()`: 10-11 dígitos
    - `validatePassword()`: retorna { isValid, errors[] }
  - `src/utils/formatters.ts`
    - `formatCPF()`: aplica máscara em tempo real
    - `formatPhone()`: aplica máscara (31) 97115-1399
    - `removeMask()`: limpa formatação para envio à API

- **Domain Layer - Register**
  - `RegisterData.entity.ts`: interface com validador
  - `RegisterUseCase.ts`: orquestração do fluxo de registro
  - Sincronização com `IAuthRepository.RegisterData`

- **Infrastructure - Mock API**
  - Mock interceptor em `httpClient` para `/auth/register`
  - Simula validações de backend:
    - Email duplicado (existente@test.com)
    - CPF duplicado (11111111111)
  - Delay de 2s para simular latência real
  - Retorna AuthResponse com user + token

- **StudentStack (Autenticado)**
  - `DashboardScreen` com foco em ações (não em dados cadastrais)
  - Saudação personalizada: "Olá, {primeiro_nome} 👋"
  - Cards principais:
    - 📅 Próxima Aula (empty state: "Nenhuma aula agendada")
    - 📈 Progresso (0 / 20 aulas realizadas)
    - 💳 Créditos (R$ 0,00)
  - Ações Rápidas:
    - Ver Instrutores
    - Histórico de Aulas
    - Meu Perfil
  - Botão logout funcional (retorna para GuestStack)
  - Design limpo focado em CTAs

- **Navegação Autenticada**
  - `StudentStack.tsx`: stack para alunos autenticados
  - `RootNavigator` com lógica de alternância:
    - `!isAuthenticated` → GuestStack
    - `isAuthenticated` → StudentStack
  - Redirecionamento automático após login/registro bem-sucedido
  - useAuthStore integrado ao fluxo de navegação

- **Hooks - useAuth**
  - Método `register()` adicionado
  - Tratamento de erros com feedback ao usuário
  - Estado de loading durante registro
  - Salvamento automático de user + token após sucesso

### Modificado

- **GuestStack**
  - Adicionada rota `Register`
  - Export de `RegisterScreen` no barrel

- **RegisterData Interface**
  - Consolidada em único local (IAuthRepository)
  - Removida duplicação na entity
  - Criado `RegisterFormData` estendendo com campos UI-only (confirmPassword, acceptedTerms)

- **httpClient Interceptor**
  - Adicionado mock para POST `/auth/register`
  - Flag `MOCK_ENABLED` para facilitar desativação futura
  - Comentários indicando remoção quando backend estiver pronto

### Técnico

- TypeScript strict mode respeitado em todas validações
- Radix explícito em `parseInt()` (base 10)
- Imports relativos corrigidos (`../../../utils/`)
- Error handling granular por campo
- State management otimizado (erros por campo, não global)

### UX/UI

- Feedback visual imediato em campos inválidos
- Mensagens de erro contextuais e amigáveis
- Loading state em botão "Criar Conta"
- Dashboard com linguagem próxima ao usuário ("Pronto para sua próxima aula?")
- Empty states explicativos ("Nenhuma aula agendada")

### Segurança

- CPF e telefone formatados no frontend, enviados sem máscara ao backend
- Senha nunca armazenada em plaintext (validada e enviada via HTTPS futuro)
- Validação client-side + backend (defense in depth)
- Mock simula rate limiting com delay

### Documentação

- ROADMAP.md atualizado (Fase 3 parcialmente concluída)
- CHANGELOG.md atualizado (este registro)
- Código comentado indicando TODOs e áreas temporárias

---

## [0.3.0] - 2025-12-13

## [0.5.0] - 2025-12-15

### Adicionado

- **Estrutura de Dados - Instrutores**
  - Entity: `Instructor.entity.ts` completa
    - Campos obrigatórios: id, name, avatar, category, rating, pricePerHour
    - Campos opcionais: bio, experience, totalClasses, vehicleModel, vehicleYear, location, specialties, available
  - Mock centralizado: `mockInstructors.ts`
    - 3 instrutores com dados completos
    - Reutilizável em todas as telas
    - Preparado para substituição por API

- **InstructorDetailScreen**
  - Tela completa de detalhes do instrutor
  - Layout profissional com:
    - Avatar grande (120x120)
    - Badge de categoria
    - Stats (rating, experiência, aulas dadas)
    - Biografia completa
    - Especialidades em chips
    - Informações de veículo
    - Localização
    - Preço destacado
  - Footer fixo com CTA "Agendar Aula"
  - Error handling (instrutor não encontrado)
  - Navegação via params: `{ instructorId: string }`

- **ForgotPasswordScreen**
  - Tela de recuperação de senha
  - Campo de email com validação
  - Mock de envio de link (2s delay)
  - Tela de sucesso com feedback visual
  - Ícone de confirmação (email-check-outline)
  - Mensagem personalizada com email destacado
  - CTA "Voltar ao Login"

- **AccountRecoveryScreen (LGPD compliant)**
  - Recuperação manual de conta sem automação de dados sensíveis
  - Formulário com 5 campos validados:
    - Nome completo
    - CPF (com máscara automática)
    - E-mail sem acesso
    - Telefone (com máscara)
    - Motivo da solicitação
  - Validação completa (CPF algorítmica, email, telefone)
  - Mock de solicitação (2s delay)
  - Fluxo de segurança:
    - Solicitação enviada para equipe
    - Resposta em até 24 horas
    - Contato via SMS/WhatsApp
  - Tela de sucesso com prazo de atendimento
  - Info box explicativo do processo

### Modificado

- **HomeScreen**
  - Refatorada para usar `MOCK_INSTRUCTORS.map()`
  - Substituiu instrutores hardcoded
  - Mantém visual idêntico
  - Preparada para paginação futura

- **InstructorCard**
  - Agora clicável via `onPress` prop
  - Navega para `InstructorDetail` com `instructorId`
  - Accessibility labels adicionados

- **GuestStack**
  - Adicionadas rotas:
    - `ForgotPassword: undefined`
    - `AccountRecovery: undefined`
    - `InstructorDetail: { instructorId: string }`

- **Design System (colors.ts)**
  - Adicionada cor `success: '#4CAF50'`
  - Padronização de cores de status

- **LoginScreen**
  - Link "Esqueci minha senha" conectado à navegação
  - Navegação para ForgotPasswordScreen funcional

- **ForgotPasswordScreen**
  - Link "Não tenho mais acesso ao e-mail cadastrado" adicionado
  - Navegação para AccountRecoveryScreen
  - Variantes de texto ajustadas (bodyMedium ao invés de bodySmall)

### UX/UI

- Textos de links aumentados para melhor legibilidade
- Feedback visual consistente em todas as telas
- Loading states em todos os formulários
- Empty states com mensagens claras
- Telas de sucesso com CTAs direcionados

### Arquitetura

- Dados centralizados em `shared/data/mockInstructors.ts`
- Entities desacopladas da apresentação
- Navegação parametrizada (type-safe)
- Preparação para integração com API

### Segurança

- AccountRecoveryScreen segue princípios LGPD
- Não valida dados sensíveis automaticamente no app
- Fluxo manual de recuperação com validação humana
- Prazo de resposta transparente (24 horas)

### Documentação

- ROADMAP.md atualizado com:
  - Fase 3.7 (InstructorDetailScreen) completa
  - Fase 3.8 (Recuperação de Senha) completa
  - Próximas etapas: Sistema de Agendamento
  - Princípios de UX do agendamento
  - Estados padronizados de booking
- CHANGELOG.md atualizado (este registro)

### Próximos Passos

- Sistema de agendamento (MVP em 2-4 semanas)
- Telas de solicitação de aula
- Dashboard do instrutor
- Notificações push básicas
