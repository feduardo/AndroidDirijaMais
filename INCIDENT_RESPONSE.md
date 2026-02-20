# 🚨 Plano de Resposta a Incidentes - AppDirijaMais

## 📋 Informações de Contato

### Equipe de Segurança

- **Líder Técnico**: Roberto Flores
- **Email**: roberto@dirijamais.com.br
- **Telefone**: +55 XX XXXXX-XXXX
- **Disponibilidade**: 24/7 para incidentes críticos

### Contatos de Emergência

- **Hostinger Suporte**: suporte via painel
- **GitHub Security**: security@github.com
- **Autoridades**: 181 (CERT.br)

---

## 🎯 Classificação de Severidade

### 🔴 CRÍTICO (P0) - Resposta Imediata

- Vazamento de dados de usuários
- Comprometimento de servidor
- Pagamentos fraudulentos em massa
- App completamente offline

**SLA**: Resposta em 15 minutos

### 🟠 ALTA (P1) - Resposta em 1 hora

- Vulnerabilidade explorada ativamente
- Performance degradada (>50% slower)
- Funcionalidade crítica quebrada (login, pagamento)

**SLA**: Resposta em 1 hora

### 🟡 MÉDIA (P2) - Resposta em 4 horas

- Bug afetando funcionalidade secundária
- Performance degradada (<50% slower)
- Erros intermitentes

**SLA**: Resposta em 4 horas

### 🟢 BAIXA (P3) - Resposta em 24 horas

- Issues cosméticos
- Melhorias de UX
- Documentação

**SLA**: Resposta em 24 horas

---

## 🔥 Procedimento de Resposta

### Fase 1: DETECÇÃO (0-15 min)

**Canais de detecção:**

- Sentry alerts
- Monitoramento de servidor (uptime)
- Relatos de usuários
- Dependabot security alerts

**Ações imediatas:**

1. Confirmar o incidente
2. Classificar severidade (P0-P3)
3. Notificar líder técnico
4. Criar incident ticket

---

### Fase 2: CONTENÇÃO (15 min - 1h)

#### Se for vazamento de dados:

```bash
# 1. Revogar todos os tokens ativos
psql -d appdirijamais -c "UPDATE refresh_tokens SET revoked = true WHERE revoked = false;"

# 2. Forçar logout de todos os usuários (invalidar sessões)
redis-cli FLUSHDB

# 3. Desativar endpoint comprometido
# nginx.conf
location /api/vulnerable-endpoint {
    return 503;
}
sudo systemctl reload nginx
```

#### Se for servidor comprometido:

```bash
# 1. Isolar servidor (desconectar da internet se possível)
sudo ufw deny out

# 2. Snapshot do estado atual (forense)
sudo dd if=/dev/sda of=/backup/forensic-$(date +%Y%m%d).img

# 3. Rotacionar todas as credenciais
# - Mudar senhas de DB
# - Regenerar API keys
# - Atualizar secrets no GitHub
```

#### Se for DDoS:

```bash
# 1. Ativar rate limiting agressivo
# Em .env do backend
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10

# 2. Bloquear IPs maliciosos
sudo ufw deny from 123.45.67.89

# 3. Ativar Cloudflare (se disponível)
```

---

### Fase 3: INVESTIGAÇÃO (1-4h)

**Coletar evidências:**

```bash
# Logs do servidor
sudo journalctl -u appdirijamais --since "1 hour ago" > /tmp/incident-logs.txt

# Logs do Nginx
sudo tail -n 1000 /var/log/nginx/access.log > /tmp/nginx-access.txt
sudo tail -n 1000 /var/log/nginx/error.log > /tmp/nginx-error.txt

# Queries suspeitas no banco
psql -d appdirijamais -c "SELECT * FROM pg_stat_activity WHERE state = 'active';"

# Processos rodando
ps aux | grep -E "node|npm|pm2" > /tmp/processes.txt
```

