📊 1. ANÁLISE DO BANCO DE DADOS
Tabelas Existentes (Já Prontas) ✅
A) instructor_withdrawal_methods


Colunas relevantes:
- id (UUID)
- user_id (FK users) 
- pix_key_type, pix_key
- status ('pending' | 'validated' | 'rejected' | 'blocked')
- validated_at, validated_by (FK users - admin que validou)
- rejection_reason (texto explicando rejeição)


Status atual: Totalmente pronta, nenhuma alteração necessária.

B) instructor_payouts


Colunas relevantes:
- id (UUID)
- instructor_id (FK users)
- booking_id, payment_id
- gross_amount, net_amount, platform_fee
- status ('waiting' | 'available' | 'pending_transfer' | 'paid' | 'blocked')
- is_anticipation (boolean)
- available_at (quando fica disponível)
- requested_at (quando instrutor solicitou saque)
- paid_at (quando admin marcou como pago)
- paid_by (FK users - admin que processou)
- transfer_method ('automatic' | 'manual')
- withdrawal_method ('mercadopago' | 'pix_manual')
- pix_transaction_id (ID da transação Pix - preencher ao pagar)
- mp_transfer_id (ID do Mercado Pago - se automático)
- failure_reason (se falhar)
- notes (observações do admin)


Status atual: Totalmente pronta, nenhuma alteração necessária.

C) users

Colunas relevantes:
- id (UUID)
- role ('admin' | 'instructor' | 'student')
- full_name, email
```

**Necessidade:** Garantir que existe pelo menos 1 usuário com `role='admin'`.

---

### **Tabelas Novas (NÃO NECESSÁRIAS)** ❌

**Conclusão:** Todas as colunas necessárias já existem. Não precisa criar novas tabelas.

---

## 🔧 2. BACKEND - ENDPOINTS NECESSÁRIOS

### **Estrutura de Arquivos**
```
app/
├── presentation/
│   ├── routers/
│   │   └── admin_financial.py (CRIAR - novo arquivo)
│   └── schemas/
│       └── admin_financial.py (CRIAR - schemas do admin)
├── domain/
│   ├── services/
│   │   └── admin_financial_service.py (CRIAR - lógica de negócio)
│   └── repositories/
│       └── admin_financial_repository.py (CRIAR - queries específicas)


A) Router: admin_financial.py
Arquivo: app/presentation/routers/admin_financial.py
Endpoints Necessários:
1. Validação de Chaves Pix

GET /admin/financial/pix-validations/pending
- Lista todas as chaves Pix com status='pending'
- Retorna: instructor_name, email, pix_key, created_at
- Ordenar por: created_at ASC (mais antigos primeiro)
- Paginação: ?page=1&limit=20

GET /admin/financial/pix-validations/{method_id}
- Detalhes completos de uma chave Pix específica
- Retorna: todos os campos + dados do instrutor

PATCH /admin/financial/pix-validations/{method_id}/approve
- Valida uma chave Pix
- Body: {} (vazio, validação automática)
- Ações:
  * UPDATE status='validated'
  * UPDATE validated_at=NOW()
  * UPDATE validated_by=current_admin.id
- Retorna: método atualizado

PATCH /admin/financial/pix-validations/{method_id}/reject
- Rejeita uma chave Pix
- Body: { "reason": "CPF inválido" }
- Validações:
  * reason obrigatório (min 10 chars)
- Ações:
  * UPDATE status='rejected'
  * UPDATE rejection_reason=reason
  * UPDATE validated_by=current_admin.id
- Retorna: método atualizado


2. Gestão de Saques

GET /admin/financial/withdrawals/pending
- Lista saques com status='pending_transfer'
- JOIN com users (instrutor) e withdrawal_methods (Pix)
- Retorna:
  * payout_id, instructor_name, net_amount
  * pix_key, transfer_method
  * requested_at, days_waiting
- Ordenar por: requested_at ASC
- Filtros: ?transfer_method=manual&limit=20

GET /admin/financial/withdrawals/{payout_id}
- Detalhes completos de um saque
- JOIN booking (dados da aula), student (nome do aluno)
- Retorna tudo para o admin decidir

