📄 README - Perfil do Instrutor (Atualizado)
O que foi implementado
✅ Backend (API)
Endpoints criados:

POST /api/v1/instructors/profile - Criar perfil do instrutor
GET /api/v1/instructors/profile - Buscar perfil do instrutor logado
GET /api/v1/instructor/dashboard - Dashboard com métricas do instrutor
GET /api/v1/instructor/bookings - Listar aulas do instrutor (com filtro por status)
GET /api/v1/instructor/bookings/{id} - Detalhes de uma aula específica
POST /api/v1/instructor/bookings/{id}/accept - Aceitar solicitação
POST /api/v1/instructor/bookings/{id}/reject - Recusar solicitação
POST /api/v1/instructor/bookings/{id}/start - Iniciar aula (com código 4 dígitos)
POST /api/v1/instructor/bookings/{id}/finish - Finalizar aula
POST /api/v1/instructor/bookings/{id}/cancel - Cancelar aula

Ajustes no fluxo de autenticação:

POST /api/v1/auth/register agora cria apenas o User
Perfil do instrutor passou a ser criado separadamente
Validação de role no endpoint de criação de perfil

Modelo de dados (instructor_profiles):
Campos obrigatórios (v1):

city (string)
state (string, 2 letras)
categories (array de CNH)
price_per_hour (decimal)

Campos opcionais disponíveis no BD:

bio, experience_years, address, specialties
vehicle_*, credencial_*
rating_average, total_classes_given


✅ Frontend (React Native)
Navegação implementada:

RootNavigator
└─ InstructorDrawer (menu lateral)
   └─ InstructorStack (navegação de telas)
      ├─ InstructorDashboard
      ├─ InstructorBookings
      ├─ InstructorBookingDetail  ⭐ NOVO
      └─ InstructorProfile

Telas criadas:
InstructorDashboardScreen

Exibe KPIs (aulas hoje, pendentes, confirmadas, total)
Cards de ação rápida
Integrado com /instructor/dashboard

InstructorProfileScreen

Formulário de criação de perfil
Campos: cidade, estado, categorias CNH, preço/hora
Validação e integração com API

InstructorBookingsScreen

Listagem de aulas com filtros por status
Chips de filtro: Todas, Aguardando, Confirmadas, Em andamento, Concluídas
Pull-to-refresh
Navegação para detalhes
Cards visuais com status colorido

InstructorBookingDetailScreen ⭐ NOVO

Detalhamento completo da aula
Header visual com status
Seções: Informações da Aula, Aluno, Observações
Ações contextuais por status:

PENDING: Aceitar | Recusar
ACCEPTED: Iniciar Aula (modal código) | Cancelar
IN_PROGRESS: Finalizar Aula
COMPLETED/REJECTED/CANCELLED: Visualização apenas


Modais para:

Código de início (4 dígitos)
Cancelamento com motivo



InstructorDrawer (Menu Lateral)

Início
Minhas Aulas ⭐ FUNCIONAL
Perfil
Financeiro (placeholder)
Mensagens (placeholder)
Ajuda
Sair

Repositórios atualizados:
InstructorRepository ⭐ EXPANDIDO

createProfile()
getProfile()
getDashboard()
listBookings(status?) ⭐ NOVO
getBookingById(id) ⭐ NOVO
acceptBooking(id) ⭐ NOVO
rejectBooking(id) ⭐ NOVO
startBooking(id, code) ⭐ NOVO
finishBooking(id) ⭐ NOVO
cancelBooking(id, reason?) ⭐ NOVO

Entidades criadas:

InstructorProfileCreateData
InstructorProfileResponse
BookingAPIResponse (contrato com backend)

Fluxo de autenticação corrigido:

Register → apenas cria User
Login → verifica role e redireciona para stack correto
Perfil criado depois, via tela dedicada


✅ Banco de Dados
Tabela instructor_profiles com 33 campos preparados para evolução:

Identificação legal (credencial DETRAN, CNH)
Localização (cidade, estado, endereço, coordenadas)
Serviço (categorias, preço, especialidades)
Veículo (marca, modelo, ano, placa, fotos)
Governança (verificação, ratings, total de aulas)

