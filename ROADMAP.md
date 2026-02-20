# 🗺️ Roadmap - AppDirijaMais

## 📱 Visão Geral

Aplicativo mobile para conectar alunos a instrutores de autoescola, facilitando agendamento de aulas práticas.

---

## ✅ Fase 1: Fundação (Concluída - 08/12/2025)

### Ambiente de Desenvolvimento

- ✅ Node.js 24.x instalado
- ✅ React Native 0.82.1 configurado
- ✅ Android SDK configurado
- ✅ VSCode com extensões essenciais
- ✅ Prettier + ESLint configurados
- ✅ Device físico conectado via WiFi (ADB)

### Estrutura do Projeto

- ✅ Clean Architecture implementada
- ✅ Pastas organizadas por domínio (DDD)
- ✅ Separação de concerns (Domain/Infrastructure/Presentation)

### Dependências Core

- ✅ React Navigation (navegação)
- ✅ Zustand (state management)
- ✅ Axios (HTTP client)
- ✅ EncryptedStorage (tokens seguros)
- ✅ Google Sign-In integrado

### Camada de Domínio

- ✅ Entities: User, UserRole
- ✅ Repositories: IAuthRepository
- ✅ Use Cases: LoginUseCase, GoogleLoginUseCase

### Camada de Infraestrutura

- ✅ HTTP Client com interceptors
- ✅ Auto-refresh de tokens (401 handler)
- ✅ SecureStorage (singleton pattern)
- ✅ AuthRepository (implementação)

### Camada de Apresentação

- ✅ AuthStore (Zustand)
- ✅ useAuth hook customizado
- ✅ Error handling estruturado

### Segurança

- ✅ Tokens criptografados
- ✅ Nenhuma credencial hardcoded
- ✅ Validação client-side
- ✅ Configuração por ambiente

---

## ✅ Fase 2: Interface do Usuário e Navegação (CONCLUÍDA - 13/12/2025)

### Design System ✅

- ✅ Paleta de cores (Primary, Secondary, Error, Warning, Text)
- ✅ Sistema de sombras cross-platform
- ✅ Tipografia padronizada (React Native Paper)
- ✅ Tema global configurado (paperTheme.ts)
- ✅ Barrel exports para tema (@/presentation/theme)
- ✅ DESIGN_SYSTEM.md documentado

### Componentes Base ✅

- ✅ InstructorCard (avatar, rating, categoria, preço)
- ✅ Inputs (React Native Paper TextInput)
- ✅ Buttons (contained + outlined)
- ✅ Loading states

### Navegação ✅

- ✅ React Navigation Stack configurado
- ✅ RootNavigator (coordena stacks)
- ✅ GuestStack (Home sem autenticação)
- ✅ AuthStack (Login, Register, ForgotPassword)
- ✅ Navegação funcional entre Home ↔ Login
- ✅ SafeAreaInsets para status bar
- ✅ Gesture Handler configurado

### Telas Implementadas ✅

- ✅ **HomeScreen Guest**
  - Header com localização + botão login funcional
  - Logo DirijaMais
  - Searchbar
  - Grid 2x2 ações rápidas
  - Lista horizontal "Instrutores Mais Indicados" (mock data)
  - Navegação para LoginScreen
- ✅ **LoginScreen Completa**
  - Campos email/senha com ícones
  - Validação visual
  - Botão "Entrar" com loading state
  - Link "Esqueci minha senha"
  - Divisor "ou"
  - Botão "Entrar com Google" (preparado)
  - Opção Criar conta
  - Botão voltar funcional
  - Mock de API (setTimeout)

### Bibliotecas Configuradas ✅

- ✅ React Native Paper 5.x
- ✅ React Native Vector Icons (MaterialCommunityIcons)
- ✅ React Navigation 7.x (Stack + Bottom Tabs)
- ✅ React Native Screens
- ✅ React Native Safe Area Context
- ✅ React Native Gesture Handler
- ✅ Babel Module Resolver (@/ aliases)

---

---

## 🔐 Fase 2.5: LGPD Compliance (Paralelo à Fase 3)

> **Objetivo:** Garantir conformidade com LGPD antes do lançamento público

### 🔴 URGENTE - Antes do MVP (Obrigatório)

#### Banco de Dados

- [ ] **Criptografia de CPF**
  - Implementar `cpf_hash` (SHA-256) para busca
  - Implementar `cpf_encrypted` (AES-256) para exibição
  - Criar função `encrypt_cpf()` e `decrypt_cpf()` no backend
  - Migrar dados existentes (se houver)
  - Remover coluna `cpf` em texto puro

