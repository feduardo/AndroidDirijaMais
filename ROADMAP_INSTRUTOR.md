🗺️ ROADMAP - Jornada do Instrutor
🟢 CONCLUÍDO (v1)
Backend

✅ Endpoint de criação de perfil
✅ Endpoint de busca de perfil
✅ Dashboard com métricas básicas
✅ Validação de role nos endpoints
✅ Endpoint PUT /api/v1/instructors/profile - Atualizar perfil
✅ Resolução automática de CEP (ViaCEP)
✅ Validação CNH vencida
✅ Separação de tabelas (addresses, vehicles, documents)
✅ Histórico preparado (colunas created_at/updated_at)

Frontend

✅ Tela de criação de perfil
✅ Dashboard funcional
✅ Menu Drawer completo
✅ Navegação entre telas
✅ Fluxo de autenticação corrigido
✅ Tela de perfil com carregamento automático (GET)
✅ Edição de perfil funcional (PUT)
✅ Validação de CNH vencida
✅ Máscara de data brasileira (DD/MM/YYYY)
✅ Autocomplete de endereço via CEP
✅ Formulário condicional (veículo só se has_own_vehicle=true)
✅ Campos editáveis após consulta

Banco de Dados

✅ Modelo preparado para evolução
✅ Campos obrigatórios e opcionais definidos
✅ Tabela instructor_addresses
✅ Tabela instructor_vehicles
✅ Tabela instructor_documents
✅ Coluna has_own_vehicle em instructor_profiles
✅ Coluna accepts_student_vehicle em instructor_profiles





🟡 EM DESENVOLVIMENTO / PRÓXIMOS PASSOS
Backend

 PATCH /api/v1/instructors/profile - Atualizar perfil

Adicionar bio, experiência, endereço completo
Upload de foto de perfil (S3/Cloudinary)



Frontend

 Tela de edição de perfil completa

Campos opcionais: bio, anos de experiência, endereço
Upload de avatar
Preview de dados antes de salvar




2️⃣ Gestão de Veículos
Backend

 POST /api/v1/instructors/vehicles - Adicionar veículo
 GET /api/v1/instructors/vehicles - Listar veículos
 PATCH /api/v1/instructors/vehicles/{id} - Editar veículo
 DELETE /api/v1/instructors/vehicles/{id} - Remover veículo
 Upload de fotos do veículo (múltiplas)

Modelo (novo)


class InstructorVehicle(Base):
    id, instructor_id
    brand, model, year, plate
    photos (ARRAY)
    is_active


Frontend

 Tela de listagem de veículos
 Tela de cadastro/edição de veículo
 Upload de fotos do veículo
 Validação de placa (Mercosul)


3️⃣ Documentação Legal (Compliance)
Backend

 POST /api/v1/instructors/documents/cnh - Upload CNH
 POST /api/v1/instructors/documents/credencial - Upload credencial DETRAN
 POST /api/v1/instructors/documents/criminal-record - Certidão negativa
 GET /api/v1/instructors/documents - Listar documentos enviados
 Integração com API SERPRO/DETRAN (validação CNH)
 Workflow de aprovação de documentos

Modelo


class InstructorDocument(Base):
    id, instructor_id
    document_type (enum: cnh, credencial, criminal_record, etc)
    file_url
    status (pending, approved, rejected)
    verified_by, verified_at
    expiry_date


Frontend

 Tela de envio de documentos
 Preview de documentos enviados
 Status de verificação (pendente/aprovado/rejeitado)
 Notificações de aprovação/rejeição


Análise do checklist:
✅ Backend:

✅ GET /instructor/availability
✅ POST /instructor/availability
✅ POST /instructor/availability/blocks
✅ DELETE /instructor/availability/{id}
✅ DELETE /instructor/availability/blocks/{id}
✅ GET /instructor/availability/blocks (adicionado durante implementação)

✅ Frontend - Disponibilidade:

✅ Tela de configuração de disponibilidade semanal
✅ Seleção de dias da semana
✅ Definição de horários (início/fim) com agrupamento por período
✅ Criação com múltiplos intervalos contíguos
✅ Remoção de disponibilidade

✅ Frontend - Bloqueios:

✅ Tela de bloqueios pontuais
✅ Calendário para selecionar datas (Hoje/Amanhã/Período)
✅ Criar bloqueios (dia inteiro ou horários específicos)
✅ Excluir bloqueios

✅ Disponibilidades Semanais:

Seleção de dia da semana
Seleção visual de horários por período (Manhã/Tarde/Noite)
Agrupamento automático de horários contíguos
Criação de múltiplos intervalos no mesmo dia
Remoção de disponibilidades

✅ Bloqueios Pontuais:

Três modos de seleção: Hoje / Amanhã / Período
Calendário visual para seleção de períodos
Bloqueio dia inteiro ou horários específicos
Seleção múltipla de horários por período
Remoção de bloqueios

✅ Interface:

Tabs para separar Disponibilidades e Bloqueios
Filtro automático de itens inativos
UX limpa e profissional
Feedback visual adequado


5️⃣ Gestão de Aulas (Bookings)
### 5️⃣ Gestão de Aulas (Bookings) ✅ **COMPLETO**

#### Backend ✅ (endpoints já existem e testados)
- ✅ /instructor/bookings (GET - listar)
- ✅ /instructor/bookings/{id} (GET - detalhes)
- ✅ /instructor/bookings/{id}/accept (POST)
- ✅ /instructor/bookings/{id}/reject (POST)
- ✅ /instructor/bookings/{id}/start (POST)
- ✅ /instructor/bookings/{id}/finish (POST)
- ✅ /instructor/bookings/{id}/cancel (POST)

#### Frontend ✅ **IMPLEMENTADO**
- ✅ InstructorBookingsScreen
  - Filtros por status (Todas, Aguardando, Confirmadas, Em andamento, Concluídas)
  - Pull-to-refresh
  - Cards visuais com status
- ✅ InstructorBookingDetailScreen
  - Detalhamento completo da aula
  - Ações contextuais por status
  - Modal de código de início (4 dígitos)
  - Modal de cancelamento com motivo

#### Melhorias Futuras (v2)
- [ ] Timer de aula em tempo real
- [ ] Mapa com localização na tela de detalhes
- [ ] Botão de emergência/SOS
- [ ] Notificações push (novas solicitações)
- [ ] Histórico com paginação infinita



Tabs: Pendentes / Confirmadas / Histórico
Card com dados do aluno
Ações: aceitar/recusar/iniciar/finalizar


 Tela de detalhes da aula

Mapa com localização
Timer de aula em andamento
Botão de emergência/cancelamento


 Notificações push (novas solicitações)


6️⃣ Financeiro
Backend

 POST /api/v1/instructors/bank-account - Cadastrar conta bancária
 GET /api/v1/instructors/bank-account - Buscar dados bancários
 GET /api/v1/instructors/earnings - Relatório de ganhos

Filtros: período, status (pago/pendente)


 GET /api/v1/instructors/withdrawals - Histórico de saques
 Integração com gateway de pagamento (Stripe/Pagar.me)

Modelo

class InstructorBankAccount(Base):
    id, instructor_id
    bank_code, agency, account, account_digit
    account_type (checking, savings)
    pix_key, pix_type

class InstructorEarning(Base):
    id, instructor_id, booking_id
    amount, platform_fee, net_amount
    status (pending, paid, cancelled)
    paid_at

Frontend

 Tela de cadastro de dados bancários
 Dashboard financeiro

Saldo disponível
Histórico de ganhos
Gráficos (ganhos por mês)


 Tela de solicitação de saque


