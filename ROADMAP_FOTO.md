Roadmap — Implementação de Avatar (Foto de Perfil)

Objetivo
Implementar avatar de usuário separado de documentos sensíveis (CNH), com suporte a:

Avatar público (vitrine)

Avatar autenticado (usuário logado)

Sem impacto em CNH ou outros fluxos

Backend

Estrutura de storage

Criado diretório persistente:
storage/uploads/avatars

Inicialização garantida no lifespan via ensure_upload_dirs().

Upload de avatar

Endpoint autenticado: POST /api/v1/auth/avatar

Valida tipo e tamanho da imagem.

Salva arquivo como <user_id>.jpg|png.

Atualiza user.avatar_url no banco.

Avatar autenticado (privado)

Endpoint: GET /api/v1/auth/avatar

Retorna a imagem do usuário logado.

Usado em telas internas (perfil).

Avatar público (vitrine)

Diretório avatars montado como static:
/public/avatars/<user_id>.jpg

Não requer autenticação.

Usado para listagens públicas e cards.

Separação clara de responsabilidades

Avatar: público / não sensível.

CNH: restrita, nunca via StaticFiles.

Frontend

Upload de avatar

Implementado em InstructorRepository.uploadAvatar.

Envia multipart/form-data para /api/v1/auth/avatar.

Modelo de dados

Diferenciado:

avatar_url → avatar real (novo, backend)

avatar → legado/mock (mantido apenas como fallback)

Correções de tipagem

Ajustado User para suportar avatar_url.

Imports de ENV corrigidos onde necessário.

Mapeamento de instrutores

InstructorRepository.listInstructors() prioriza:

avatar: item.avatar_url || item.avatar || null


Removido uso efetivo de pravatar fora de mocks.

Validação

Confirmado via curl:

Upload OK

Acesso público OK

Acesso autenticado OK

Estado Atual

✅ Avatar funciona para instrutor e student.

✅ Avatar público aparece sem token.

✅ Avatar autenticado disponível para perfil.

❌ CNH fora de escopo (intencional).


Diretriz CNH — O que já foi feito e o que falta (DB → Backend → Front)
1) Regras de negócio (obrigatórias)

CNH é sensível e sigilosa.

Acesso proibido para terceiros.

Somente o próprio instrutor dono pode:

enviar (upload)

visualizar (download)

substituir

Nunca servir CNH via StaticFiles.

Instrutor: CNH obrigatória (com pendência visível no front).

Aluno: não tem CNH (ignorar).


2) Banco de Dados (DB)
Já feito

Modelo InstructorDocument criado com campos:

instructor_id (FK users.id)

type (usar "CNH")

document_number

category (ARRAY)

expires_at

document_url (caminho interno lógico do arquivo)

verified, verified_at

is_active (controle de versão/atual)

Modelo User já existe e separa avatar (avatar_url) de CNH.

Ainda falta / diretriz

Garantir 1 CNH ativa por instrutor:

regra de atualização: ao subir uma nova CNH, marcar a anterior como is_active=false.

(Opcional recomendado) criar índice/unique parcial:

(instructor_id, type) com is_active=true se quiser garantir na base.

3) Storage (arquivos)
Já feito

Estrutura base criada:

storage/uploads/

storage/uploads/avatars (público)

storage/uploads/documents/cnh (sensível)

ensure_upload_dirs() sendo chamado no lifespan.

Diretriz

CNH deve ficar em:

storage/uploads/documents/cnh/<user_id>/<uuid>.jpg

O que vai para o DB (document_url) deve ser apenas caminho lógico, ex:

documents/cnh/<user_id>/<uuid>.jpg

Nunca expor o caminho absoluto do container.


4) Backend (API)
Já feito

Upload CNH já existe e retorna:

POST /api/v1/instructors/documents/cnh/photo

resposta: { "document_url": "documents/cnh/<user_id>/<uuid>.jpg" }

Perfil do instrutor retorna CNH dentro de GET /api/v1/instructors/profile:

cnh.number, expires_at, categories, document_url, verified

O que deve ser ajustado (crítico)

Endpoint de download CNH (autenticado e dono)

Criar: GET /api/v1/instructors/documents/cnh/photo (ou /file)

Deve:

exigir token

pegar current_user.id

localizar a CNH ativa do próprio usuário

retornar FileResponse com image/jpeg ou image/png

Se não houver CNH: 404

Se tentar acessar CNH de outro: nem deve existir rota por user_id (evita vazamento)

Validação forte (upload_validation)

Max size: 2MB total (conforme sua regra)

se CNH + avatar juntos: aplicar por endpoint, ou controlar no front antes.

Validar:

content-type permitido (image/jpeg, image/png)

tamanho real (não confiar em header)

