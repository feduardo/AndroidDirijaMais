# 🎨 Design System - DirijaMais

Guia completo de design, componentes, cores, tipografia, espaçamentos e iconografia.

---

## 🎯 Princípios de Design

### Objetivo do App

- **Confiança**: Azul como cor primária
- **Segurança**: Reduzir ansiedade no processo de habilitação
- **Profissionalismo**: Interface limpa e moderna
- **Decisão Rápida**: Hierarquia visual clara

---

## 🎨 Paleta de Cores

### Cores Primárias

```typescript
primary: '#1976D2'; // Azul confiança (botões, headers, ícones)
primaryLight: '#42A5F5'; // Variação clara
primaryDark: '#1565C0'; // Estado pressed
```

### Cores Secundárias

```typescript
secondary: '#4CAF50'; // Verde (ações positivas, sucesso)
secondaryLight: '#81C784';
```

### Cores de Feedback

```typescript
error: '#E53935'; // Vermelho suave (evitar agressivo)
warning: '#FFC107'; // Amarelo âmbar (atenção)
success: '#4CAF50'; // Verde confirmação
info: '#0288D1'; // Azul informativo
```

### Cores de Texto

```typescript
text: '#212121'; // Texto principal
textSecondary: '#757575'; // Descrições, labels
disabled: '#BDBDBD'; // Estado desabilitado
```

### Superfícies

```typescript
background: '#F5F5F5'; // Fundo geral do app
card: '#FFFFFF'; // Cards, modais
border: '#E0E0E0'; // Bordas, divisores
```

### Estados de Interação

```typescript
states: {
  disabled: '#BDBDBD',
  pressed: '#1565C0',     // 15% mais escuro que primary
  hover: '#1E88E5',       // 10% mais claro (web)
}
```

### Sombras

```typescript
shadow: {
  card: 'rgba(0,0,0,0.08)',    // Sombra sutil
  button: 'rgba(0,0,0,0.15)',  // Sombra moderada
}
```

---

## 📐 Tipografia

### Fonte

**Inter** (moderna, limpa, otimizada para mobile)

### Escala Tipográfica

| Uso                  | Peso     | Tamanho | Altura Linha |
| -------------------- | -------- | ------- | ------------ |
| H1 (títulos grandes) | Semibold | 24px    | 32px         |
| H2 (seções)          | Semibold | 20px    | 28px         |
| H3 (subtítulos)      | Medium   | 18px    | 24px         |
| Body 1 (principal)   | Regular  | 16px    | 22px         |
| Body 2 (secundário)  | Regular  | 14px    | 20px         |
| Caption              | Regular  | 12px    | 16px         |
| Label botão          | Semibold | 16px    | 22px         |

---

## 📏 Espaçamentos (Spacing System)

Sistema baseado em incrementos de **4px**.

| Nome         | Valor | Uso                          |
| ------------ | ----- | ---------------------------- |
| Spacing XS   | 4px   | Entre ícone e texto          |
| Spacing S    | 8px   | Entre elementos pequenos     |
| Spacing M    | 12px  | Entre cards, padding interno |
| Spacing L    | 16px  | Entre seções menores         |
| Spacing XL   | 20px  | Margens laterais da tela     |
| Spacing XXL  | 24px  | Topo da tela, entre seções   |
| Spacing XXXL | 32px  | Seções principais            |

---

## 🔲 Radius (Arredondamento)

| Elemento | Radius |
| -------- | ------ |
| Botões   | 12px   |
| Cards    | 14px   |
| Inputs   | 12px   |
| Avatares | 50%    |
| Banner   | 16px   |

---

## 🌑 Elevation / Shadow (Android)

### Cards Pequenos

```typescript
elevation: 2;
shadowColor: 'rgba(0,0,0,0.08)';
```

### Cards Grandes / Banner

```typescript
elevation: 4;
shadowColor: 'rgba(0,0,0,0.08)';
```

### Botões

- Sem sombra (foco no contraste de cor)

### iOS Shadows

```typescript
ios: {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
}
```

---

## 🎭 Iconografia Oficial

### Navegação Inferior (Bottom Tab)

| Área               | Ícone           |
| ------------------ | --------------- |
| Início             | `home-outline`  |
| Buscar Instrutores | `magnify`       |
| Agendar Aula       | `calendar-plus` |
| Chat               | `chat-outline`  |
| Menu               | `menu`          |

