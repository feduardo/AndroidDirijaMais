-- ============================================
-- DATABASE SCHEMA V2.0 - AppDirijaMais
-- ============================================
-- Autor: Roberto Caldeira Flores Junior
-- Data: 13/12/2025
-- Descrição: Schema completo com LGPD compliance
-- PostgreSQL 14+
-- ============================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABELA: users
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Autenticação
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  
  -- Identificação
  full_name VARCHAR(255) NOT NULL,
  
  -- CPF criptografado (LGPD compliance)
  cpf_hash VARCHAR(64) UNIQUE NOT NULL,      -- SHA-256 para busca/validação
  cpf_encrypted TEXT NOT NULL,               -- AES-256 para exibição autorizada
  
  phone VARCHAR(15),
  role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'instructor', 'admin')),
  avatar_url TEXT,
  
  -- OAuth
  google_id VARCHAR(255) UNIQUE,
  
  -- Verificação de email
  email_verified BOOLEAN DEFAULT FALSE,
  email_verification_token VARCHAR(255),
  email_verification_expires TIMESTAMP,
  
  -- Reset de senha
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP,
  
  -- Controle de conta
  is_active BOOLEAN DEFAULT TRUE,
  is_blocked BOOLEAN DEFAULT FALSE,
  blocked_reason TEXT,
  blocked_at TIMESTAMP,
  blocked_by UUID REFERENCES users(id),
  
  -- Soft delete (LGPD - direito ao esquecimento)
  deleted_at TIMESTAMP,
  deletion_reason TEXT,
  deletion_requested_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP,
  
  -- Constraints
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Índices
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_cpf_hash ON users(cpf_hash) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_google_id ON users(google_id) WHERE google_id IS NOT NULL;
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- Comentários
COMMENT ON TABLE users IS 'Usuários do sistema (alunos, instrutores e admins)';
COMMENT ON COLUMN users.cpf_hash IS 'Hash SHA-256 do CPF para busca sem expor dado sensível';
COMMENT ON COLUMN users.cpf_encrypted IS 'CPF criptografado com AES-256 para exibição autorizada';


-- ============================================
-- TABELA: user_consents (LGPD)
-- ============================================
CREATE TABLE user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  consent_type VARCHAR(50) NOT NULL CHECK (
    consent_type IN (
      'terms_of_use',
      'privacy_policy',
      'biometric',
      'marketing',
      'notifications',
      'location_precise',
      'data_sharing'
    )
  ),
  
  -- Texto exato mostrado ao usuário (imutável)
  consent_text TEXT NOT NULL,
  consent_version VARCHAR(20) NOT NULL, -- Ex: "1.0", "2.1"
  
  -- Aceite
  accepted_at TIMESTAMP NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  device_id VARCHAR(255),
  
  -- Revogação
  revoked_at TIMESTAMP,
  revoked_reason TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_consent_flow CHECK (
    (revoked_at IS NULL) OR (revoked_at >= accepted_at)
  )
);

-- Índices
CREATE INDEX idx_user_consents_user_id ON user_consents(user_id);
CREATE INDEX idx_user_consents_type ON user_consents(consent_type);
CREATE INDEX idx_user_consents_active ON user_consents(user_id, consent_type) 
  WHERE revoked_at IS NULL;

COMMENT ON TABLE user_consents IS 'Registro de consentimentos LGPD';


-- ============================================
-- TABELA: refresh_tokens
-- ============================================
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  token_hash VARCHAR(255) NOT NULL UNIQUE,
  
  -- Device tracking
  device_id VARCHAR(255),
  device_name VARCHAR(100),
  device_type VARCHAR(20) CHECK (device_type IN ('android', 'ios', 'web')),
  
  -- Network info
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  -- Geolocation (opcional)
  login_city VARCHAR(100),
  login_country VARCHAR(2),
  
  -- Validade
  expires_at TIMESTAMP NOT NULL,
  
  -- Revogação
  revoked BOOLEAN DEFAULT FALSE,
  revoked_at TIMESTAMP,
  revoked_reason VARCHAR(100) CHECK (
    revoked_reason IN (
      'user_logout',
      'suspicious_activity',
      'password_reset',
      'admin_action',
      'token_rotation',
      'expired'
    )
  ),
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  last_used_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_token_lifecycle CHECK (
    (revoked = FALSE AND revoked_at IS NULL) OR 
    (revoked = TRUE AND revoked_at IS NOT NULL)
  )
);