POST /admin/financial/withdrawals/{payout_id}/process
- Marcar saque como processado (pago)
- Body: {
    "pix_transaction_id": "E12345678",  // ID da transferência Pix
    "notes": "Pago via Pix manual"      // opcional
  }
- Validações:
  * status='pending_transfer'
  * pix_transaction_id obrigatório (string)
- Ações:
  * UPDATE status='paid'
  * UPDATE paid_at=NOW()
  * UPDATE paid_by=current_admin.id
  * UPDATE pix_transaction_id
  * UPDATE notes (se fornecido)
- Retorna: payout atualizado

POST /admin/financial/withdrawals/{payout_id}/fail
- Marcar saque como falho (para retentar)
- Body: { "failure_reason": "Chave Pix inválida" }
- Ações:
  * UPDATE status='available' (volta para disponível)
  * UPDATE failure_reason
  * UPDATE notes
- Retorna: payout atualizado


3. Relatórios e Estatísticas

GET /admin/financial/stats
- Estatísticas gerais
- Retorna:
  {
    "pix_pending_count": 5,
    "withdrawals_pending_count": 12,
    "withdrawals_pending_amount": 1234.56,
    "withdrawals_processed_today": 8,
    "withdrawals_processed_today_amount": 890.12
  }

GET /admin/financial/history
- Histórico de todas as ações financeiras
- Filtros: ?date_from=2026-01-01&status=paid
- JOIN audit_logs para rastrear quem fez o quê
- Paginação


B) Service: admin_financial_service.py
Arquivo: app/domain/services/admin_financial_service.py
Responsabilidades:


class AdminFinancialService:
    
    # Validações de Pix
    async def get_pending_pix_validations(page, limit):
        # Buscar withdrawal_methods com status='pending'
        # JOIN users para pegar nome do instrutor
        # Retornar lista paginada
    
    async def approve_pix(method_id, admin_id):
        # Validar que existe e está 'pending'
        # Atualizar status, validated_at, validated_by
        # Retornar método atualizado
    
    async def reject_pix(method_id, admin_id, reason):
        # Validar reason (min 10 chars)
        # Atualizar status='rejected', rejection_reason
        # Retornar método atualizado
    
    # Gestão de Saques
    async def get_pending_withdrawals(filters):
        # Buscar payouts com status='pending_transfer'
        # JOIN users (instrutor), withdrawal_methods (Pix)
        # Filtrar por transfer_method se solicitado
        # Calcular days_waiting (NOW - requested_at)
        # Retornar lista
    
    async def get_withdrawal_detail(payout_id):
        # JOIN booking, users (student + instructor)
        # Retornar todos os detalhes
    
    async def process_withdrawal(payout_id, admin_id, pix_transaction_id, notes):
        # Validar status='pending_transfer'
        # Atualizar status='paid', paid_at, paid_by, pix_transaction_id, notes
        # Log de auditoria
        # Retornar payout atualizado
    
    async def fail_withdrawal(payout_id, admin_id, failure_reason):
        # Validar status='pending_transfer'
        # Atualizar status='available', failure_reason
        # Log de auditoria
        # Retornar payout atualizado
    
    # Estatísticas
    async def get_stats():
        # COUNT de pix pending
        # COUNT e SUM de withdrawals pending
        # COUNT e SUM de withdrawals paid today
        # Retornar objeto com estatísticas



C) Repository: admin_financial_repository.py
Arquivo: app/domain/repositories/admin_financial_repository.py
Queries Complexas:


class AdminFinancialRepository:
    
    @staticmethod
    def get_pending_pix_list(db, offset, limit):
        # SELECT com JOIN users
        # WHERE status='pending'
        # ORDER BY created_at ASC
        # LIMIT/OFFSET
    
    @staticmethod
    def get_pending_withdrawals_list(db, transfer_method, offset, limit):
        # SELECT payouts com JOIN users, withdrawal_methods
        # WHERE status='pending_transfer'
        # Optional: AND transfer_method=?
        # ORDER BY requested_at ASC
        # LIMIT/OFFSET
    
    @staticmethod
    def get_withdrawal_full_details(db, payout_id):
        # SELECT com múltiplos JOINs:
        # - bookings (aula)
        # - users (instrutor + aluno)
        # - withdrawal_methods (Pix)
        # - payments (método de pagamento original)
        # Retornar objeto completo
    
    @staticmethod
    def get_financial_stats(db):
        # 3-4 queries separadas:
        # COUNT pix pending
        # COUNT + SUM withdrawals pending
        # COUNT + SUM withdrawals paid today (paid_at >= TODAY)
        # Retornar dict