### Tela Inicial – Ações Rápidas

| Função               | Ícone                       |
| -------------------- | --------------------------- |
| Primeira Habilitação | `id-card-outline`           |
| Curso Teórico Online | `school-outline`            |
| Aulas Práticas       | `steering`                  |
| Instrutores Próximos | `map-marker-radius-outline` |
| Simulados Teóricos   | `clipboard-text-outline`    |
| Documentação CNH     | `file-document-outline`     |
| Meus Agendamentos    | `calendar-clock`            |
| Favoritos            | `heart-outline`             |

### Perfil / Menu

| Função          | Ícone                    |
| --------------- | ------------------------ |
| Entrar / Conta  | `account-circle-outline` |
| Meus Dados      | `account-edit-outline`   |
| Pagamentos      | `credit-card-outline`    |
| Notificações    | `bell-outline`           |
| Ajuda / Suporte | `lifebuoy`               |
| Configurações   | `cog-outline`            |
| Privacidade     | `shield-lock-outline`    |
| Sair            | `logout-variant`         |

### Instrutores

| Função             | Ícone                 |
| ------------------ | --------------------- |
| Instrutor Autônomo | `account-tie-outline` |
| Avaliações         | `star-outline`        |
| Preço / Pacotes    | `cash-multiple`       |
| Disponibilidade    | `calendar-range`      |
| Localização        | `map-marker-check`    |
| Veículo            | `car-outline`         |

### Aulas e Agendamentos

| Função         | Ícone                  |
| -------------- | ---------------------- |
| Criar Aula     | `plus-circle-outline`  |
| Cancelar Aula  | `close-circle-outline` |
| Reagendar      | `calendar-sync`        |
| Aula Concluída | `check-circle-outline` |
| Em andamento   | `progress-clock`       |

### Fluxo Primeira Habilitação

| Etapa             | Ícone                     |
| ----------------- | ------------------------- |
| Coleta biométrica | `fingerprint`             |
| Exame Médico      | `stethoscope`             |
| Curso Teórico EAD | `book-open-variant`       |
| Simulado DETRAN   | `clipboard-check-outline` |
| Prova Teórica     | `school-outline`          |
| Aulas Práticas    | `steering`                |
| Prova Prática     | `flag-checkered`          |

---

## 📱 Layout da Home (Especificações)

### 1. Header

```
Altura: 56px
Margem superior: 24px
Margens laterais: 20px

Elementos (esquerda → direita):
- Ícone localização (map-marker-outline) + cidade
- Espaço: 6px entre ícone e texto
- Ícone notificações (bell-outline) [direita]
- Espaço: 12px
- Ícone perfil (account-circle-outline) [direita]

Hitbox: 44x44px (todos os ícones)
```

### 2. Barra de Busca

```
Margem superior: 16px (do header)
Altura: 48px
Radius: 12px
Padding horizontal: 12px
Placeholder: "Buscar instrutor, aula ou serviço"
Ícone: magnify
```

### 3. Banner Principal

```
Margem superior: 24px
Altura: 150-160px
Radius: 16px
Margens laterais: 20px
Swipe horizontal (carrossel)
Indicadores: bolinhas com 4px de espaço
```

### 4. Ações Rápidas (Grade Principal)

```
Margem superior: 24px
Margens laterais: 20px
Espaço entre cards: 12px
Cards: 100px x 100px (quadrados)
Radius: 14px

Grid 2x2:
- Primeira Habilitação (id-card-outline)
- Curso Teórico (school-outline)
- Aulas Práticas (steering)
- Instrutores Próximos (map-marker-radius-outline)

Ícone: 28-32px
Espaço ícone ↔ texto: 8px
Animação: scale 0.97 ao toque
```

### 5. Lista de Instrutores

```
Margem superior: 28px
Título: "Instrutores perto de você"
Font: semibold, 18px
Espaço abaixo título: 12px

Card instrutor (carrossel horizontal):
- Largura: 220px
- Radius: 14px
- Padding interno: 12px
- Espaço entre cards: 12px

Conteúdo:
- Foto (48px, circular)
- Nome (semibold)
- Ícone star + nota
- Ícone car + categoria
- Preço por hora
```

### 6. Seção "Como Funciona CNH 2025"

