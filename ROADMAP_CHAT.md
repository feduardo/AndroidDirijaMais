Roadmap — Construção do Chat (Instrutor ↔ Aluno)
Objetivo

Habilitar comunicação segura entre aluno e instrutor somente quando houver aula ativa, com bloqueio automático ao finalizar a aula, mantendo histórico em modo leitura.

1) Banco de Dados (Postgres)
1.1 Situação inicial

Existia a tabela messages com:

sender_id, receiver_id, content, is_read, read_at, anexos, expires_at, flags e índices.

Não existia vínculo com aula (bookings), então não dava para aplicar regra “chat abre/fecha por booking”.

1.2 Alterações feitas na tabela messages

Adicionado campo booking_id uuid

Criada FK:

messages.booking_id -> bookings.id com ON DELETE CASCADE

Tornado booking_id NOT NULL (tabela estava vazia)

Criado índice:

idx_messages_booking_created_at (booking_id, created_at DESC)

Resultado: cada mensagem pertence a uma aula (booking). Agora dá para controlar chat por status do booking.

2) Backend (FastAPI + SQLAlchemy)
2.1 Model ORM

Criado model Message em app/domain/entities/models.py, espelhando a tabela:

colunas + constraints (no_self_message, valid_attachment, attachment_type_check)

FKs para bookings e users

2.2 Schemas (Pydantic)

Criado app/presentation/schemas/messages.py com:

MessageOut

MessageCreateIn

MessagesListOut

2.3 Router (Endpoints)

Criado app/presentation/routers/messages.py

Registrado no app/main.py via app.include_router(messages.router)

2.4 Segurança e regras do chat

Autenticação padronizada usando:

from app.core.security import get_current_user (corrigido; não existe em core/dependencies.py)

Regras aplicadas no servidor:

Só acessa quem participa do booking (student_id ou instructor_id)

Chat aberto somente se booking.status ∈ {accepted, in_progress}

Chat fechado em status final (ex.: completed) → envio retorna 409 (“somente leitura”)

2.5 Endpoints implementados

GET /api/v1/messages/bookings/{booking_id}

Retorna mensagens do booking + chat_enabled + booking_status

POST /api/v1/messages/bookings/{booking_id}

Envia mensagem (somente se chat aberto)

POST /api/v1/messages/bookings/{booking_id}/read

Marca como lidas (quando o usuário é receiver)

2.6 Testes executados (curl)

Participante consegue listar e enviar

Não participante recebe 403

Após alterar booking para completed, envio bloqueado (409)

3) Frontend (React Native)
3.1 Cliente HTTP

Confirmado que httpClient já injeta:

Authorization: Bearer <token>

X-Device-Id

Base URL configurada via ENV.API_URL

3.2 Repositório

Criado src/infrastructure/repositories/MessageRepository.ts

listByBooking

send

markAsRead

3.3 Navegação

Adicionadas rotas no StudentStack:

StudentMessages

StudentChat

Ligado menu “Mensagens” no drawer do aluno para navegar para StudentMessages

Corrigido problema de import (@/ vs relativo) usando imports relativos no stack

3.4 Telas

StudentMessagesScreen.tsx

Estratégia UX “B”:

Ativos primeiro (accepted, in_progress)

Encerrados depois

Ordenação por data da aula (scheduled_date)

StudentChatScreen.tsx

Lista mensagens do booking

Envia mensagem se chatEnabled

Mostra aviso quando chat está encerrado

Ajustes de UI feitos manualmente

3.5 Correções realizadas no front

Removido loop pesado que fazia GET messages para cada booking na lista (evita N requests)

Corrigido bug de navegação causado por contexto (Student vs Instructor) durante testes

Corrigido bug de alinhamento (mensagens todas do mesmo lado):

causa: isSentByMe fixo

solução: comparar item.sender_id com user.id do authStore

Estado atual

Backend e BD: chat funcional, seguro e com fechamento por aula.

Front (Aluno): lista + chat funcionando, com ordenação e status ativo/encerrado.

Próximo (se decidir): repetir as mesmas telas para Instrutor (ou reaproveitar componentes).