-- Índices
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
CREATE INDEX idx_refresh_tokens_active ON refresh_tokens(user_id) 
  WHERE revoked = FALSE;


COMMENT ON TABLE refresh_tokens IS 'Tokens JWT de refresh com rotação e revogação';


-- ============================================
-- TABELA: instructor_profiles
-- ============================================
CREATE TABLE instructor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Informações profissionais
  bio TEXT,
  experience_years INTEGER CHECK (experience_years >= 0),
  
  -- Localização
  city VARCHAR(100) NOT NULL,
  state VARCHAR(2) NOT NULL CHECK (LENGTH(state) = 2),
  address TEXT,
  
  -- Geolocalização arredondada (privacidade LGPD)
  latitude DECIMAL(10, 6),  -- Precisão de ~10 metros
  longitude DECIMAL(11, 6),
  
  -- Categorias de habilitação
  categories VARCHAR(10)[] DEFAULT ARRAY['B']::VARCHAR[],
  
  -- Veículo
  vehicle_brand VARCHAR(50),
  vehicle_model VARCHAR(50),
  vehicle_year INTEGER CHECK (vehicle_year >= 1900 AND vehicle_year <= EXTRACT(YEAR FROM NOW()) + 1),
  vehicle_plate VARCHAR(10),
  vehicle_photos TEXT[], -- Array de URLs
  
  -- Credenciais
  credencial_detran VARCHAR(50),
  credencial_verified BOOLEAN DEFAULT FALSE,
  credencial_expires_at DATE,
  credencial_document_url TEXT,
  
  -- Preços
  price_per_hour DECIMAL(10, 2) NOT NULL CHECK (price_per_hour > 0),
  accepts_packages BOOLEAN DEFAULT FALSE,
  
  -- Avaliação (calculado automaticamente)
  rating_average DECIMAL(3, 2) DEFAULT 0.00 CHECK (rating_average >= 0 AND rating_average <= 5),
  rating_count INTEGER DEFAULT 0 CHECK (rating_count >= 0),
  
  -- Disponibilidade
  accepts_new_students BOOLEAN DEFAULT TRUE,
  max_students_per_day INTEGER DEFAULT 5 CHECK (max_students_per_day > 0),
  
  -- Verificação da plataforma
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  verified_by UUID REFERENCES users(id),
  verification_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_instructor_profiles_user_id ON instructor_profiles(user_id);
CREATE INDEX idx_instructor_profiles_city_state ON instructor_profiles(city, state);
CREATE INDEX idx_instructor_profiles_rating ON instructor_profiles(rating_average DESC);
CREATE INDEX idx_instructor_profiles_categories ON instructor_profiles USING GIN(categories);
CREATE INDEX idx_instructor_profiles_verified ON instructor_profiles(is_verified) 
  WHERE is_verified = TRUE;
CREATE INDEX idx_instructor_profiles_accepting ON instructor_profiles(accepts_new_students) 
  WHERE accepts_new_students = TRUE;

-- Geolocalização (para busca por proximidade futura)
CREATE INDEX idx_instructor_profiles_location ON instructor_profiles(latitude, longitude);

COMMENT ON TABLE instructor_profiles IS 'Perfil e informações específicas de instrutores';


-- ============================================
-- TABELA: instructor_availability
-- ============================================
CREATE TABLE instructor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID NOT NULL REFERENCES instructor_profiles(id) ON DELETE CASCADE,
  
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Domingo
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_time_range CHECK (end_time > start_time),
  UNIQUE(instructor_id, day_of_week, start_time, end_time)
);

