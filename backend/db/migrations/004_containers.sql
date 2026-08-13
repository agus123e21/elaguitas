-- ============================================================
-- 004_containers.sql
-- Bidones: inventario físico y movimientos por cliente
-- ============================================================

CREATE TABLE containers (
  id           BIGSERIAL PRIMARY KEY,
  status       TEXT NOT NULL DEFAULT 'IN_STOCK'
               CHECK (status IN ('IN_STOCK','WITH_CUSTOMER','DAMAGED','RETIRED')),
  customer_id  BIGINT REFERENCES customers(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_containers_updated_at
  BEFORE UPDATE ON containers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_containers_customer_id ON containers(customer_id);
CREATE INDEX idx_containers_status ON containers(status);

CREATE TABLE container_movements (
  id          BIGSERIAL PRIMARY KEY,
  customer_id BIGINT NOT NULL REFERENCES customers(id),
  order_id    BIGINT REFERENCES orders(id),
  type        TEXT NOT NULL CHECK (type IN ('DELIVERED','RETURNED','ADJUSTED')),
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_container_movements_customer_id ON container_movements(customer_id);
CREATE INDEX idx_container_movements_order_id ON container_movements(order_id);
