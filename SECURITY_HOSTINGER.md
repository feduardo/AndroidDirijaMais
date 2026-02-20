# 🔐 Guia de Segurança - Hostinger VPS Business

Adaptações de segurança específicas para ambiente Hostinger.

---

## 🎯 Diferenças: AWS vs Hostinger

| Recurso             | AWS                    | Hostinger VPS     | Solução                         |
| ------------------- | ---------------------- | ----------------- | ------------------------------- |
| Secrets Manager     | ✅ AWS Secrets Manager | ❌ Não disponível | GitHub Secrets + dotenv         |
| KMS                 | ✅ AWS KMS             | ❌ Não disponível | Criptografia manual (crypto-js) |
| Load Balancer       | ✅ ELB                 | ❌ Não nativo     | Nginx reverse proxy             |
| WAF                 | ✅ AWS WAF             | ❌ Não nativo     | ModSecurity (Nginx)             |
| CloudWatch          | ✅ Logs centralizados  | ❌ Logs locais    | Winston + log rotation          |
| RDS Backup          | ✅ Automático          | ⚠️ Manual/script  | Cron job diário                 |
| Certificate Manager | ✅ ACM                 | ✅ Let's Encrypt  | Certbot gratuito                |

---

## 🚀 Configuração Inicial Segura

### 1. Hardening do VPS

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Firewall (UFW)
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# Fail2Ban (proteção SSH)
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Desabilitar root login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart sshd

# Criar usuário deploy (não usar root)
sudo adduser deploy
sudo usermod -aG sudo deploy
```

---

### 2. SSL/TLS com Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obter certificado
sudo certbot --nginx -d api.dirijamais.com.br -d www.dirijamais.com.br

# Auto-renovação (cron)
sudo crontab -e
# Adicionar:
0 3 * * * certbot renew --quiet --post-hook "systemctl reload nginx"
```

**Validar HTTPS:**

```bash
curl -I https://api.dirijamais.com.br
# Deve retornar: HTTP/2 200
```

---

### 3. Nginx como Reverse Proxy

```nginx
# /etc/nginx/sites-available/appdirijamais

server {
    listen 80;
    server_name api.dirijamais.com.br;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.dirijamais.com.br;

    # SSL Config
    ssl_certificate /etc/letsencrypt/live/api.dirijamais.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.dirijamais.com.br/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req zone=api_limit burst=20 nodelay;

    # Proxy para Node.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Bloquear acesso a arquivos sensíveis
    location ~ /\. {
        deny all;
    }

    location ~ \.env {
        deny all;
    }
}
```

**Ativar configuração:**

```bash
sudo ln -s /etc/nginx/sites-available/appdirijamais /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### 4. Gerenciamento de Secrets

**Não usar AWS Secrets Manager. Alternativas:**

#### Opção A: Variáveis de Ambiente do Sistema

```bash
# /etc/environment
export DB_PASSWORD="senha_segura_aqui"
export JWT_SECRET="chave_jwt_longa_e_aleatoria"
export GOOGLE_CLIENT_ID="seu_client_id"
```

**Aplicar:**

```bash
sudo nano /etc/environment
# Logout/login para aplicar
```

#### Opção B: dotenv-vault (Recomendado)

```bash
npm install dotenv-vault -g

# Criar vault
npx dotenv-vault new

# Adicionar secrets
npx dotenv-vault push

# No servidor
npx dotenv-vault pull production
```

**Vantagens:**

- Secrets criptografados
- Versionamento
- Acesso via token

---

### 5. Banco de Dados Seguro

#### PostgreSQL

```bash
# Instalar
sudo apt install postgresql postgresql-contrib -y

# Criar usuário com privilégios mínimos
sudo -u postgres psql
CREATE DATABASE appdirijamais;
CREATE USER app_user WITH ENCRYPTED PASSWORD 'senha_forte';
GRANT CONNECT ON DATABASE appdirijamais TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
\q

# Configurar acesso apenas local
sudo nano /etc/postgresql/14/main/pg_hba.conf
# Alterar para:
local   appdirijamais   app_user   md5

sudo systemctl restart postgresql
```

#### Criptografia em repouso

```bash
# Habilitar criptografia no PostgreSQL
sudo nano /etc/postgresql/14/main/postgresql.conf
# Adicionar:
ssl = on
ssl_cert_file = '/etc/ssl/certs/ssl-cert-snakeoil.pem'
ssl_key_file = '/etc/ssl/private/ssl-cert-snakeoil.key'

sudo systemctl restart postgresql
```

---

### 6. Backup Automático

```bash
# Script de backup
sudo nano /usr/local/bin/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/database"
DB_NAME="appdirijamais"
DB_USER="app_user"