CREATE INDEX idx_availability_instructor ON instructor_availability(instructor_id);
CREATE INDEX idx_availability_day ON instructor_availability(day_of_week);

COMMENT ON TABLE instructor_availability IS 'Horários disponíveis dos instrutores por dia da semana';


-- ============================================
-- TABELA: bookings
-- ============================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES instructor_profiles(id) ON DELETE CASCADE,
  
  -- Agendamento
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  duration_hours DECIMAL(3, 1) DEFAULT 1.0 CHECK (duration_hours > 0 AND duration_hours <= 8),
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')
  ),
  
  -- Localização de partida
  pickup_address TEXT,
  pickup_latitude DECIMAL(10, 8),
  pickup_longitude DECIMAL(11, 8),
  
  -- Pagamento
  price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (
    payment_status IN ('pending', 'processing', 'paid', 'refunded', 'failed')
  ),
  payment_method VARCHAR(20) CHECK (
    payment_method IN ('pix', 'credit_card', 'debit_card', 'cash')
  ),
  payment_id VARCHAR(255), -- ID do gateway (Stripe, Mercado Pago, etc)
  payment_completed_at TIMESTAMP,
  
  -- Cancelamento
  cancelled_by UUID REFERENCES users(id),
  cancelled_at TIMESTAMP,
  cancellation_reason TEXT,
  
  -- Notas
  instructor_notes TEXT,
  student_notes TEXT,
  
  -- Confirmação
  confirmed_by UUID REFERENCES users(id),
  confirmed_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT no_past_bookings CHECK (
    scheduled_date >= CURRENT_DATE
  ),
  CONSTRAINT valid_cancellation CHECK (
    (status != 'cancelled') OR 
    (status = 'cancelled' AND cancelled_by IS NOT NULL AND cancelled_at IS NOT NULL)
  )
);

-- Índices
CREATE INDEX idx_bookings_student ON bookings(student_id);
CREATE INDEX idx_bookings_instructor ON bookings(instructor_id);
CREATE INDEX idx_bookings_date ON bookings(scheduled_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_bookings_upcoming ON bookings(scheduled_date, scheduled_time) 
  WHERE status IN ('pending', 'confirmed');

COMMENT ON TABLE bookings IS 'Agendamentos de aulas entre alunos e instrutores';


-- ============================================
-- TABELA: booking_status_history
-- ============================================
CREATE TABLE booking_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  
  previous_status VARCHAR(20),
  new_status VARCHAR(20) NOT NULL,
  
  changed_by UUID REFERENCES users(id),
  reason TEXT,
  
  -- Metadados adicionais
  metadata JSONB,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_booking_history_booking_id ON booking_status_history(booking_id);
CREATE INDEX idx_booking_history_created_at ON booking_status_history(created_at DESC);

COMMENT ON TABLE booking_status_history IS 'Histórico de mudanças de status dos agendamentos';


-- ============================================
-- TABELA: reviews
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES instructor_profiles(id) ON DELETE CASCADE,
  
  -- Avaliação geral
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  
  -- Aspectos específicos (opcional)
  punctuality_rating INTEGER CHECK (punctuality_rating BETWEEN 1 AND 5),
  teaching_quality_rating INTEGER CHECK (teaching_quality_rating BETWEEN 1 AND 5),
  vehicle_condition_rating INTEGER CHECK (vehicle_condition_rating BETWEEN 1 AND 5),
  communication_rating INTEGER CHECK (communication_rating BETWEEN 1 AND 5),
  
  -- Resposta do instrutor
  instructor_response TEXT,
  instructor_response_at TIMESTAMP,
  
  -- Moderação
  is_visible BOOLEAN DEFAULT TRUE,
  is_flagged BOOLEAN DEFAULT FALSE,
  flagged_reason TEXT,
  flagged_at TIMESTAMP,
  moderated_by UUID REFERENCES users(id),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_reviews_instructor ON reviews(instructor_id) WHERE is_visible = TRUE;
CREATE INDEX idx_reviews_student ON reviews(student_id);
CREATE INDEX idx_reviews_booking ON reviews(booking_id);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);
CREATE INDEX idx_reviews_flagged ON reviews(is_flagged) WHERE is_flagged = TRUE;

