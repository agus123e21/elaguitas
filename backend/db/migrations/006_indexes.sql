-- ============================================================
-- 006_indexes.sql
-- Índices adicionales para consultas frecuentes
-- ============================================================

-- Pedidos por estado y fecha (dashboard)
CREATE INDEX IF NOT EXISTS idx_orders_status_created_at
  ON orders(status, created_at DESC);

-- Subtotal por item (estadísticas de ventas)
CREATE INDEX IF NOT EXISTS idx_order_items_product_id_qty
  ON order_items(product_id, quantity);

-- Movimientos por cliente y tipo (balance de bidones)
CREATE INDEX IF NOT EXISTS idx_container_movements_customer_type
  ON container_movements(customer_id, type);
