-- ============================================================
-- 001_roles_users.sql
-- Roles, usuarios, clientes, repartidores, zonas y direcciones
-- ============================================================

-- Función para mantener updated_at automáticamente
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------- ROLES ----------
CREATE TABLE roles (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT NOT NULL UNIQUE CHECK (name IN ('CLIENT', 'DRIVER', 'ADMIN'))
);

-- ---------- USERS ----------
CREATE TABLE users (
  id            BIGSERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name          TEXT NOT NULL,
  phone         TEXT,
  role_id       BIGINT NOT NULL REFERENCES roles(id),
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_email ON users(email);

-- ---------- CUSTOMERS ----------
CREATE TABLE customers (
  id            BIGSERIAL PRIMARY KEY,
  user_id       BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------- DELIVERY DRIVERS ----------
CREATE TABLE delivery_drivers (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  vehicle     TEXT,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_delivery_drivers_updated_at
  BEFORE UPDATE ON delivery_drivers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------- DELIVERY ZONES ----------
CREATE TABLE delivery_zones (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  price       NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  area        JSONB NOT NULL DEFAULT '[]', -- polígono [[lat,lng], ...]
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_delivery_zones_updated_at
  BEFORE UPDATE ON delivery_zones
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------- ADDRESSES ----------
CREATE TABLE addresses (
  id               BIGSERIAL PRIMARY KEY,
  customer_id      BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  label            TEXT, -- "Casa", "Trabajo", ...
  street           TEXT NOT NULL,
  city             TEXT,
  lat              DOUBLE PRECISION,
  lng              DOUBLE PRECISION,
  delivery_zone_id BIGINT REFERENCES delivery_zones(id),
  is_primary       BOOLEAN NOT NULL DEFAULT FALSE,
  active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_addresses_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_addresses_customer_id ON addresses(customer_id);
CREATE INDEX idx_addresses_zone_id ON addresses(delivery_zone_id);