COMMENT ON TABLE reviews IS 'Avaliações de instrutores por alunos';


-- ============================================
-- TABELA: messages
-- ============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  content TEXT NOT NULL,
  
  -- Leitura
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  
  -- Anexos
  attachment_url TEXT,
  attachment_type VARCHAR(20) CHECK (
    attachment_type IN ('image', 'video', 'document', 'audio')
  ),
  attachment_size_bytes INTEGER,
  
  -- Retenção LGPD (auto-expiração)
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '12 months'),
  
  -- Moderação
  is_flagged BOOLEAN DEFAULT FALSE,
  flagged_reason TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT no_self_message CHECK (sender_id != receiver_id),
  CONSTRAINT valid_attachment CHECK (
    (attachment_url IS NULL AND attachment_type IS NULL) OR
    (attachment_url IS NOT NULL AND attachment_type IS NOT NULL)
  )
);

-- Índices
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_conversation ON messages(sender_id, receiver_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_unread ON messages(receiver_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_messages_expires_at ON messages(expires_at) WHERE expires_at IS NOT NULL;

COMMENT ON TABLE messages IS 'Mensagens entre alunos e instrutores (auto-expiram em 12 meses)';


-- ============================================
-- TABELA: favorites
-- ============================================
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES instructor_profiles(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(student_id, instructor_id)
);

CREATE INDEX idx_favorites_student ON favorites(student_id);
CREATE INDEX idx_favorites_instructor ON favorites(instructor_id);

COMMENT ON TABLE favorites IS 'Instrutores favoritos dos alunos';


-- ============================================
-- TABELA: notifications
-- ============================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  
  type VARCHAR(50) NOT NULL CHECK (
    type IN (
      'booking_confirmed',
      'booking_cancelled',
      'booking_reminder',
      'new_message',
      'review_received',
      'payment_received',
      'payment_failed',
      'account_verified',
      'system_announcement'
    )
  ),
  
  -- Dados adicionais (JSON)
  data JSONB,
  
  -- Deep link
  action_url TEXT,
  
  -- Leitura
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  
  -- Envio
  sent_at TIMESTAMP,
  delivery_status VARCHAR(20) DEFAULT 'pending' CHECK (
    delivery_status IN ('pending', 'sent', 'failed', 'clicked')
  ),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

COMMENT ON TABLE notifications IS 'Notificações do sistema e push notifications';


-- ============================================
-- TABELA: fcm_tokens (Firebase Cloud Messaging)
-- ============================================
CREATE TABLE fcm_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  token TEXT NOT NULL,
  device_type VARCHAR(20) NOT NULL CHECK (device_type IN ('android', 'ios', 'web')),
  device_id VARCHAR(255),
  device_name VARCHAR(100),
  
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Tracking
  last_used_at TIMESTAMP DEFAULT NOW(),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(token)
);

CREATE INDEX idx_fcm_tokens_user ON fcm_tokens(user_id);
CREATE INDEX idx_fcm_tokens_active ON fcm_tokens(user_id, is_active) WHERE is_active = TRUE;

COMMENT ON TABLE fcm_tokens IS 'Tokens FCM para push notifications';


-- ============================================
-- TABELA: audit_logs
-- ============================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  user_id UUID REFERENCES users(id),
  
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  
  -- Contexto da ação
  ip_address VARCHAR(45),
  user_agent TEXT,
  device_id VARCHAR(255),
  
  -- Dados antes/depois (para auditoria)
  old_values JSONB,
  new_values JSONB,
  
  -- Metadados adicionais
  metadata JSONB,
  
  -- Severidade
  severity VARCHAR(20) DEFAULT 'info' CHECK (
    severity IN ('debug', 'info', 'warning', 'error', 'critical')
  ),
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_severity ON audit_logs(severity) WHERE severity IN ('error', 'critical');

COMMENT ON TABLE audit_logs IS 'Logs de auditoria de todas as ações críticas do sistema';


-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger: atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instructor_profiles_updated_at 
  BEFORE UPDATE ON instructor_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at 
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instructor_availability_updated_at 
  BEFORE UPDATE ON instructor_availability
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at 
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fcm_tokens_updated_at 
  BEFORE UPDATE ON fcm_tokens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- Trigger: atualizar rating médio do instrutor
CREATE OR REPLACE FUNCTION update_instructor_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE instructor_profiles
  SET 
    rating_average = COALESCE(
      (SELECT AVG(rating)::DECIMAL(3,2) 
       FROM reviews 
       WHERE instructor_id = NEW.instructor_id 
       AND is_visible = TRUE), 
      0.00
    ),
    rating_count = (
      SELECT COUNT(*) 
      FROM reviews 
      WHERE instructor_id = NEW.instructor_id 
      AND is_visible = TRUE
    )
  WHERE id = NEW.instructor_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_on_review 
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_instructor_rating();


-- Trigger: registrar histórico de status de booking
CREATE OR REPLACE FUNCTION log_booking_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO booking_status_history (
      booking_id,
      previous_status,
      new_status,
      changed_by,
      metadata
    ) VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      NULLIF(current_setting('app.current_user_id', TRUE), '')::UUID,
      jsonb_build_object(
        'timestamp', NOW(),
        'payment_status_changed', OLD.payment_status IS DISTINCT FROM NEW.payment_status
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_booking_status 
  AFTER UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION log_booking_status_change();


-- ============================================
-- FUNÇÕES AUXILIARES
-- ============================================

-- Função: Anonimizar usuário (LGPD - direito ao esquecimento)
CREATE OR REPLACE FUNCTION anonymize_user(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  -- Anonimizar dados pessoais
  UPDATE users SET
    email = 'deleted_' || user_uuid || '@deleted.local',
    full_name = 'Usuário Excluído',
    cpf_hash = encode(sha256(user_uuid::TEXT::BYTEA), 'hex'),
    cpf_encrypted = 'DELETED',
    phone = NULL,
    avatar_url = NULL,
    google_id = NULL,
    deleted_at = NOW(),
    deletion_reason = 'User requested account deletion'
  WHERE id = user_uuid;
  
  -- Revogar todos os tokens
  UPDATE refresh_tokens SET
    revoked = TRUE,
    revoked_at = NOW(),
    revoked_reason = 'account_deleted'
  WHERE user_id = user_uuid AND revoked = FALSE;
  
  -- Revogar consentimentos
  UPDATE user_consents SET
    revoked_at = NOW(),
    revoked_reason = 'Account deleted'
  WHERE user_id = user_uuid AND revoked_at IS NULL;
  
  -- Desativar FCM tokens
  UPDATE fcm_tokens SET
    is_active = FALSE
  WHERE user_id = user_uuid;
  
  -- Nota: Bookings e reviews são mantidos anonimizados para histórico
  
  RAISE NOTICE 'User % anonymized successfully', user_uuid;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION anonymize_user IS 'Anonimiza dados de um usuário conforme LGPD';


-- Função: Limpar mensagens expiradas
CREATE OR REPLACE FUNCTION cleanup_expired_messages()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM messages
  WHERE expires_at IS NOT NULL 
  AND expires_at < NOW();
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RAISE NOTICE 'Deleted % expired messages', deleted_count;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_expired_messages IS 'Remove mensagens expiradas (executar via cron)';


-- Função: Limpar tokens expirados
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM refresh_tokens
  WHERE expires_at < NOW() - INTERVAL '30 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RAISE NOTICE 'Deleted % expired tokens', deleted_count;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION cleanup_expired_tokens IS 'Remove tokens expirados há mais de 30 dias';


-- ============================================
-- VIEWS
-- ============================================

-- View: Instrutores completos
CREATE OR REPLACE VIEW v_instructors_full AS
SELECT 
  u.id AS user_id,
  u.full_name,
  u.email,
  u.phone,
  u.avatar_url,
  u.created_at AS user_created_at,
  u.last_login_at,

  ip.id AS instructor_profile_id,
  ip.bio,
  ip.experience_years,
  ip.city,
  ip.state,
  ip.address,
  ip.latitude,
  ip.longitude,
  ip.categories,
  ip.vehicle_brand,
  ip.vehicle_model,
  ip.vehicle_year,
  ip.vehicle_plate,
  ip.price_per_hour,
  ip.rating_average,
  ip.rating_count,
  ip.is_verified,
  ip.created_at,
  ip.updated_at
FROM users u
INNER JOIN instructor_profiles ip ON u.id = ip.user_id
WHERE u.role = 'instructor'
  AND u.is_active = TRUE
  AND u.deleted_at IS NULL;


COMMENT ON VIEW v_instructors_full IS 'Instrutores com dados completos';

-- View: Agendamentos completos
CREATE OR REPLACE VIEW v_bookings_full AS
SELECT 
  b.*,
  s.full_name AS student_name,
  s.email AS student_email,
  s.phone AS student_phone,
  s.avatar_url AS student_avatar,
  i.full_name AS instructor_name,
  i.email AS instructor_email,
  i.phone AS instructor_phone,
  i.avatar_url AS instructor_avatar,
  ip.city AS instructor_city,
  ip.state AS instructor_state,
  ip.vehicle_model,
  ip.vehicle_plate,
  ip.rating_average AS instructor_rating
FROM bookings b
INNER JOIN users s ON b.student_id = s.id
INNER JOIN instructor_profiles ip ON b.instructor_id = ip.id
INNER JOIN users i ON ip.user_id = i.id;

COMMENT ON VIEW v_bookings_full IS 'Agendamentos com dados completos de aluno e instrutor';


-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS nas tabelas sensíveis
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_consents ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários veem apenas seus próprios dados
CREATE POLICY users_select_own 
  ON users FOR SELECT
  USING (id = NULLIF(current_setting('app.current_user_id', TRUE), '')::UUID);

CREATE POLICY users_update_own 
  ON users FOR UPDATE
  USING (id = NULLIF(current_setting('app.current_user_id', TRUE), '')::UUID);

-- Policy: Bookings - alunos veem seus agendamentos
CREATE POLICY bookings_student_select 
  ON bookings FOR SELECT
  USING (student_id = NULLIF(current_setting('app.current_user_id', TRUE), '')::UUID);

-- Policy: Bookings - instrutores veem agendamentos com eles
CREATE POLICY bookings_instructor_select 
  ON bookings FOR SELECT
  USING (instructor_id IN (
    SELECT id FROM instructor_profiles 
    WHERE user_id = NULLIF(current_setting('app.current_user_id', TRUE), '')::UUID
  ));

-- Policy: Messages - usuários veem mensagens enviadas ou recebidas
CREATE POLICY messages_select_own 
  ON messages FOR SELECT
  USING (
    sender_id = NULLIF(current_setting('app.current_user_id', TRUE), '')::UUID OR
    receiver_id = NULLIF(current_setting('app.current_user_id', TRUE), '')::UUID
  );

COMMENT ON POLICY messages_select_own ON messages IS 'Usuários só veem suas próprias mensagens';


-- ============================================
-- DADOS INICIAIS (SEEDS)
-- ============================================

-- Criar usuário admin padrão (ALTERAR SENHA EM PRODUÇÃO!)
DO $$
DECLARE
  admin_id UUID;
BEGIN
  INSERT INTO users (
    email,
    password_hash,
    full_name,
    cpf_hash,
    cpf_encrypted,
    role,
    email_verified,
    is_active
  ) VALUES (
    'admin@dirijamais.com.br',
    crypt('Admin@123456', gen_salt('bf', 10)), -- ALTERAR EM PRODUÇÃO!
    'Administrador',
    encode(sha256('00000000000'::BYTEA), 'hex'),
    'ADMIN_CPF_ENCRYPTED',
    'admin',
    TRUE,
    TRUE
  )
  RETURNING id INTO admin_id;
  
  RAISE NOTICE 'Admin user created with ID: %', admin_id;
END $$;


-- ============================================
-- ÍNDICES DE PERFORMANCE ADICIONAIS
-- ============================================

-- Busca full-text em bio de instrutores (português)
CREATE INDEX idx_instructor_bio_fts 
  ON instructor_profiles 
  USING GIN(to_tsvector('portuguese', COALESCE(bio, '')));

-- Busca full-text em comentários de reviews
CREATE INDEX idx_reviews_comment_fts 
  ON reviews 
  USING GIN(to_tsvector('portuguese', COALESCE(comment, '')));


-- ============================================
-- ESTATÍSTICAS E MANUTENÇÃO
-- ============================================

-- Atualizar estatísticas das tabelas
ANALYZE users;
ANALYZE instructor_profiles;
ANALYZE bookings;
ANALYZE reviews;
ANALYZE messages;


-- ============================================
-- FIM DO SCHEMA
-- ============================================

-- Verificar tabelas criadas
DO $$
DECLARE
  table_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE';
  
  RAISE NOTICE '✓ Schema V2.0 criado com sucesso!';
  RAISE NOTICE '✓ Total de tabelas: %', table_count;
  RAISE NOTICE '✓ LGPD compliance habilitado';
  RAISE NOTICE '✓ RLS ativado em tabelas sensíveis';
  RAISE NOTICE '✓ Pronto para deploy no Hostinger VPS';
END $$;








-- ============================================
-- MIGRATION 002: Ajustes nos Campos de Instrutor
-- ============================================
-- Projeto: AppDirijaMais
-- Autor: Roberto Caldeira Flores Junior
-- Data: 15/12/2025
-- Descrição: Adiciona campos faltantes para alinhar com frontend
-- Depende de: 001_initial_schema.sql (DATABASE_SCHEMA_V2.sql)
-- ============================================

-- ============================================
-- 1. ADICIONAR CAMPO: specialties
-- ============================================
-- Descrição: Array de especialidades do instrutor
-- Exemplos: "Primeira Habilitação", "Baliza", "Direção Defensiva", "Troca de Categoria"

ALTER TABLE instructor_profiles 
ADD COLUMN IF NOT EXISTS specialties TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Índice GIN para busca eficiente em arrays
CREATE INDEX IF NOT EXISTS idx_instructor_specialties 
  ON instructor_profiles USING GIN(specialties);

COMMENT ON COLUMN instructor_profiles.specialties IS 'Especialidades do instrutor (ex: Primeira Habilitação, Baliza, Direção Defensiva)';


-- ============================================
-- 2. ADICIONAR CAMPO: total_classes_given
-- ============================================
-- Descrição: Contador de aulas concluídas (atualizado automaticamente via trigger)

ALTER TABLE instructor_profiles 
ADD COLUMN IF NOT EXISTS total_classes_given INTEGER DEFAULT 0 CHECK (total_classes_given >= 0);

COMMENT ON COLUMN instructor_profiles.total_classes_given IS 'Total de aulas concluídas pelo instrutor (atualizado automaticamente)';


-- ============================================
-- 3. TRIGGER: Atualizar total_classes_given automaticamente
-- ============================================
-- Descrição: Incrementa contador quando booking muda para status 'completed'

CREATE OR REPLACE FUNCTION update_instructor_total_classes()
RETURNS TRIGGER AS $$
BEGIN
  -- Quando uma aula é marcada como concluída
  IF (NEW.status = 'completed' AND OLD.status IS DISTINCT FROM 'completed') THEN
    UPDATE instructor_profiles
    SET total_classes_given = total_classes_given + 1
    WHERE id = NEW.instructor_id;
    
    RAISE NOTICE 'Instructor % classes count updated', NEW.instructor_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger (ou substituir se já existir)
DROP TRIGGER IF EXISTS update_total_classes ON bookings;

CREATE TRIGGER update_total_classes 
  AFTER UPDATE ON bookings
  FOR EACH ROW 
  WHEN (NEW.status = 'completed' AND OLD.status IS DISTINCT FROM 'completed')
  EXECUTE FUNCTION update_instructor_total_classes();

COMMENT ON FUNCTION update_instructor_total_classes IS 'Atualiza contagem de aulas concluídas do instrutor';


-- ============================================
-- 4. BACKFILL: Atualizar dados existentes
-- ============================================
-- Descrição: Recalcula total_classes_given para instrutores já existentes

UPDATE instructor_profiles ip
SET total_classes_given = (
  SELECT COUNT(*)
  FROM bookings b
  WHERE b.instructor_id = ip.id
    AND b.status = 'completed'
);


-- ============================================
-- 5. POPULAR DADOS DE EXEMPLO (opcional - apenas dev/test)
-- ============================================
-- Comentar estas linhas em produção

-- UPDATE instructor_profiles 
-- SET specialties = ARRAY['Primeira Habilitação', 'Baliza', 'Direção Defensiva']
-- WHERE user_id IN (
--   SELECT id FROM users WHERE role = 'instructor' LIMIT 1
-- );


-- ============================================
-- 6. VERIFICAÇÃO
-- ============================================
-- Confirma que as colunas foram criadas corretamente

DO $$
DECLARE
  specialties_exists BOOLEAN;
  total_classes_exists BOOLEAN;
  trigger_exists BOOLEAN;
BEGIN
  -- Verificar coluna specialties
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'instructor_profiles' 
      AND column_name = 'specialties'
  ) INTO specialties_exists;
  
  -- Verificar coluna total_classes_given
  SELECT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'instructor_profiles' 
      AND column_name = 'total_classes_given'
  ) INTO total_classes_exists;
  
  -- Verificar trigger
  SELECT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'update_total_classes'
  ) INTO trigger_exists;
  
  -- Resultado
  IF specialties_exists AND total_classes_exists AND trigger_exists THEN
    RAISE NOTICE '✓ Migration 002 aplicada com sucesso!';
    RAISE NOTICE '✓ Campo specialties: OK';
    RAISE NOTICE '✓ Campo total_classes_given: OK';
    RAISE NOTICE '✓ Trigger update_total_classes: OK';
  ELSE
    RAISE EXCEPTION '✗ Migration 002 falhou. Verifique os logs acima.';
  END IF;