opcional: verificar assinatura (magic bytes) pra evitar arquivo falso

Persistência correta no DB

No upload de CNH:

salvar/atualizar registro InstructorDocument(type="CNH")

setar is_active=true, verified=false, document_url=...

se existia CNH anterior: is_active=false

Pendência no perfil

A API deve permitir o front inferir pendência:

se cnh == null → pendente upload

se cnh.verified == false → pendente validação/admin (se existir esse fluxo)


5) Frontend (App)


O que deve ser feito

Picker + envio

Usar react-native-image-picker

Ao selecionar imagem:

validar tamanho ≤ 2MB no front (antes de enviar)

enviar via uploadCnhPhoto()

Exibição segura

CNH nunca deve usar URL pública.

Para exibir CNH na tela do instrutor:

usar GET /api/v1/instructors/documents/cnh/photo com token

imagem exibida via Image apontando para endpoint autenticado

se necessário, usar um ?t=timestamp para bust cache após troca

Indicador de pendência

Se profile.cnh == null:

mostrar aviso “CNH pendente”

bloquear ações que dependem de CNH (se essa regra existir)

Se profile.cnh.verified === false:

mostrar “Em validação”

Se verified === true:

mostrar “Validada”

Evitar vazamento

Nunca logar document_url da CNH no console.

Nunca salvar em cache público.

Não compartilhar link.


Roadmap (correto e verificável) — Avatar e CNH
1) Avatar (Foto de Perfil) — FEITO
Backend

Criado fluxo de storage local para uploads:

app/core/storage.py com ensure_upload_dirs()

Diretórios:

storage/uploads/avatars

storage/uploads/documents (base, sem expor CNH)

Garantido bootstrap no start do app:

ensure_upload_dirs() chamado no lifespan() do FastAPI

Upload autenticado do avatar:

POST /api/v1/auth/avatar (multipart)

Salva arquivo como <user_id>.jpg|png em storage/uploads/avatars

Atualiza users.avatar_url no banco

Avatar público para vitrine (sem token):

app.mount("/public/avatars", StaticFiles(...))

URL final: GET /public/avatars/<user_id>.jpg

Testes manuais confirmados:

curl -I /public/avatars/<user_id>.jpg retornando 200 image/jpeg

Frontend

Ajustado tipagem do usuário para aceitar:

avatar_url?: string | null

Upload do avatar implementado no repositório:

InstructorRepository.uploadAvatar(image) faz POST multipart /api/v1/auth/avatar

Exibição do avatar no app:

Vitrine (guest) deve usar URL pública /public/avatars/<user_id>.jpg (ainda depende do card estar passando essa URL corretamente)

2) CNH — NÃO FEITO NO FRONT (apenas backend + “stub”)
Backend — FEITO

Endpoint de upload existente e funcionando (testado via curl):

POST /api/v1/instructors/documents/cnh/photo (multipart)

Retorna document_url (path interno)

CNH deve ser restrita:

Nunca expor por StaticFiles

Acesso somente via endpoint autenticado do próprio usuário (regra definida)

Frontend — NÃO FEITO (status real)

Existe somente o método no repositório (stub pronto), mas não está sendo usado em tela nenhuma:

InstructorRepository.uploadCnhPhoto(image) implementado

Não existe no app hoje:

botão “Enviar CNH”

image picker para CNH

chamada de uploadCnhPhoto()

exibição/preview da imagem da CNH

tratamento de “pendência CNH” no fluxo do instrutor


Já realizados

IMPLEMENTAÇÃO COMPLETA - BACKEND + FRONTEND
O que foi implementado:
BACKEND:

✅ Endpoint GET autenticado da CNH (/api/v1/instructors/documents/cnh/photo)
✅ Validação de dono (apenas o próprio instrutor acessa)
✅ FileResponse com imagem real
✅ Storage seguro (fora de StaticFiles)
✅ Path relativo no banco

FRONTEND:

✅ Método getCnhPhoto() no repositório (com base64)
✅ Método uploadCnhPhoto() já existia
✅ Estados de controle (cnhPhotoUrl, cnhPhotoUploading, cnhPhotoExists)
✅ Carregamento automático da foto ao abrir perfil
✅ Upload com feedback visual
✅ Indicador de pendência quando não há CNH
✅ Preview da imagem após upload
✅ Botão de substituição quando CNH já existe


🎯 PRÓXIMOS PASSOS (se necessário):

Validação admin (backend): endpoint para admin aprovar/rejeitar CNH
Indicador de verificação (frontend): mostrar se CNH foi verificada pelo admin
Bloqueio de ações (frontend): impedir agendamentos se CNH pendente
Notificações: avisar instrutor quando CNH for aprovada/rejeitada