D) Schemas: admin_financial.py
Arquivo: app/presentation/schemas/admin_financial.py

# Request Schemas
class ApprovePixRequest(BaseModel):
    pass  # vazio, validação automática

class RejectPixRequest(BaseModel):
    reason: str = Field(..., min_length=10, max_length=500)

class ProcessWithdrawalRequest(BaseModel):
    pix_transaction_id: str = Field(..., min_length=5, max_length=100)
    notes: Optional[str] = Field(None, max_length=500)

class FailWithdrawalRequest(BaseModel):
    failure_reason: str = Field(..., min_length=10, max_length=500)

# Response Schemas
class PendingPixResponse(BaseModel):
    id: str
    instructor_id: str
    instructor_name: str
    instructor_email: str
    method_type: str
    pix_key_type: str
    pix_key: str
    mp_email: Optional[str]
    created_at: str
    days_waiting: int

class PendingWithdrawalResponse(BaseModel):
    id: str
    instructor_id: str
    instructor_name: str
    net_amount: float
    pix_key: str
    transfer_method: str
    requested_at: str
    days_waiting: int
    booking_date: str

class WithdrawalDetailResponse(BaseModel):
    # Todos os campos do payout
    # + dados do instrutor
    # + dados da aula (booking)
    # + dados do aluno
    # + dados do Pix
    pass  # expandir conforme necessário

class FinancialStatsResponse(BaseModel):
    pix_pending_count: int
    withdrawals_pending_count: int
    withdrawals_pending_amount: float
    withdrawals_processed_today: int
    withdrawals_processed_today_amount: float

E) Segurança e Validações
Middleware de Admin

# Em app/core/dependencies.py

def get_current_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

# Usar em todos os endpoints:
# current_admin: User = Depends(get_current_admin)


Validações de Estado


# Antes de aprovar Pix:
if method.status != 'pending':
    raise HTTPException(409, "Only pending methods can be approved")

# Antes de processar saque:
if payout.status != 'pending_transfer':
    raise HTTPException(409, "Only pending transfers can be processed")

# Verificar se instrutor tem Pix validado antes de processar:
if withdrawal_method.status != 'validated':
    raise HTTPException(400, "Instructor doesn't have validated Pix")


    Auditoria


# Registrar TODAS as ações do admin:
log_audit(
    db=db,
    action="PIX_APPROVED",  # ou PIX_REJECTED, WITHDRAWAL_PROCESSED, etc
    request=request,
    user_id=current_admin.id,
    entity_type="withdrawal_methods",  # ou "instructor_payouts"
    entity_id=method_id,
    metadata={"reason": reason}  # se aplicável
)
```

---

## 🎨 3. FRONTEND - ESTRUTURA DE TELAS

### **Navegação Admin**
```
app/
├── presentation/
│   ├── navigation/
│   │   ├── AdminStack.tsx (CRIAR - se não existir)
│   │   └── AdminDrawer.tsx (CRIAR - se não existir)
│   ├── screens/
│   │   └── admin/
│   │       ├── AdminDashboardScreen.tsx (já existe ou criar)
│   │       ├── AdminPixValidationListScreen.tsx (CRIAR)
│   │       ├── AdminPixValidationDetailScreen.tsx (CRIAR)
│   │       ├── AdminWithdrawalListScreen.tsx (CRIAR)
│   │       └── AdminWithdrawalDetailScreen.tsx (CRIAR)
│   └── repositories/
│       └── AdminFinancialRepository.ts (CRIAR)
```

---

### **A) Tela 1: Dashboard Admin**

**Arquivo:** `AdminDashboardScreen.tsx`

#### **Componentes:**
```
┌─────────────────────────────────────┐
│   DASHBOARD FINANCEIRO ADMIN        │
├─────────────────────────────────────┤
│                                     │
│  📋 Validações de Pix Pendentes     │
│      5 aguardando validação         │
│      [Ver Todas]                    │
│                                     │
│  💰 Saques Pendentes                │
│      12 saques (R$ 1.234,56)        │
│      [Ver Todos]                    │
│                                     │
│  ✅ Processados Hoje                │
│      8 saques (R$ 890,12)           │
│      [Ver Histórico]                │
│                                     │
└─────────────────────────────────────┘

