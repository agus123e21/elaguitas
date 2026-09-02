-- Migration 008: Optimización de índices B-Tree para órdenes y repartos
-- Autor: Arian (arianluszczak@gmail.com)

CREATE INDEX IF NOT EXISTS idx_orders_driver_status 
ON orders (driver_id, status);

CREATE INDEX IF NOT EXISTS idx_orders_customer_created 
ON orders (customer_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orders_delivery_date 
ON orders (delivery_date) 
WHERE status IN ('PENDING', 'ACCEPTED', 'IN_TRANSIT');

CREATE INDEX IF NOT EXISTS idx_containers_balance_customer 
ON container_balances (customer_id);

COMMENT ON INDEX idx_orders_driver_status IS 'Optimiza la consulta de hoja de ruta y despacho del chofer';
COMMENT ON INDEX idx_orders_customer_created IS 'Acelera el historial de pedidos en el dashboard de cliente';