7️⃣ Avaliações e Reputação
Backend

 Sistema de reviews já contemplado no modelo (rating_average, rating_count)
 Endpoint para buscar reviews recebidos
 Cálculo automático de média após cada review

Frontend

 Exibir rating no perfil
 Listagem de avaliações recebidas
 Responder a avaliações (opcional)


8️⃣ Mensagens / Chat
Backend

 Sistema de mensagens (WebSocket ou Firebase)
 POST /api/v1/messages - Enviar mensagem
 GET /api/v1/messages/conversations - Listar conversas
 GET /api/v1/messages/{conversation_id} - Histórico

Modelo

class Conversation(Base):
    id, student_id, instructor_id
    last_message_at

class Message(Base):
    id, conversation_id
    sender_id, content
    created_at, read_at
```

#### Frontend
- [ ] Tela de conversas (lista)
- [ ] Tela de chat (mensagens)
- [ ] Badge de mensagens não lidas
- [ ] Notificações push

---

### 9️⃣ Workflow de Aprovação (Admin)

#### Backend
- [ ] Adicionar coluna `status` em `instructor_profiles`
  - `pending_approval`, `active`, `suspended`, `blocked`
- [ ] `GET /api/v1/admin/instructors/pending` - Listar instrutores pendentes
- [ ] `POST /api/v1/admin/instructors/{id}/approve` - Aprovar
- [ ] `POST /api/v1/admin/instructors/{id}/reject` - Rejeitar
- [ ] Logs de auditoria (quem aprovou, quando, motivo)

#### Frontend (Admin - futuro)
- [ ] Painel de aprovação de instrutores
- [ ] Visualização de documentos
- [ ] Botões aprovar/rejeitar

#### Frontend (Instrutor)
- [ ] Badge/banner indicando status (pendente/ativo/rejeitado)
- [ ] Bloquear ações se perfil não aprovado

✅ **InstructorBookingsScreen** - Listagem com filtros por status
✅ **InstructorBookingDetailScreen** - Detalhes e ações contextuais
✅ Modais de interação (código de início, cancelamento)
✅ InstructorRepository expandido (7 novos métodos)
✅ Navegação completa para gestão de aulas


---

### 🔟 Notificações Push

#### Backend
- [ ] Integração Firebase Cloud Messaging (FCM)
- [ ] Enviar notificação ao instrutor:
  - Nova solicitação de aula
  - Aluno cancelou aula
  - Mensagem recebida
  - Documento aprovado/rejeitado

✅ Endpoints completos de gestão de aulas
✅ GET /instructor/bookings - Listar com filtro
✅ GET /instructor/bookings/{id} - Detalhes
✅ POST /instructor/bookings/{id}/accept - Aceitar
✅ POST /instructor/bookings/{id}/reject - Recusar
✅ POST /instructor/bookings/{id}/start - Iniciar (código)
✅ POST /instructor/bookings/{id}/finish - Finalizar
✅ POST /instructor/bookings/{id}/cancel - Cancelar
✅ Máquina de estados e validações de transição


#### Frontend
- [ ] Configurar FCM no React Native
- [ ] Solicitar permissão de notificações
- [ ] Salvar token do device no backend
- [ ] Navegar para tela correta ao clicar na notificação

---

## 🔴 BACKLOG (v3+)

### Recursos Avançados
- [ ] Aulas em pacotes (desconto por quantidade)
- [ ] Cupons de desconto
- [ ] Sistema de indicação (referral)
- [ ] Estatísticas avançadas (taxa de aprovação de alunos, etc)
- [ ] Integração com agenda Google Calendar
- [ ] Modo offline (sincronização posterior)
- [ ] Multilíngue (i18n)
- [ ] Tema escuro

### Compliance e Segurança
- [ ] 2FA (autenticação de dois fatores)
- [ ] Logs de acesso e auditoria completos
- [ ] LGPD: export de dados do usuário
- [ ] LGPD: exclusão de conta (soft delete)
- [ ] Rate limiting por usuário
- [ ] Proteção contra ataques (CSRF, XSS)

---

## 📊 Resumo de Prioridades

### 🔥 **CRÍTICO** (fazer agora)

### 🔥 **CRÍTICO** (fazer agora)
1. ~~Gestão de Aulas~~ ✅ **CONCLUÍDO**
2. ~~Edição de perfil (PATCH endpoint + tela)~~ ✅ **CONCLUÍDO**
3. Gestão de veículos (múltiplos veículos - CRUD completo)
4. Upload e validação de documentos (CNH, credencial)
5. Workflow de aprovação (status: pending/active/rejected)


### ⚠️ **IMPORTANTE** (próximas 2-4 semanas)
4. Disponibilidade e agenda (telas frontend)
5. Melhorar tela de bookings (aceitar/recusar)
6. Dados bancários e relatório financeiro básico

### ✅ **DESEJÁVEL** (após MVP estável)
7. Chat/mensagens
8. Workflow de aprovação admin
9. Notificações push
10. Avaliações e reviews

---

## 🛠️ Stack Técnica

### Backend
- FastAPI (Python 3.10+)
- PostgreSQL
- SQLAlchemy (ORM)
- JWT (autenticação)
- Pydantic (validação)

### Frontend
- React Native
- TypeScript
- React Navigation (Stack + Drawer)
- Zustand (state management)
- Axios (HTTP client)
- React Native Paper (UI)

### Infraestrutura (futuro)
- Storage: AWS S3 / Cloudinary (uploads)
- Push: Firebase Cloud Messaging
- Pagamentos: Stripe / Pagar.me
- Deploy: Docker + AWS ECS / Render

---

## 📝 Convenções de Commit
```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
refactor: refatoração sem mudança de comportamento
test: adição/correção de testes
chore: tarefas de manutenção
```

Exemplo:
```
feat(instructor): add vehicle management endpoints
fix(auth): correct role validation in login flow
docs(readme): update roadmap with financial module