Tabela bookings com campos para gestão completa:

Status flow (pending → accepted → in_progress → completed)
Timestamps de controle (started_at, finished_at, cancelled_at)
Código de início (start_code, start_code_used)
Cancelamento (cancelled_by, cancellation_reason)


✅ Correções técnicas realizadas:

Enum UserRole: Alterado de uppercase para lowercase

INSTRUCTOR = 'instructor' // era 'INSTRUCTOR'


useAuth.ts: Funções login e register agora usam saveAuth() para persistir corretamente
Dependências instaladas:

@react-navigation/drawer
react-native-gesture-handler
react-native-reanimated
react-native-worklets


Babel configurado com plugin do Reanimated


Decisões arquiteturais importantes
🎯 Separação de concerns

Cadastro ≠ Ativação: Instrutor pode se registrar sem perfil completo
Perfil profissional é entidade separada: Criado via endpoint dedicado
Frontend valida UX, backend valida autorização: Role é validado no token JWT

🎯 Navegação baseada em role

🎯 Campos progressivos

v1: cidade, estado, categorias CNH, preço
v2+: documentos, veículos, verificação, dados bancários

🎯 Máquina de estados (Bookings)
Transições permitidas pelo instrutor:


pending → accepted              (aceitar)
pending → rejected              (recusar)
accepted → in_progress          (iniciar com código)
accepted → cancelled_by_instructor  (cancelar)
in_progress → completed         (finalizar)


📊 Atualizações no ROADMAP
🟢 CONCLUÍDO (v1) - ADIÇÕES
Backend ⭐ NOVO

✅ Endpoints completos de gestão de aulas (bookings)

Listar, detalhar, aceitar, recusar, iniciar, finalizar, cancelar


✅ Validação de transições de status
✅ Código de início de aula (4 dígitos)
✅ Sistema de cancelamento com motivo

Frontend ⭐ NOVO

✅ InstructorBookingsScreen - Listagem com filtros
✅ InstructorBookingDetailScreen - Detalhes e ações
✅ Modais de interação (código de início, cancelamento)
✅ InstructorRepository expandido com 7 novos métodos
✅ Navegação completa entre telas de aulas


🟡 EM DESENVOLVIMENTO - ATUALIZAÇÕES
5️⃣ Gestão de Aulas (Bookings) - MOVIDO DE "EM DESENVOLVIMENTO" PARA "CONCLUÍDO"
O que estava pendente:


- ❌ Frontend: InstructorBookingsScreen (já existe, melhorar)
- ❌ Frontend: Tela de detalhes da aula
- ❌ Frontend: Notificações push

+ ✅ Frontend: InstructorBookingsScreen (completa com filtros)
+ ✅ Frontend: InstructorBookingDetailScreen (completa)
+ ✅ Backend: Endpoints prontos para integração
+ ✅ Máquina de estados implementada

O que ainda falta (próxima iteração):

 Notificações push (novas solicitações)
 Timer de aula em andamento
 Mapa com localização na tela de detalhes
 Botão de emergência


📝 Resumo do Progresso
✅ Gestão de Aulas (Instrutor) - 85% COMPLETO
FuncionalidadeBackendFrontendStatusListar aulas✅✅PRONTOFiltrar por status✅✅PRONTOVer detalhes✅✅PRONTOAceitar solicitação✅✅PRONTORecusar solicitação✅✅PRONTOIniciar aula (código)✅✅PRONTOFinalizar aula✅✅PRONTOCancelar aula✅✅PRONTONotificações push🔄🔄PENDENTETimer em tempo real❌❌PENDENTEMapa na tela❌❌PENDENTE

🎯 Próximos Passos Recomendados
Curto Prazo (1-2 semanas)

✅ Gestão de Aulas → CONCLUÍDO
🔄 Edição de perfil (PATCH endpoint + tela)
🔄 Gestão de veículos (CRUD completo)

Médio Prazo (2-4 semanas)

Upload e validação de documentos (CNH, credencial)
Disponibilidade e agenda (telas frontend)
Dados bancários e relatório financeiro básico


Última atualização: 25/12/2024
Versão atual: v1.1 (MVP Instrutor - Perfil + Gestão de Aulas)