- [ ] **Tabela user_consents**
  - ✅ Criada no DATABASE_SCHEMA_V2.sql
  - [ ] Implementar endpoints:
    - POST /api/consents (registrar consentimento)
    - GET /api/consents/:userId (listar consentimentos)
    - DELETE /api/consents/:id (revogar consentimento)

- [ ] **Soft Delete em Users**
  - ✅ Campos `deleted_at` e `deletion_reason` criados
  - [ ] Implementar função `anonymize_user()` no backend
  - [ ] Endpoint DELETE /api/user/account
  - [ ] Job para anonimizar após 30 dias de solicitação

#### Frontend Mobile

- [ ] **Tela de Consentimentos**
  - Checkbox "Li e aceito os Termos de Uso"
  - Checkbox "Li e aceito a Política de Privacidade"
  - Checkbox opcional "Aceito receber notificações"
  - Checkbox opcional "Permitir localização precisa"
  - Link para ler documentos completos
  - Validação: não permitir cadastro sem aceite dos termos

- [ ] **Consentimento para Biometria (futuro)**
  - Tela dedicada explicando uso
  - Destaque: "Opcional - você pode usar sem biometria"
  - Botão "Aceitar" e "Não agora"

#### Documentação Legal

- [ ] **Política de Privacidade**
  - Criar PRIVACY_POLICY.md
  - Definir dados coletados e finalidade
  - Explicar compartilhamento de dados
  - Direitos do titular (acesso, correção, exclusão)
  - Prazo de retenção de dados
  - Contato do DPO/responsável

- [ ] **Termos de Uso**
  - Criar TERMS_OF_USE.md
  - Regras de uso da plataforma
  - Responsabilidades de alunos e instrutores
  - Política de cancelamento
  - Limitação de responsabilidade

- [ ] **Texto de Consentimentos**
  - Versão 1.0 dos textos (imutável após aceite)
  - Armazenar em `user_consents.consent_text`
  - Controle de versão para atualizações futuras

---

### 🟡 MÉDIO PRAZO - 1-3 meses pós-lançamento

#### Retenção de Dados

- [ ] **Auto-expiração de Mensagens**
  - ✅ Campo `expires_at` criado (12 meses)
  - [ ] Cron job diário: `SELECT cleanup_expired_messages()`
  - [ ] Aviso no app: "Mensagens expiram em 12 meses"
  - [ ] Permitir download de conversas antes da expiração

- [ ] **Limpeza de Tokens Expirados**
  - ✅ Função `cleanup_expired_tokens()` criada
  - [ ] Cron job semanal no servidor
  - [ ] Manter apenas últimos 30 dias de histórico

#### Portabilidade de Dados

- [ ] **Endpoint "Exportar Meus Dados"**
  - GET /api/user/export-data
  - Retornar JSON completo:
    - Dados pessoais
    - Histórico de agendamentos
    - Avaliações recebidas/enviadas
    - Mensagens
    - Consentimentos registrados
  - Enviar por email criptografado (ZIP + senha)
  - Prazo de entrega: 48 horas

#### Auditoria e Histórico

- [ ] **Histórico de Status de Bookings**
  - ✅ Tabela `booking_status_history` criada
  - ✅ Trigger automático em mudanças de status
  - [ ] Endpoint GET /api/bookings/:id/history
  - [ ] Exibir timeline no app (admin)

- [ ] **Logs de Acesso**
  - ✅ Tabela `audit_logs` criada
  - [ ] Registrar ações críticas:
    - Login/logout
    - Alteração de senha
    - Alteração de dados pessoais
    - Criação/cancelamento de bookings
    - Pagamentos
  - [ ] Retenção: 5 anos (obrigação legal)

#### Direitos do Titular

- [ ] **Tela "Meus Dados"**
  - Ver dados pessoais completos
  - Botão "Corrigir Dados"
  - Botão "Exportar Dados"
  - Botão "Excluir Conta"

- [ ] **Fluxo de Exclusão de Conta**
  1. Usuário solicita exclusão
  2. Confirmar por email
  3. Período de carência (30 dias)
  4. Executar `anonymize_user()`
  5. Email de confirmação final

- [ ] **Anonimização Inteligente**
  - ✅ Função `anonymize_user()` criada
  - [ ] Manter bookings/reviews anonimizados (histórico)
  - [ ] Remover dados pessoais identificáveis
  - [ ] Preservar audit_logs por obrigação legal