mkdir -p $BACKUP_DIR

# Backup
PGPASSWORD="senha_forte" pg_dump -U $DB_USER -h localhost $DB_NAME | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Manter apenas últimos 7 dias
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +7 -delete

# Log
echo "[$DATE] Backup concluído" >> /var/log/backup-db.log
```

```bash
# Tornar executável
sudo chmod +x /usr/local/bin/backup-db.sh

# Agendar cron (todo dia 3h da manhã)
sudo crontab -e
0 3 * * * /usr/local/bin/backup-db.sh
```

**Testar backup:**

```bash
sudo /usr/local/bin/backup-db.sh
ls -lh /backup/database/
```

**Testar restore:**

```bash
gunzip -c /backup/database/db_20241208_030000.sql.gz | psql -U app_user -d appdirijamais_test
```

---

### 7. Monitoramento e Logs

#### PM2 para Node.js

```bash
# Instalar PM2
npm install -g pm2

# Iniciar app
pm2 start dist/index.js --name "appdirijamais"

# Auto-restart no boot
pm2 startup
pm2 save

# Logs
pm2 logs appdirijamais
pm2 monit
```

#### Log Rotation

```bash
sudo nano /etc/logrotate.d/appdirijamais
```

```
/var/log/appdirijamais/*.log {
    daily
    rotate 7
    compress
    delaycompress
    notifempty
    missingok
    create 0640 deploy deploy
}
```

---

### 8. Antivírus (ClamAV)

```bash
# Instalar
sudo apt install clamav clamav-daemon -y

# Atualizar definições
sudo freshclam

# Scan manual
sudo clamscan -r /home/deploy/app --infected --remove

# Scan automático (cron)
sudo crontab -e
0 2 * * 0 clamscan -r /home/deploy/app --infected --remove --log=/var/log/clamav/scan.log
```

---

### 9. Checklist de Deploy

Antes de cada deploy, verificar:

```bash
# 1. HTTPS ativo
curl -I https://api.dirijamais.com.br | grep "HTTP/2 200"

# 2. Headers de segurança
curl -I https://api.dirijamais.com.br | grep -E "Strict-Transport-Security|X-Frame-Options"

# 3. Rate limiting
for i in {1..20}; do curl https://api.dirijamais.com.br/api/auth/login; done
# Deve retornar 429 (Too Many Requests)

# 4. Vulnerabilidades
npm audit --audit-level=high

# 5. Backup recente
ls -lh /backup/database/ | head -5

# 6. Firewall ativo
sudo ufw status | grep "Status: active"

# 7. SSL válido
echo | openssl s_client -connect api.dirijamais.com.br:443 2>&1 | grep "Verify return code: 0"
```

---

### 10. Plano de Disaster Recovery

#### RTO (Recovery Time Objective): 4 horas

#### RPO (Recovery Point Objective): 24 horas

**Cenário: Servidor comprometido**

```bash
# 1. Provisionar novo VPS
# 2. Restaurar backup
gunzip -c /backup/database/latest.sql.gz | psql -U app_user -d appdirijamais

# 3. Deploy da aplicação
git clone https://github.com/RobertoCFloresJ/AppDirijaMais.git
cd AppDirijaMais
npm ci --production
npm run build
pm2 start dist/index.js

# 4. Configurar Nginx + SSL
sudo certbot --nginx -d api.dirijamais.com.br

# 5. Atualizar DNS (se IP mudou)
# Hostinger Panel > DNS Management

# 6. Testar
curl https://api.dirijamais.com.br/health
```

---

## 📊 Monitoramento Recomendado

### Gratuitos/Baratos

- **Uptime**: UptimeRobot (50 monitors grátis)
- **Logs**: Papertrail (100MB/mês grátis)
- **Errors**: Sentry (5k events/mês grátis)
- **Performance**: New Relic (100GB/mês grátis)

### Configuração Sentry

```bash
npm install @sentry/node

# src/index.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

---

## 🔥 Incidentes Comuns no Hostinger

### 1. Disco cheio

```bash
# Verificar espaço
df -h

# Limpar logs antigos
sudo journalctl --vacuum-time=7d

# Limpar npm cache
npm cache clean --force
```

### 2. Memória esgotada

```bash
# Ver uso
free -h

# Configurar swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### 3. App travado

```bash
# Restart via PM2
pm2 restart appdirijamais

# Ver logs
pm2 logs --err
```

---

**Última atualização:** 08/12/2025
**Responsável:** Roberto Flores
**Próxima revisão:** 08/03/2026