Dados Necessários:

interface AdminStats {
  pix_pending_count: number;
  withdrawals_pending_count: number;
  withdrawals_pending_amount: number;
  withdrawals_processed_today: number;
  withdrawals_processed_today_amount: number;
}

// GET /admin/financial/stats
const stats = await AdminFinancialRepository.getStats();
```

---

### **B) Tela 2: Lista de Validações de Pix**

**Arquivo:** `AdminPixValidationListScreen.tsx`

#### **UI:**
```
┌─────────────────────────────────────┐
│   VALIDAÇÕES DE PIX PENDENTES       │
├─────────────────────────────────────┤
│                                     │
│  Card 1:                            │
│  👤 João Silva                      │
│  📧 joao@email.com                  │
│  🔑 CPF: ***123                     │
│  📅 Aguardando há 2 dias            │
│  [Validar] [Rejeitar]               │
│                                     │
│  Card 2:                            │
│  👤 Maria Santos                    │
│  📧 maria@email.com                 │
│  🔑 Email: maria***@gmail.com       │
│  📅 Aguardando há 5 dias            │
│  [Validar] [Rejeitar]               │
│                                     │
└─────────────────────────────────────┘


Funcionalidades:

Lista: FlatList com cards
Paginação: Carregar mais ao rolar
Filtros: Tipo de chave (CPF, Email, etc)
Ações rápidas: Validar/Rejeitar direto do card
Detalhes: Tap no card → tela de detalhes

Dados:


interface PendingPix {
  id: string;
  instructor_name: string;
  instructor_email: string;
  pix_key_type: string;
  pix_key: string;  // mascarado: ***123
  created_at: string;
  days_waiting: number;
}

