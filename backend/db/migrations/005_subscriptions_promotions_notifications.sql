-- ============================================================
-- 005_subscriptions_promotions_notifications.sql
-- Suscripciones, promociones y notificaciones
-- ============================================================

CREATE TABLE subscriptions (
  id                 BIGSERIAL PRIMARY KEY,
  customer_id        BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  address_id         BIGINT NOT NULL REFERENCES addresses(id),
  product_id         BIGINT NOT NULL REFERENCES products(id),
  quantity           INTEGER NOT NULL CHECK (quantity > 0),
  frequency_days     INTEGER NOT NULL CHECK (frequency_days IN (3, 7, 15, 30)),
  status             TEXT NOT NULL DEFAULT 'ACTIVE'
                     CHECK (status IN ('ACTIVE','PAUSED','CANCELLED')),
  next_delivery_date DATE NOT NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_subscriptions_customer_id ON subscriptions(customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

CREATE TABLE promotions (
  id                BIGSERIAL PRIMARY KEY,
  name              TEXT NOT NULL,
  code              TEXT UNIQUE,
  type              TEXT NOT NULL
                    CHECK (type IN ('PERCENTAGE','FIXED_AMOUNT','FREE_SHIPPING','PACK')),
  value             NUMERIC(10,2),              -- % o monto según el tipo
  pack_quantity     INTEGER,                    -- para tipo PACK: ej. 5 bidones
  min_quantity      INTEGER,                    -- cantidad mínima para aplicar
  min_order_amount  NUMERIC(10,2),              -- monto mínimo del pedido
  active            BOOLEAN NOT NULL DEFAULT TRUE,
  starts_at         TIMESTAMPTZ,
  ends_at           TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_promotions_updated_at
  BEFORE UPDATE ON promotions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_promotions_active ON promotions(active);

CREATE TABLE notifications (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type        TEXT NOT NULL DEFAULT 'INFO',
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  read        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);