---

### 🟢 LONGO PRAZO - 6-12 meses

#### Segurança Avançada

- [ ] **Biometria em Tabela Separada**
  - Criar tabela `user_biometrics`
  - Criptografia adicional (AES-256)
  - Backup separado (não incluir em backup padrão)
  - Compliance com LGPD Art. 11 (dados sensíveis)

- [ ] **Consentimento Granular**
  - Separar "marketing" de "notificações de serviço"
  - Permitir revogar apenas marketing
  - Notificações essenciais (booking confirmado) sempre ativas

#### Monetização e Compliance

- [ ] **Planos de Instrutores**
  - Tabela `instructor_plans`
  - Tabela `commissions`
  - Documentar compartilhamento de dados com gateways
  - Atualizar Política de Privacidade

- [ ] **Relatórios LGPD**
  - Dashboard admin: total de consentimentos ativos
  - Total de solicitações de exclusão
  - Tempo médio de resposta
  - Incidentes de segurança (se houver)

#### Performance e Escalabilidade

- [ ] **Particionamento de Messages**
  - PostgreSQL partitioning por mês
  - Migrar mensagens antigas para cold storage
  - Manter apenas últimos 12 meses em hot storage

- [ ] **Geolocalização com PostGIS**
  - Instalar extensão PostGIS
  - Migrar latitude/longitude para tipo `GEOGRAPHY`
  - Índices espaciais para busca por proximidade
  - Documentar uso de dados de localização

---

### 📋 Checklist de Conformidade LGPD

**Antes do lançamento público, confirmar:**

- [ ] ✅ Todos os dados têm base legal clara
- [ ] ✅ Consentimentos obrigatórios coletados e registrados
- [ ] ✅ Política de Privacidade publicada e acessível
- [ ] ✅ Termos de Uso aceitos por todos os usuários
- [ ] ✅ Usuário pode acessar seus dados
- [ ] ✅ Usuário pode corrigir seus dados
- [ ] ✅ Usuário pode exportar seus dados
- [ ] ✅ Usuário pode excluir sua conta
- [ ] ✅ Dados sensíveis (CPF, biometria) criptografados
- [ ] ✅ Logs de auditoria implementados
- [ ] ✅ Retenção de dados definida e automatizada
- [ ] ✅ Responsável LGPD/DPO designado
- [ ] ✅ Política de resposta a incidentes documentada
- [ ] ✅ Backups seguros e criptografados

---

### 🎯 Responsável LGPD

**Nome:** [A definir]  
**Email:** dpo@dirijamais.com.br  
**Telefone:** [A definir]

**Responsabilidades:**

- Garantir conformidade contínua com LGPD
- Atender solicitações de titulares (48 horas)
- Revisar Política de Privacidade anualmente
- Reportar incidentes à ANPD (quando aplicável)
- Treinar equipe sobre proteção de dados

---

### 📊 Métricas de Compliance

**Acompanhar mensalmente:**

| Métrica                                | Meta  |
| -------------------------------------- | ----- |
| Tempo médio de resposta a solicitações | < 48h |
| Taxa de consentimentos aceitos         | > 95% |
| Solicitações de exclusão atendidas     | 100%  |
| Incidentes de segurança reportados     | 0     |
| Dados não utilizados removidos         | 100%  |
| Backups testados com sucesso           | 100%  |

---

**Última atualização:** 13/12/2024  
**Status:** Em implementação  
**Próxima revisão:** Pré-lançamento MVP

## 🔄 Fase 3: Funcionalidades Core (EM ANDAMENTO - 14/12/2025)

### RegisterScreen ✅ CONCLUÍDO

- ✅ Formulário de cadastro
  - Nome completo
  - Email
  - CPF (com máscara automática)
  - Telefone (com máscara automática)
  - Senha + confirmação (com toggle de visibilidade)
  - Aceite de termos
- ✅ Validação de campos
  - Email (regex RFC 5322)
  - CPF (validação algorítmica completa)
  - Telefone (10-11 dígitos)
  - Senha forte (8+ chars, maiúscula, minúscula, número, especial)
  - Confirmação de senha
  - Checkbox de termos obrigatório
- ✅ Mock de criação de conta (httpClient interceptor)
- ✅ Navegação Login ↔ Register
- ✅ Toggle "olho" para visualizar senha
- ✅ Feedback de erros inline por campo
- ✅ Integração com useAuth hook
- ✅ Redirecionamento automático após registro

### Autenticação e Navegação ✅ PARCIALMENTE CONCLUÍDO