**Análise:**

1. Identificar vetor de ataque
2. Determinar escopo (quantos usuários afetados)
3. Avaliar impacto (dados vazados? dinheiro perdido?)
4. Documentar timeline

---

### Fase 4: ERRADICAÇÃO (4-8h)

**Remover ameaça:**

```bash
# 1. Aplicar patch de segurança
git pull origin master
npm ci
npm run build
pm2 restart all

# 2. Verificar integridade dos arquivos
sudo aide --check

# 3. Atualizar dependências vulneráveis
npm audit fix --force
```

**Validar correção:**

```bash
# Rodar testes
npm test

# Verificar vulnerabilidades
npm audit --audit-level=high

# Tentar reproduzir exploit
curl -X POST https://api.dirijamais.com.br/vulnerable-endpoint
```

---

### Fase 5: RECUPERAÇÃO (8-24h)

**Restaurar serviços:**

```bash
# 1. Backup recente do banco
psql -d appdirijamais < /backup/db-$(date -d "yesterday" +%Y%m%d).sql

# 2. Reativar endpoints
# nginx.conf - remover bloqueios
sudo systemctl reload nginx

# 3. Monitorar métricas
# - CPU/RAM estáveis?
# - Latência normal?
# - Erros 5xx zerados?
```

**Comunicação com usuários:**

- Email explicando o incidente (sem detalhes técnicos)
- Recomendação de trocar senha
- Oferecer suporte prioritário

---

### Fase 6: PÓS-INCIDENTE (24-72h)

**Relatório de incidente:**

```markdown
# Incident Report - [Data]

## Resumo

[Breve descrição do que aconteceu]

## Timeline

- 10:30 - Detecção via Sentry
- 10:45 - Contenção iniciada
- 12:00 - Ameaça erradicada
- 14:00 - Serviços restaurados

## Causa Raiz

[O que causou o incidente]

## Impacto

- X usuários afetados
- Y horas de downtime
- Z reais de perda

## Ações Preventivas

1. [Ação 1]
2. [Ação 2]
3. [Ação 3]

## Lições Aprendidas

[O que aprendemos]
```

**Melhorias:**

- Atualizar runbooks
- Adicionar alertas
- Treinar equipe
- Revisar políticas

---

## 📞 Comunicação Durante Incidente

### Interno

- **Slack/Discord**: Canal #incidents
- **Email**: incidents@dirijamais.com.br
- **Telefone**: Para P0 apenas

### Externo (Usuários)

- **Status Page**: status.dirijamais.com.br
- **Twitter/X**: @AppDirijaMais
- **Email**: suporte@dirijamais.com.br

### Template de Comunicação

#### Incidente Detectado

```
🚨 Estamos investigando um problema que pode estar afetando [funcionalidade].
Nossa equipe está trabalhando para resolver.
Atualizações em: status.dirijamais.com.br
```

#### Incidente Resolvido

```
✅ O problema foi identificado e corrigido.
Todos os serviços estão operando normalmente.
Agradecemos a paciência.
```

---

## 🔐 Escalação

### Nível 1: Dev On-Call

- Responde alertas Sentry
- Analisa logs
- Aplica correções simples

### Nível 2: Líder Técnico

- Incidentes P0/P1
- Decisões de arquitetura
- Comunicação com stakeholders

### Nível 3: Externo

- Hostinger suporte (servidor)
- GitHub Security (repo comprometido)
- CERT.br (incidente grave)

---

## 🧪 Testes do Plano

**Executar drill trimestralmente:**

1. Simular vazamento de dados
2. Praticar procedimento de contenção
3. Testar comunicação de emergência
4. Validar backups (restore funciona?)
5. Atualizar contatos

**Próximo drill:** [Data]

---

**Última atualização:** 08/12/2025
**Responsável:** Roberto Flores
**Próxima revisão:** 08/03/2026