// GET /admin/financial/pix-validations/pending
const list = await AdminFinancialRepository.getPendingPixList(page);
```

---

### **C) Tela 3: Detalhes de Validação de Pix**

**Arquivo:** `AdminPixValidationDetailScreen.tsx`

#### **UI:**
```
┌─────────────────────────────────────┐
│   VALIDAR CHAVE PIX                 │
├─────────────────────────────────────┤
│                                     │
│  INSTRUTOR                          │
│  Nome: João Silva                   │
│  Email: joao@email.com              │
│  CPF: 123.456.789-01                │
│                                     │
│  CHAVE PIX                          │
│  Destino: Outro Banco               │
│  Tipo: CPF                          │
│  Chave: 123.456.789-01              │
│                                     │
│  HISTÓRICO                          │
│  Cadastrado em: 10/01/2026          │
│  Aguardando há: 2 dias              │
│                                     │
│  ─────────────────────────          │
│                                     │
│  [✅ Validar]                       │
│  [❌ Rejeitar]                      │
│                                     │
└─────────────────────────────────────┘
```

#### **Ações:**

**Validar:**
- Confirmar via Alert
- `PATCH /admin/financial/pix-validations/{id}/approve`
- Sucesso → Toast "Chave validada!" → Voltar

**Rejeitar:**
- Abrir modal com TextInput "Motivo da rejeição"
- Validar: min 10 chars
- `PATCH /admin/financial/pix-validations/{id}/reject`
- Sucesso → Toast "Chave rejeitada" → Voltar

---

### **D) Tela 4: Lista de Saques Pendentes**

**Arquivo:** `AdminWithdrawalListScreen.tsx`

#### **UI:**
```
┌─────────────────────────────────────┐
│   SAQUES PENDENTES                  │
├─────────────────────────────────────┤
│  Filtro: [Todos] [Manual] [Auto]   │
│                                     │
│  Card 1:                            │
│  👤 João Silva                      │
│  💰 R$ 93,00                        │
│  🔑 Pix: ***123 (CPF)               │
│  📅 Aula: 12/01/2026                │
│  ⏱️ Aguardando há 1 dia             │
│  [Processar]                        │
│                                     │
│  Card 2:                            │
│  👤 Maria Santos                    │
│  💰 R$ 150,00                       │
│  🔑 Pix: ***@gmail.com              │
│  📅 Aula: 10/01/2026                │
│  ⏱️ Aguardando há 3 dias            │
│  [Processar]                        │
│                                     │
└─────────────────────────────────────┘
```

#### **Funcionalidades:**

- **Filtros:** transfer_method (manual/automatic/todos)
- **Ordenação:** Por tempo de espera (mais antigos primeiro)
- **Badge:** Cor laranja se > 2 dias, vermelho se > 5 dias
- **Ação:** Tap no card → tela de detalhes

---

### **E) Tela 5: Detalhes de Saque**

**Arquivo:** `AdminWithdrawalDetailScreen.tsx`

#### **UI:**
```
┌─────────────────────────────────────┐
│   PROCESSAR SAQUE                   │
├─────────────────────────────────────┤
│                                     │
│  INSTRUTOR                          │
│  Nome: João Silva                   │
│  Pix: 123.456.789-01 (CPF)          │
│                                     │
│  AULA                               │
│  Aluno: Carlos Mendes               │
│  Data: 12/01/2026 10:00             │
│  Local: Rua ABC, 123                │
│                                     │
│  VALORES                            │
│  Valor bruto: R$ 100,00             │
│  Taxa (10%): R$ 10,00               │
│  Líquido: R$ 90,00                  │
│  Antecipado: Sim                    │
│                                     │
│  TRANSFERÊNCIA                      │
│  Método: Pix Manual                 │
│  Solicitado em: 11/01/2026          │
│  Aguardando há: 1 dia               │
│                                     │
│  ─────────────────────────          │
│                                     │
│  [✅ Marcar como Pago]              │
│  [❌ Marcar como Falho]             │
│                                     │
└─────────────────────────────────────┘
```

#### **Ações:**

**Marcar como Pago:**
- Abrir modal:
```
  Confirmar Pagamento
  
  ID da Transação Pix:
  [___________________________]
  
  Observações (opcional):
  [___________________________]
  
  [Cancelar] [Confirmar]
```
- Validar: pix_transaction_id obrigatório
- `POST /admin/financial/withdrawals/{id}/process`
- Sucesso → Toast "Saque processado!" → Voltar

**Marcar como Falho:**
- Abrir modal:
```
  Marcar Saque como Falho
  
  Motivo da falha:
  [___________________________]
  
  [Cancelar] [Confirmar]


  Validar: failure_reason obrigatório (min 10 chars)
POST /admin/financial/withdrawals/{id}/fail
Sucesso → Toast "Saque devolvido" → Voltar


F) Repository Frontend
Arquivo: AdminFinancialRepository.ts

export class AdminFinancialRepository {
  // Stats
  async getStats(): Promise<AdminStats>
  
  // Pix Validations
  async getPendingPixList(page: number): Promise<PendingPix[]>
  async getPixDetail(methodId: string): Promise<PixDetail>
  async approvePix(methodId: string): Promise<void>
  async rejectPix(methodId: string, reason: string): Promise<void>
  
  // Withdrawals
  async getPendingWithdrawals(filter?: string, page?: number): Promise<PendingWithdrawal[]>
  async getWithdrawalDetail(payoutId: string): Promise<WithdrawalDetail>
  async processWithdrawal(payoutId: string, data: ProcessData): Promise<void>
  async failWithdrawal(payoutId: string, reason: string): Promise<void>
}

📱 4. UX/UI - BOAS PRÁTICAS
Cores de Status

const statusColors = {
  // Pix
  'pending': '#FF9800',    // Laranja
  'validated': '#4CAF50',  // Verde
  'rejected': '#F44336',   // Vermelho
  'blocked': '#9E9E9E',    // Cinza
  
  // Saques
  'pending_transfer': '#2196F3',  // Azul
  'paid': '#4CAF50',              // Verde
  'failed': '#F44336',            // Vermelho
};

Badges de Tempo