- ✅ **StudentStack criado**
  - DashboardScreen temporária (foco em ações)
  - Saudação personalizada
  - Cards: Próxima Aula, Progresso, Créditos
  - Ações Rápidas: Ver Instrutores, Histórico, Perfil
  - Botão logout funcional
- ✅ **RootNavigator com alternância dinâmica**
  - `isAuthenticated = false` → GuestStack
  - `isAuthenticated = true` → StudentStack
  - Fluxo: Register/Login → Dashboard automático
- ✅ **Utils de validação e formatação**
  - `validators.ts`: CPF, email, telefone, senha
  - `formatters.ts`: máscaras CPF e telefone
- ⏳ **LoginScreen** ainda usa mock (precisa conectar com useAuth)

### ForgotPasswordScreen ⏳ PENDENTE

- [ ] Campo de email
- [ ] Envio de link de recuperação (mock)
- [ ] Feedback visual
- [ ] Navegação de volta para Login

## 🚀 Fase 3.5: Conteúdo Educacional – Primeira Habilitação - 100% Concluído

# Conteúdo Educacional – Primeira Habilitação

## 📌 Objetivo

Criar uma **seção educacional acessível sem login**, focada em orientar candidatos à **Primeira Habilitação (CNH)**, educar o usuário, reduzir dúvidas e **converter** para o uso do app (agendamento de aulas e contato com instrutores).

Essa abordagem:

- Educa antes de vender
- Reduz fricção inicial
- Não depende de backend
- Não quebra fluxos futuros autenticados

---

## 🗂 Estrutura Criada

````text
shared/
└── content/
    └── firstLicense/
        ├── intro.ts
        ├── faq.ts
        └── journey.ts



intro.ts

Conteúdo introdutório da Primeira Habilitação:

O que é a CNH do Brasil

O que mudou com a Resolução CONTRAN nº 1.020/2025

Benefícios principais (menos custo, flexibilidade, instrutor autônomo)

Usado na tela inicial da jornada.

faq.ts

Perguntas frequentes resumidas e curadas a partir do conteúdo oficial da SENATRAN:

Quem pode tirar CNH

Etapas do processo

Provas teórica e prática

Uso de instrutores autônomos

Tentativas, prazos e validade

Formato ideal para:

Accordion

Lista progressiva

Busca futura

journey.ts

Estrutura da Jornada de Sucesso do Aluno, passo a passo:

Criar processo no gov.br

Curso teórico gratuito

Biometria e exames

Licença de Aprendizagem

Aulas práticas (mínimo legal)

Exame prático

PPD e CNH definitiva

Essa estrutura permite:

Visual progressivo

Checklists

Evolução personalizada (quando logado)

📱 Tela Criada

Arquivo:

presentation/screens/education/FirstLicenseIntroScreen.tsx


Características da tela:

Acessível sem login

Linguagem simples e clara

Visual educativo

CTA forte no final (“Encontrar Instrutor”, “Agendar Aula”)

Fluxo:

Home (Guest)
 └── Primeira Habilitação
     └── Introdução
         └── Jornada Visual
             └── FAQ resumido
                 └── CTA


🔗 Navegação

Tela registrada no GuestStack

Rota adicionada ao GuestStackParamList

Acesso via botão Primeira Habilitação no grid da Home


navigation.navigate('FirstLicenseIntro');



🎯 Estratégia Aplicada

Educa → Gera Confiança → Converte

Conteúdo oficial, confiável e atualizado

Não exige cadastro

Posiciona o app como referência

Prepara o usuário para contratar instrutores

## 🚀 Fase 3.6: Conteúdo Educacional – Primeira Habilitação

3.6 🚀 Próximos Passos Naturais

Expandir FAQ com busca

Deep link para agendamento

Versão “Guia do Instrutor” no futuro

Marcar progresso da jornada (usuário logado)


## ✅ Fase 3.7: Tela de Detalhes do Instrutor - CONCLUÍDO (15/12/2025)

### Estrutura de Dados ✅
- ✅ **Instructor.entity.ts** criada
  - Interface completa: id, name, avatar, category, rating, pricePerHour
  - Campos opcionais: bio, experience, totalClasses, vehicleModel, vehicleYear
  - Location (city, state)
  - Specialties (array de especializações)
  - Available (status de disponibilidade)

- ✅ **mockInstructors.ts** centralizado
  - 3 instrutores mockados com dados completos
  - Reutilizável em todas as telas
  - Preparado para substituição por API

