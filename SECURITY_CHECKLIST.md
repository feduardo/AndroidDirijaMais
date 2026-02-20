# 🔒 Security Checklist - AppDirijaMais

## 🎯 Prioridades por Fase

### ❌ CRÍTICO (Resolver ANTES do Deploy)

- [ ] HTTPS em todas as comunicações (backend)
- [ ] Validação de dados no servidor (backend)
- [ ] Senhas com hash (bcrypt/argon2 no backend)
- [ ] Nenhuma credencial hardcoded
- [ ] Tokens criptografados (✅ implementado - EncryptedStorage)

### ⚠️ ALTA (Primeira semana de produção)

- [ ] Rate limiting (express-rate-limit no backend)
- [ ] Headers de segurança (helmet.js no backend)
- [ ] Logs estruturados sem dados sensíveis
- [ ] Backup automático configurado (Hostinger)
- [ ] CORS configurado corretamente

### 📊 MÉDIA (Primeiro mês)

- [ ] SSL Pinning (react-native-ssl-pinning)
- [ ] Code obfuscation (ProGuard/R8)
- [ ] Monitoramento avançado (Sentry)
- [ ] Políticas de privacidade documentadas

---

## 🚨 SINAIS DE ALERTA - STOP DEPLOY

**PARE o deploy imediatamente se:**

- ❌ Credenciais hardcoded no código fonte
- ❌ Comunicação HTTP (sem SSL) em produção
- ❌ Validação de dados apenas no frontend
- ❌ Sem rate limiting em endpoints de autenticação
- ❌ Logs contendo senhas/tokens
- ❌ Permissões desnecessárias solicitadas no app

---

## ✅ Status Atual (Dev)

### Implementado

- ✅ Tokens armazenados com criptografia (EncryptedStorage)
- ✅ Auto-refresh de tokens (401 handler)
- ✅ Validação client-side (LoginUseCase)
- ✅ Configuração por ambiente (env.ts)
- ✅ Nenhuma credencial hardcoded
- ✅ Estrutura Clean Architecture (separação de concerns)

### Pendente (Backend)

- ❌ Validação server-side
- ❌ Rate limiting
- ❌ Hash de senhas
- ❌ Headers de segurança
- ❌ SSL certificate

---

## Checklist Backend (Quando Criar)

```typescript
// express-rate-limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 tentativas por 15min
  message: 'Muitas tentativas de login',
});
app.use('/api/auth/login', limiter);

// helmet
app.use(helmet());

// bcrypt
const hashedPassword = await bcrypt.hash(password, 10);

// Joi validation
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
```

---

## 🔍 Auditoria de Logs

### Correto

```typescript
console.log('REQUEST:', method, url);
console.log('USER_LOGIN:', userId); // Apenas ID
```

### NUNCA

```typescript
console.log('PASSWORD:', password); // NUNCA
console.log('TOKEN:', token); // NUNCA
console.log('USER_DATA:', fullUserObject); // Cuidado
```

---

**Última atualização:** 08/12/2025
**Responsável:** Roberto Caldeira Flores Junior
**Próxima revisão:** Antes do deploy backend


Excelente pergunta! Sim, existem técnicas para isso, mas nenhuma é 100% infalível. Vou te explicar as opções:

Técnicas de "App Identity"
1. Certificate Pinning (SSL Pinning)
Garante que o app só aceita certificados SSL específicos do seu servidor.
Prós:

Dificulta ataques man-in-the-middle
Impede proxy reverso (Burp Suite, Charles)

Contras:

Não impede requisições de fora do app se o atacante tiver o token
Complexo de manter (renovação de certificados)


2. App Attestation (Device/App Integrity)
Verifica se a requisição vem de um app legítimo instalado em dispositivo real.
Opções:

Google Play Integrity API (Android)
Apple App Attest (iOS)

Como funciona:

App envia "prova de integridade" a cada requisição
Backend valida com Google/Apple
Detecta: emuladores, apps modificados, root/jailbreak

Prós:

Mais robusto
Dificulta scripts automatizados

Contras:

Não é infalível (existe bypass)
Adiciona latência
Custo de implementação


3. Token com Metadata do Device
Inclui informações do dispositivo no token JWT.
Exemplo:

# No login, armazena fingerprint do device
device_fingerprint = hash(user_agent + device_id + app_version)

# Valida em cada requisição
if current_fingerprint != token.device_fingerprint:
    raise Unauthorized


Prós:

Simples de implementar
Dificulta roubo de token

Contras:

Fingerprint pode ser falsificado


A Verdade Dura
Se alguém tem um token válido, pode usá-lo fora do app. Token JWT é como uma chave: quem tem, acessa.
Mas você pode:

Rate limiting agressivo (já tem)
Tokens de curta duração (15min + refresh token)
Monitoramento de anomalias (IPs suspeitos, requests em massa)
Device binding (token válido só para aquele device)


Minha Recomendação para Você
Para uma autoescola, o custo-benefício de App Attestation não compensa. Foque em:

✅ Tokens de curta duração (você já tem refresh tokens?)
✅ Rate limiting por endpoint sensível
✅ Logs de auditoria (já tem audit_logs)
✅ Alertas de comportamento suspeito

Pergunta: Você quer implementar alguma dessas camadas extras ou está satisfeito com a segurança atual?


tudo certo!

agora uma questão de segurança, consigo criar uma identidade do meu app que somente as transações só ocorram a partir dele? parece estranha a pergunta, mas é por exemplo

um hacker consegue um token e tenta extrair algo do bd, mas se somente for pelo meu app, ele não conseguirá