// Saques aguardando há muito tempo
if (daysWaiting > 5) {
  badgeColor = 'red';    // URGENTE
  badgeIcon = 'alert';
} else if (daysWaiting > 2) {
  badgeColor = 'orange'; // ATENÇÃO
  badgeIcon = 'clock-alert';
} else {
  badgeColor = 'blue';   // NORMAL
  badgeIcon = 'clock-outline';
}

Confirmações


// SEMPRE confirmar ações críticas:
- Validar Pix → Alert
- Rejeitar Pix → Modal com motivo
- Processar Saque → Modal com ID transação
- Marcar como Falho → Modal com motivo


Feedback Visual

// Após ações:
- Toast de sucesso (verde)
- Toast de erro (vermelho)
- Loading indicator durante requests
- Pull-to-refresh nas listas


🔐 5. SEGURANÇA E CONTROLE
Autenticação

# TODOS os endpoints admin devem ter:
current_admin: User = Depends(get_current_admin)

# Verificar role em TODAS as requisições


Auditoria Completa

# Registrar TODAS as ações:
- PIX_APPROVED
- PIX_REJECTED
- WITHDRAWAL_PROCESSED
- WITHDRAWAL_FAILED

# Com metadata:
- ID do admin
- Timestamp
- Dados modificados
- Razão (se aplicável)

Logs Detalhados

# Backend logging:
logger.info(f"Admin {admin_id} approved Pix {method_id}")
logger.warning(f"Admin {admin_id} rejected Pix {method_id}: {reason}")
logger.info(f"Admin {admin_id} processed withdrawal {payout_id}: {transaction_id}")


📊 6. QUERIES SQL IMPORTANTES
Dashboard Stats


-- Pix pendentes
SELECT COUNT(*) FROM instructor_withdrawal_methods WHERE status='pending';

-- Saques pendentes (count + soma)
SELECT 
  COUNT(*) as count,
  SUM(net_amount) as total
FROM instructor_payouts 
WHERE status='pending_transfer';

-- Processados hoje
SELECT 
  COUNT(*) as count,
  SUM(net_amount) as total
FROM instructor_payouts 
WHERE status='paid' 
  AND DATE(paid_at) = CURRENT_DATE;


Lista de Pix Pendentes

SELECT 
  m.id,
  m.pix_key_type,
  m.pix_key,
  m.created_at,
  u.full_name as instructor_name,
  u.email as instructor_email,
  EXTRACT(DAY FROM (NOW() - m.created_at)) as days_waiting
FROM instructor_withdrawal_methods m
JOIN users u ON u.id = m.user_id
WHERE m.status = 'pending'
ORDER BY m.created_at ASC
LIMIT 20 OFFSET 0;

Lista de Saques Pendentes


SELECT 
  p.id,
  p.net_amount,
  p.transfer_method,
  p.requested_at,
  u.full_name as instructor_name,
  w.pix_key,
  b.scheduled_date,
  EXTRACT(DAY FROM (NOW() - p.requested_at)) as days_waiting
FROM instructor_payouts p
JOIN users u ON u.id = p.instructor_id
JOIN instructor_withdrawal_methods w ON w.user_id = p.instructor_id
JOIN bookings b ON b.id = p.booking_id
WHERE p.status = 'pending_transfer'
ORDER BY p.requested_at ASC
LIMIT 20 OFFSET 0;


Detalhes Completos do Saque

SELECT 
  p.*,
  u_instructor.full_name as instructor_name,
  u_instructor.email as instructor_email,
  w.pix_key,
  w.pix_key_type,
  w.method_type,
  b.scheduled_date,
  b.location,
  u_student.full_name as student_name
FROM instructor_payouts p
JOIN users u_instructor ON u_instructor.id = p.instructor_id
JOIN instructor_withdrawal_methods w ON w.user_id = p.instructor_id
JOIN bookings b ON b.id = p.booking_id
JOIN users u_student ON u_student.id = b.student_id
WHERE p.id = ?;

🧪 7. TESTES RECOMENDADOS
Backend (Testes Unitários)


# test_admin_financial.py

def test_approve_pix_success():
    # Criar método pendente
    # Chamar endpoint approve
    # Verificar status='validated'
    # Verificar validated_at preenchido
    # Verificar audit_log criado

def test_reject_pix_without_reason():
    # Deve retornar erro 400