### InstructorDetailScreen ✅
- ✅ Tela completa de detalhes do instrutor
  - Avatar grande (120x120)
  - Informações principais (nome, categoria, rating)
  - Stats: avaliação, experiência, total de aulas
  - Seção "Sobre" com biografia
  - Especialidades em chips
  - Veículo (modelo e ano)
  - Localização (cidade e estado)
  - Preço destacado
  - CTA "Agendar Aula" fixo no footer

- ✅ Navegação funcional
  - Rota `InstructorDetail` com params `{ instructorId: string }`
  - Integração com GuestStack
  - InstructorCard clicável (onPress já existente)
  - Botão voltar funcional
  - Error handling (instrutor não encontrado)

- ✅ Design responsivo
  - SafeAreaInsets para status bar
  - ScrollView para conteúdo longo
  - Footer fixo com CTA
  - Layout profissional e limpo

### Refatoração ✅
- ✅ HomeScreen usando dados centralizados
  - Substituiu instrutores hardcoded por `MOCK_INSTRUCTORS.map()`
  - Mantém visual idêntico
  - Preparado para paginação futura

## 🔄 Fase 3.8: Recuperação de Senha e Conta - CONCLUÍDO (15/12/2025)

### ForgotPasswordScreen ✅
- ✅ Tela de recuperação de senha
  - Campo de email com validação
  - Botão "Enviar Link" com loading state
  - Mock de envio (2s delay)
  - Tela de sucesso com feedback claro
  - Status: "Link enviado para seu email"
  - Navegação de volta para Login

- ✅ UX/UI
  - Ícone de sucesso (email-check-outline)
  - Mensagem personalizada com email destacado
  - Texto de orientação: "Verifique sua caixa de entrada e spam"
  - CTA "Voltar ao Login"

### AccountRecoveryScreen ✅
- ✅ Recuperação manual de conta (LGPD compliant)
  - Formulário com 5 campos:
    - Nome completo
    - CPF (com máscara e validação)
    - E-mail SEM acesso
    - Telefone (com máscara)
    - Motivo da solicitação (textarea)
  - Validação completa de todos os campos
  - Mock de envio (2s delay)

- ✅ Fluxo de segurança
  - Não valida dados sensíveis automaticamente
  - Solicitação enviada para equipe de suporte
  - Resposta em até 24 horas via SMS/WhatsApp
  - Tela de sucesso com prazo de resposta

- ✅ Design e UX
  - ScrollView para formulário longo
  - Ícone de contexto (account-lock-outline)
  - Info box explicativo
  - Feedback visual de erros por campo
  - Tela de confirmação com CTA claro

### Navegação ✅
- ✅ Rotas adicionadas ao GuestStack:
  - `ForgotPassword: undefined`
  - `AccountRecovery: undefined`
- ✅ LoginScreen conectado:
  - Link "Esqueci minha senha" → ForgotPasswordScreen
- ✅ ForgotPasswordScreen conectado:
  - Link "Não tenho mais acesso ao e-mail cadastrado" → AccountRecoveryScreen

### Design System ✅
- ✅ Cor `success: '#4CAF50'` adicionada ao tema
- ✅ Variantes de texto ajustadas:
  - `bodyMedium` para textos secundários (14px)
  - `bodySmall` apenas para hints/labels (12px)

---

## 🎯 Próximas Etapas - Sistema de Agendamento

### PRINCÍPIO CENTRAL
**Aluno solicita → Instrutor confirma ou recusa**
- Nada de agendamento automático
- Evita conflitos de horário
- Instrutor no controle total
- Aluno sempre com status claro

### 📋 CURTO PRAZO (2-4 semanas) - MVP Agendamento

#### 1. Telas Essenciais (Aluno)
- [ ] Lista completa de instrutores (com filtros: categoria, preço, avaliação)
- [ ] RequestLessonScreen (solicitar aula)
  - Data, horário, local, categoria, observação
  - Status: "Aguardando confirmação"
- [ ] StudentBookingsScreen (minhas solicitações)
  - Cards por status: 🟡 aguardando / 🟢 confirmada / 🔴 recusada
- [ ] BookingDetailScreen (detalhes da aula)
  - Status visível
  - Chat com instrutor (mock)
  - Ações: cancelar / avaliar

#### 2. Telas Essenciais (Instrutor)
- [ ] InstructorDashboardScreen (solicitações pendentes)
- [ ] RequestsScreen (aceitar/recusar)
  - Nome do aluno, data/hora, local
  - Botões: ✅ Aceitar / ❌ Recusar