Última atualização: 24/12/2024
Versão atual: v1.0 (MVP Instrutor - Perfil Básico)


Descrição do que foi desenvolvido

Backend

Separação correta entre:

Categorias da CNH (instructor_documents.category)

Categorias que o instrutor ministra (instructor_profiles.teaching_categories)

Criação e migração da coluna teaching_categories com NOT NULL e DEFAULT '{}'.

Ajuste dos endpoints:

POST /instructors/profile e PUT /instructors/profile passam a gravar teaching_categories corretamente.

GET /instructors/profile retorna:

cnh.categories (CNH do instrutor)

categories (categorias que ministra)

bio do instrutor.

Inclusão do campo bio no fluxo completo (create, update, get).

Exposição segura do CPF:

CPF já existente no BD (cpf_hash / cpf_encrypted).

Inclusão do CPF descriptografado no UserResponse via schema.

CPF passa a ser retornado automaticamente em /auth/login e /auth/me, sem expor dados sensíveis brutos.

Frontend

Ajuste dos tipos:

InstructorProfileResponse agora inclui bio.

User agora inclui cpf.

Correção do uso de dados:

Dados de contato (nome, email, telefone, CPF) vêm do auth store, não do profile.

Dados profissionais vêm de /instructors/profile.

Refatoração da tela de perfil do instrutor:

Uso de react-native-paper List.Accordion para organização.

Seções criadas:

Dados de Contato (somente leitura)

Dados Profissionais (bio, preço, experiência, categorias que ministra, regras de veículo)

Documentos (CNH)

Endereço de Atendimento

Garantia de persistência correta:

Alterar categorias da CNH não altera categorias ministradas.

Alterar categorias ministradas não altera CNH.

Resultado final

Modelo de dados coerente.

Contrato de API claro e tipado.

Tela mais organizada, legível e alinhada com o domínio real do negócio.

Nenhuma quebra de fluxo existente.