```
Margem superior: 32px
Título: "Como funciona a nova CNH 2025"

Etapas verticais (cada bloco):
- Ícone: 32px
- Espaço ícone → título: 6px
- Espaço título → descrição: 6px
- Espaço entre blocos: 16px

Ícones:
1. fingerprint - Coleta biométrica
2. stethoscope - Exame médico
3. book-open-variant - Curso teórico
4. clipboard-check-outline - Simulado
5. steering - Aulas práticas
6. flag-checkered - Prova prática
```

### 7. Bottom Tab (sempre fixo)

```
Altura: 56-60px
Ícones: 24px
Labels: 10-12px

Ícones:
- Home (home-outline)
- Buscar (magnify)
- Agendar (calendar-plus)
- Chat (chat-outline)
- Menu (menu)

Item ativo: cor primária + texto bold
```

---

## 🎯 Componentes Padronizados

### Botões

#### Primário

```typescript
{
  height: 48px,
  borderRadius: 12px,
  backgroundColor: '#1976D2',
  fontSize: 16px,
  fontWeight: '600',
  // Feedback: opacity 0.9 ao toque
}
```

#### Secundário

```typescript
{
  height: 48px,
  borderRadius: 12px,
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: '#1976D2',
  color: '#1976D2',
}
```

### Inputs

```typescript
{
  height: 48px,
  borderRadius: 12px,
  borderWidth: 1,
  borderColor: '#E0E0E0',
  paddingHorizontal: 12px,
  // Ícone à esquerda: 24px
  // Borda azul ao focar
}
```

### Cards

```typescript
{
  backgroundColor: '#FFFFFF',
  borderRadius: 14px,
  padding: 12-16px,
  elevation: 2, // Android
  shadowColor: 'rgba(0,0,0,0.08)', // iOS
}
```

---

## ♿ Acessibilidade

### Contraste Mínimo

- **WCAG AA**: Todos os textos atingem 4.5:1
- **WCAG AAA**: Textos principais atingem 7:1

### Touch Targets

- **Mínimo**: 44x44px (todos os botões e ícones)

### Tamanho de Texto

- **Base**: 16px (ajustável pelo sistema)

### Labels

- Todos os ícones interativos têm `accessibilityLabel`

---

## 🎭 Interações e Comportamento

### Feedback ao Toque

```typescript
// Botões
onPress → opacity 0.9

// Cards
onPress → scale 0.97

// Ícones
onPress → ripple effect (Android)
```

### Animações

```typescript
// Navegação
slide from right (300ms)

// Modal
fade + slide up (250ms)

// List items
stagger 50ms
```

📐 Design System – Espaçamento (DirijaMais)

Use sempre múltiplos de 4.
Base visual: 8px (padrão mobile moderno).

export const spacing = {
xs: 4, // micro ajustes
sm: 8, // entre título e conteúdo
md: 12, // entre elementos relacionados
lg: 16, // entre seções
xl: 24, // separação forte (raramente)
xxl: 32, // telas vazias / hero (evitar)
};

🔹 Regras Práticas (use sempre)
1️⃣ Entre seções principais

Grid → Lista → Banner → Cards

marginBottom: spacing.lg // 16

2️⃣ Título → conteúdo

marginBottom: spacing.sm // 8

Exemplo:

sectionTitle: {
marginBottom: spacing.sm,
}

3️⃣ Dentro de cards

padding: spacing.md // 12

4️⃣ Grid de ações (blocos quadrados)

gap: spacing.md // 12
marginBottom: spacing.lg // 16

5️⃣ Listas horizontais
marginRight: spacing.sm // 8 ou 12

🔹 Aplicando ao caso do DirijaMais (exato)
actionsGrid: {
flexDirection: 'row',
flexWrap: 'wrap',
paddingHorizontal: spacing.lg, // 16 ou 20 se preferir
gap: spacing.md, // 12
marginBottom: spacing.lg, // 16
},

instructorsSection: {
paddingHorizontal: spacing.lg,
},

sectionTitle: {
marginBottom: spacing.sm, // 8
fontWeight: '600',
},

Resultado:

Nada colado

Nada “flutuando”

Fluxo visual contínuo

Sensação de app grande

🧠 Regra de ouro (grave isso)

Quem vem antes define o espaço.
Evite marginTop em seções novas.

Próximos upgrades possíveis:

spacing integrado ao theme

Section component padrão

Layout pronto para dark mode

Skeleton loaders com espaçamento consistente

---

**Última atualização:** 13/12/2025
**Responsável:** Roberto Caldeira Flores Junior