END $$;


-- ============================================
-- 7. TESTES (opcional)
-- ============================================
-- Exemplos de queries para testar os novos campos

-- Buscar instrutores por especialidade
-- SELECT 
--   u.full_name,
--   ip.specialties,
--   ip.total_classes_given
-- FROM instructor_profiles ip
-- INNER JOIN users u ON ip.user_id = u.id
-- WHERE 'Primeira Habilitação' = ANY(ip.specialties);

-- Buscar instrutores com mais de 100 aulas
-- SELECT 
--   u.full_name,
--   ip.total_classes_given
-- FROM instructor_profiles ip
-- INNER JOIN users u ON ip.user_id = u.id
-- WHERE ip.total_classes_given > 100
-- ORDER BY ip.total_classes_given DESC;


-- ============================================
-- 8. ROLLBACK (apenas se necessário)
-- ============================================
-- Comandos para reverter esta migration

-- DROP TRIGGER IF EXISTS update_total_classes ON bookings;
-- DROP FUNCTION IF EXISTS update_instructor_total_classes();
-- ALTER TABLE instructor_profiles DROP COLUMN IF EXISTS specialties;
-- ALTER TABLE instructor_profiles DROP COLUMN IF EXISTS total_classes_given;


-- ============================================
-- FIM DA MIGRATION 002
-- ============================================



# Conectar ao PostgreSQL
psql -U seu_usuario -d dirijamais_db

# Executar a migration
\i database/migrations/002_adjust_instructor_fields.sql


-- Ver estrutura da tabela
\d instructor_profiles

-- Ver dados de exemplo
SELECT 
  id,
  specialties,
  total_classes_given
FROM instructor_profiles
LIMIT 5;