- [ ] InstructorScheduleScreen (agenda simples)

#### 3. Backend Mínimo
- [ ] POST /bookings (criar solicitação)
- [ ] GET /bookings (listar solicitações)
- [ ] PATCH /bookings/:id/accept (instrutor aceita)
- [ ] PATCH /bookings/:id/reject (instrutor recusa)
- [ ] Estados: `requested`, `confirmed`, `rejected`, `cancelled`, `completed`

#### 4. Notificações Push Básicas
- [ ] Firebase Cloud Messaging configurado
- [ ] Instrutor: "Nova solicitação de aula"
- [ ] Aluno: "Aula confirmada" / "Aula recusada"

### 🚀 MÉDIO PRAZO (1-3 meses)

#### UX Avançada
- [ ] Chat real (Socket.io)
- [ ] Calendário interativo (instrutor define disponibilidade)
- [ ] Sistema de avaliações (⭐ 1-5)
- [ ] Histórico completo

#### Primeira Habilitação Personalizada
- [ ] Jornada com progresso (etapas completadas)
- [ ] Checklist interativo
- [ ] Integração com aulas práticas

#### Pagamento
- [ ] Pré-autorização (Stripe/Mercado Pago)
- [ ] Cobrança após confirmação
- [ ] Sistema de créditos

#### Inteligência
- [ ] Auto-aceite (instrutor define horários fixos)
- [ ] Sugestão automática de instrutores (se recusado)
- [ ] Ranking dinâmico

### 📊 Estados de Booking (Padronizados)

| Status Técnico | Texto Exibido | Cor |
|----------------|---------------|-----|
| `requested` | Aguardando confirmação | 🟡 |
| `confirmed` | Confirmada | 🟢 |
| `rejected` | Recusada | 🔴 |
| `cancelled` | Cancelada | ⚪ |
| `completed` | Concluída | 🔵 |
| `no_show` | Não compareceu | ⚠️ |


## 🎨 Fase 3.9: UI/UX Refinements e Infraestrutura (Planejado)

### Bottom Tab Navigation
- [ ] Configurar React Navigation Bottom Tabs
- [ ] 5 tabs principais:
  - 🏠 Home
  - 🔍 Buscar
  - 📅 Aulas
  - 💬 Chat
  - ☰ Menu
- [ ] Ícones + labels
- [ ] Navegação entre stacks
- [ ] Badge de notificações (contador)
- [ ] Transições suaves

### Componentes Reutilizáveis
- [ ] **CustomButton**
  - Variantes: primary, secondary, outlined, text
  - Loading state integrado
  - Disabled state
  - Icon support
- [ ] **CustomInput**
  - Máscaras integradas (CPF, telefone, CEP)
  - Validação visual
  - Helper text
  - Error state
- [ ] **LoadingOverlay**
  - Spinner centralizado
  - Backdrop translúcido
  - Mensagem customizável
- [ ] **EmptyState**
  - Ícone ilustrativo
  - Mensagem contextual
  - CTA opcional
- [ ] **ErrorBoundary**
  - Captura erros de renderização
  - Tela de fallback amigável
  - Log para Sentry

### Documentação Legal (LGPD)
- [ ] **PRIVACY_POLICY.md**
  - Dados coletados e finalidade
  - Base legal (LGPD Art. 7)
  - Compartilhamento de dados
  - Direitos do titular
  - Prazo de retenção
  - Contato do DPO
- [ ] **TERMS_OF_USE.md**
  - Regras de uso da plataforma
  - Responsabilidades de alunos e instrutores
  - Política de cancelamento
  - Limitação de responsabilidade
  - Propriedade intelectual
- [ ] **Tela de exibição no app**
  - PrivacyPolicyScreen (markdown renderizado)
  - TermsOfUseScreen (markdown renderizado)
  - Links acessíveis em:
    - Tela de registro
    - Menu de configurações
    - Footer do app
- [ ] **Checkbox de aceite obrigatório**
  - RegisterScreen: aceite de termos
  - Validação: não permitir cadastro sem aceite
  - Versionamento de documentos aceitos


## 🚀 Fase 4: Backend e Integração (Planejado)

### Infraestrutura Hostinger

- [ ] VPS configurado
- [ ] Node.js + Express
- [ ] PostgreSQL instalado e configurado
- [ ] SSL certificate (HTTPS)
- [ ] PM2 para gerenciamento de processos
- [ ] Nginx como reverse proxy

### API Endpoints

