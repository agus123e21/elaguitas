-- ============================================================
-- 003_orders.sql
-- Pedidos, items, pagos y entregas
-- ============================================================

CREATE TABLE orders (
  id                  BIGSERIAL PRIMARY KEY,
  customer_id         BIGINT NOT NULL REFERENCES customers(id),
  driver_id           BIGINT REFERENCES delivery_drivers(id),
  address_id          BIGINT NOT NULL REFERENCES addresses(id),
  status              TEXT NOT NULL DEFAULT 'PENDING'
                      CHECK (status IN ('PENDING','CONFIRMED','PREPARING','OUT_FOR_DELIVERY','DELIVERED','CANCELLED')),
  subtotal            NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
  delivery_fee        NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
  discount            NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total               NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
  payment_method      TEXT NOT NULL DEFAULT 'CASH'
                      CHECK (payment_method IN ('CASH','CARD','TRANSFER')),
  containers_delivered INTEGER NOT NULL DEFAULT 0,
  containers_returned  INTEGER NOT NULL DEFAULT 0,
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_driver_id ON orders(driver_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- ---------- ORDER ITEMS ----------
CREATE TABLE order_items (
  id          BIGSERIAL PRIMARY KEY,
  order_id    BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  BIGINT NOT NULL REFERENCES products(id),
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  unit_price  NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  subtotal    NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0)
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- ---------- PAYMENTS ----------
CREATE TABLE payments (
  id          BIGSERIAL PRIMARY KEY,
  order_id    BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  method      TEXT NOT NULL CHECK (method IN ('CASH','CARD','TRANSFER')),
  status      TEXT NOT NULL DEFAULT 'PENDING'
              CHECK (status IN ('PENDING','PAID','FAILED','REFUNDED')),
  amount      NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
  reference   TEXT,
  paid_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_order_id ON payments(order_id);

-- ---------- DELIVERIES ----------
CREATE TABLE deliveries (
  id           BIGSERIAL PRIMARY KEY,
  order_id     BIGINT NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  driver_id    BIGINT REFERENCES delivery_drivers(id),
  status       TEXT NOT NULL DEFAULT 'ASSIGNED'
               CHECK (status IN ('ASSIGNED','IN_TRANSIT','DELIVERED','FAILED')),
  containers_returned INTEGER NOT NULL DEFAULT 0,
  delivered_at TIMESTAMPTZ,
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_deliveries_updated_at
  BEFORE UPDATE ON deliveries
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_deliveries_driver_id ON deliveries(driver_id);