def test_process_withdrawal_invalid_status():
    # Tentar processar saque com status='available'
    # Deve retornar erro 409

def test_non_admin_access():
    # Tentar acessar com user role='instructor'
    # Deve retornar erro 403
```

### **Frontend (Testes Manuais)**
```
☐ Dashboard carrega stats corretamente
☐ Lista de Pix mostra pendentes
☐ Validar Pix funciona e atualiza lista
☐ Rejeitar Pix exige motivo
☐ Lista de saques filtra por tipo
☐ Processar saque exige ID transação
☐ Marcar como falho exige motivo
☐ Pull-to-refresh atualiza dados


📦 8. ORDEM DE IMPLEMENTAÇÃO SUGERIDA
Fase 1: Backend Base (2-3 dias)

✅ Criar admin_financial_repository.py
✅ Criar admin_financial_service.py
✅ Criar admin_financial.py (schemas)
✅ Criar admin_financial.py (router)
✅ Testar endpoints via Swagger/Postman

Fase 2: Frontend - Pix (2-3 dias)

✅ Criar AdminFinancialRepository.ts
✅ Criar AdminPixValidationListScreen.tsx
✅ Criar AdminPixValidationDetailScreen.tsx
✅ Testar fluxo completo de validação

Fase 3: Frontend - Saques (2-3 dias)

✅ Criar AdminWithdrawalListScreen.tsx
✅ Criar AdminWithdrawalDetailScreen.tsx
✅ Testar fluxo completo de processamento

Fase 4: Dashboard e Navegação (1-2 dias)

✅ Criar/Atualizar AdminDashboardScreen.tsx
✅ Adicionar rotas no AdminStack.tsx
✅ Adicionar itens no AdminDrawer.tsx

Fase 5: Polimento e Testes (1-2 dias)

✅ Ajustes de UX/UI
✅ Testes end-to-end
✅ Documentação

Total estimado: 8-13 dias

🎯 CHECKLIST FINAL
Backend

 Endpoints de listagem (Pix + Saques)
 Endpoints de ação (Aprovar/Rejeitar/Processar)
 Validações de estado
 Auditoria completa
 Middleware de admin
 Testes unitários

Frontend

 Repository com todos os métodos
 4 telas principais criadas
 Navegação configurada
 Confirmações em ações críticas
 Feedback visual (toasts, loading)
 Pull-to-refresh

Banco de Dados

 Nenhuma alteração necessária ✅
 Índices existentes suficientes ✅
 Constraints adequados ✅

Segurança

 Autenticação em todos endpoints
 Role check (admin only)
 Auditoria de todas ações
 Logs detalhados


💡 PONTOS DE ATENÇÃO
⚠️ Nunca permitir:

Admin processar sem ID de transação
Mudar status sem validar estado anterior
Ações sem auditoria

✅ Sempre validar:

Role do usuário
Estado atual antes de atualizar
Motivos em rejeições/falhas
Campos obrigatórios

🔍 Monitorar:

Saques aguardando > 5 dias
Pix pendentes > 7 dias
Taxa de rejeição de Pix
Tempo médio de processamento


Criar validação de CNH 

No seu InstructorDocument já existe:

verified = Column(Boolean, default=False)
verified_at = Column(DateTime(timezone=True))

Ou seja:

Upload da CNH → apenas preenche document_url

Validação (admin/backoffice, futuro) → seta:

verified = true

verified_at = now()

Nada disso conflita com o fluxo atual. Estamos certos conceitualmente:

Upload ≠ validação

São etapas distintas

O front só informa pendência, não valida

O que fizemos no Passo 11 apenas expõe um dado que já existe, não cria regra nova.

Confirmação antes de seguir

Posso manter:

verified no retorno do profile somente leitura

sem criar nenhuma rota de validação agora

Responda só: CONFIRMADO ou AJUSTAR.


PRÓXIMOS PASSOS (se necessário):

Validação admin (backend): endpoint para admin aprovar/rejeitar CNH
Indicador de verificação (frontend): mostrar se CNH foi verificada pelo admin
Bloqueio de ações (frontend): impedir agendamentos se CNH pendente
Notificações: avisar instrutor quando CNH for aprovada/rejeitada