- [ ] POST /auth/register
- [ ] POST /auth/login
- [ ] POST /auth/google
- [ ] POST /auth/refresh
- [ ] POST /auth/password-reset-request
- [ ] POST /auth/password-reset
- [ ] GET /auth/me
- [ ] GET /instructors (filtros, paginação)
- [ ] GET /instructors/:id
- [ ] POST /bookings
- [ ] GET /bookings/:userId

### Segurança Backend

- [ ] express-rate-limit (5 tentativas/15min)
- [ ] helmet.js (headers de segurança)
- [ ] bcrypt/argon2 (hash de senhas)
- [ ] Joi/Zod (validação de entrada)
- [ ] CORS configurado
- [ ] JWT com refresh token rotativo

### Banco de Dados

- [ ] Schema: users, instructors, bookings, reviews
- [ ] Migrations configuradas
- [ ] Seeds para dados de teste
- [ ] Backup automático diário

### Integração Frontend ↔ Backend

- [ ] Conectar LoginUseCase → API real
- [ ] Conectar RegisterUseCase → API real
- [ ] Substituir dados mock por chamadas reais
- [ ] Error handling de API
- [ ] Retry logic em falhas de rede

---

## 📊 Fase 5: Recursos Avançados (Futuro)

### Chat em Tempo Real

- [ ] Socket.io integrado
- [ ] ChatListScreen
- [ ] ChatDetailScreen
- [ ] Notificações push

### Notificações

- [ ] Firebase Cloud Messaging
- [ ] Push notifications
- [ ] Lembretes de aulas
- [ ] Alertas de novos instrutores

### Sistema de Agendamento

- [ ] BookingCalendar component
- [ ] Seleção de data/hora
- [ ] Confirmação de agendamento
- [ ] Cancelamento e reagendamento
- [ ] Integração com calendário do device

### Pagamento

- [ ] Integração gateway (a definir: Stripe, Mercado Pago, PagSeguro)
- [ ] PaymentScreen
- [ ] Histórico de pagamentos
- [ ] Recibos digitais

### Perfil do Aluno

- [ ] Histórico de aulas
- [ ] Certificados/Documentos
- [ ] Progresso de aprendizado
- [ ] Estatísticas (horas dirigidas, aprovações)

### Analytics

- [ ] Sentry (error tracking)
- [ ] Firebase Analytics
- [ ] Logs estruturados
- [ ] Dashboards de uso

---

## 🔐 Fase 6: Hardening de Segurança (Pré-Produção)

### Mobile

- [ ] SSL Pinning
- [ ] Code obfuscation (ProGuard/R8)
- [ ] Root detection
- [ ] Jailbreak detection
- [ ] Biometria (Touch ID / Face ID)

### Backend

- [ ] Penetration testing
- [ ] Security headers audit
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Rate limiting expandido

### Compliance

- [ ] LGPD compliance
- [ ] Termos de uso
- [ ] Política de privacidade
- [ ] Documentação de segurança
- [ ] Consent management

---

## 🎉 Fase 7: Deploy e Produção (Lançamento)

### Play Store

- [ ] App bundle gerado (.aab)
- [ ] Screenshots profissionais
- [ ] Descrição otimizada da loja
- [ ] Ícone e splash screen finalizados
- [ ] Publicação e aprovação

### App Store (iOS - Futuro)

- [ ] Build para iOS
- [ ] Certificados Apple
- [ ] App Store Connect
- [ ] Review e publicação

### Monitoring

- [ ] Uptime monitoring (UptimeRobot)
- [ ] Error tracking ativo (Sentry)
- [ ] Performance metrics
- [ ] User feedback loop
- [ ] A/B testing

---

## 📈 Métricas de Sucesso

### MVP (3 meses)

- 100 usuários ativos
- 10 instrutores cadastrados
- 50 aulas agendadas
- NPS > 50

### Crescimento (6 meses)

- 1.000 usuários ativos
- 50 instrutores
- 500 aulas/mês
- Retenção de 40%

### Escala (12 meses)

- 10.000 usuários
- 200 instrutores
- 5.000 aulas/mês
- Expansão para 3 estados

---

---

## 🧹 Checklist de Limpeza Pré-Produção

> **CRÍTICO:** Itens que DEVEM ser removidos/alterados antes do deploy em produção

### 🔴 REMOVER OBRIGATORIAMENTE

#### Mock de API (Infrastructure)

- [ ] **src/infrastructure/http/client.ts**
  - Remover todo bloco `if (MOCK_ENABLED) { ... }`
  - Remover interceptor mock de `/auth/login`
  - Remover interceptor mock de `/auth/register`
  - Alterar `MOCK_ENABLED = false` ou remover flag
  - Linha ~15-120: deletar completamente

#### Telas Temporárias (Presentation)

- [ ] **src/presentation/screens/student/DashboardScreen.tsx**
  - Remover ou substituir por dashboard real
  - Linha comentada: "(Dashboard temporário para teste de autenticação)"
  - Substituir dados mockados (0/20 aulas, R$ 0,00) por dados reais da API

#### Logs de Debug

- [ ] **Todos os arquivos**
  - Buscar e remover `console.log()`
  - Buscar e remover `console.error()` que não sejam error tracking
  - Substituir por logger estruturado (ex: Sentry)

#### Dados Mockados

- [ ] **src/presentation/screens/guest/HomeScreen.tsx**
  - Remover array `MOCK_INSTRUCTORS`
  - Conectar com endpoint `GET /api/instructors`
  - Linha ~80-130: substituir por chamada real

#### Credenciais de Teste

- [ ] **src/infrastructure/http/client.ts**
  - Mock aceita `test@test.com` + `123456` (linha ~40)
  - Mock aceita CPF `11111111111` como duplicado (linha ~75)
  - Mock aceita email `existente@test.com` como duplicado (linha ~65)
  - Remover TODAS essas validações mockadas

---

### 🟡 VALIDAR E AJUSTAR

#### Configuração de Ambiente

- [ ] **src/core/config/env.ts**
  - Alterar `API_URL` para produção
  - Verificar `ENABLE_LOGS = false` em produção
  - Remover URLs de desenvolvimento
  - Validar timeouts de API (não muito curtos)

#### Error Messages

- [ ] **Todos os formulários**
  - Mensagens de erro amigáveis (não técnicas)
  - Não expor detalhes de implementação
  - Validar internacionalização (se aplicável)

#### Timeouts Artificiais

- [ ] **Buscar `setTimeout`**
  - Remover delays mockados (1500ms, 2000ms)
  - src/infrastructure/http/client.ts linha ~45, ~68
  - Manter apenas debounce/throttle legítimos

#### Comentários TODO

- [ ] **Buscar `// TODO`**
  - Resolver ou documentar motivo de não resolver
  - Especialmente em:
    - src/presentation/navigation/StudentStack.tsx
    - src/presentation/screens/student/DashboardScreen.tsx

---

### 🟢 ADICIONAR ANTES DE PRODUÇÃO

#### Segurança

- [ ] SSL Pinning (evitar man-in-the-middle)
- [ ] Code Obfuscation (ProGuard/R8)
- [ ] Root/Jailbreak detection
- [ ] Remover sourceMaps do bundle de produção

#### Performance

- [ ] Lazy loading de telas
- [ ] Image optimization (compressão)
- [ ] Bundle size analysis
- [ ] Remover dependências não utilizadas

#### Monitoramento

- [ ] Sentry configurado (error tracking)
- [ ] Analytics configurado (Firebase/Amplitude)
- [ ] Crash reporting ativo
- [ ] Performance monitoring

#### Build

- [ ] Versão correta em package.json
- [ ] Build number incrementado
- [ ] Signing config (Android keystore)
- [ ] ProGuard rules finalizadas

---

### 📋 Comandos de Validação

**Antes de cada release, executar:**

```bash
# Buscar mocks restantes
grep -r "MOCK" src/

# Buscar console.logs
grep -r "console.log" src/

# Buscar TODOs pendentes
grep -r "TODO" src/

# Buscar setTimeout suspeitos
grep -r "setTimeout" src/

# Validar que não há credenciais
grep -ri "test@test.com\|123456\|mock" src/

# Verificar imports não utilizados
npx eslint src/ --ext .ts,.tsx
````

---

### 🎯 Processo de Release

**Checklist Final:**

1. ✅ Todos os mocks removidos
2. ✅ API_URL apontando para produção
3. ✅ Logs de debug removidos
4. ✅ Error tracking ativo
5. ✅ Analytics ativo
6. ✅ Versão incrementada
7. ✅ Bundle gerado (release mode)
8. ✅ Testado em device real (não emulador)
9. ✅ Stress test realizado
10. ✅ Documentação atualizada

---

**Responsável pela validação:** [Nome do Tech Lead]  
**Última revisão:** 14/12/2024  
**Próxima revisão:** Antes do primeiro deploy

**Última atualização:** 13/12/2025
**Próxima revisão:** Fim da Fase 3
