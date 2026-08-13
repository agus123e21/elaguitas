-- ============================================================
-- Pedidos de prueba con items, entregas, pagos, movimientos
-- de bidones, notificaciones y suscripciones
-- ============================================================

-- ---------- PEDIDOS ----------

-- Juan: pedido entregado (ayer)
INSERT INTO orders (customer_id, driver_id, address_id, status, subtotal, delivery_fee, discount, total, payment_method, containers_delivered, containers_returned, notes, created_at)
SELECT c.id, d.id, a.id, 'DELIVERED', 6000, 1000, 0, 7000, 'CASH', 2, 1, 'Entrega completa', NOW() - INTERVAL '1 day'
FROM customers c
JOIN users u ON u.id = c.user_id
JOIN delivery_drivers d ON d.user_id = (SELECT id FROM users WHERE email = 'repartidor@agua.com')
JOIN addresses a ON a.customer_id = c.id AND a.is_primary = TRUE
WHERE u.email = 'juan@cliente.com';

-- Juan: pedido hoy en reparto
INSERT INTO orders (customer_id, driver_id, address_id, status, subtotal, delivery_fee, discount, total, payment_method, containers_delivered, containers_returned, created_at)
SELECT c.id, d.id, a.id, 'OUT_FOR_DELIVERY', 9000, 1000, 0, 10000, 'CARD', 3, 2, NOW()
FROM customers c
JOIN users u ON u.id = c.user_id
JOIN delivery_drivers d ON d.user_id = (SELECT id FROM users WHERE email = 'repartidor@agua.com')
JOIN addresses a ON a.customer_id = c.id AND a.is_primary = TRUE
WHERE u.email = 'juan@cliente.com';

-- María: pedido pendiente
INSERT INTO orders (customer_id, address_id, status, subtotal, delivery_fee, discount, total, payment_method, containers_delivered, containers_returned, created_at)
SELECT c.id, a.id, 'PENDING', 4400, 1500, 0, 5900, 'TRANSFER', 2, 0, NOW()
FROM customers c
JOIN users u ON u.id = c.user_id
JOIN addresses a ON a.customer_id = c.id AND a.is_primary = TRUE
WHERE u.email = 'maria@cliente.com';

-- Pedro: pedido confirmado
INSERT INTO orders (customer_id, driver_id, address_id, status, subtotal, delivery_fee, discount, total, payment_method, containers_delivered, containers_returned, created_at)
SELECT c.id, d.id, a.id, 'CONFIRMED', 13500, 2000, 1350, 14150, 'CASH', 5, 0, NOW() - INTERVAL '3 hours'
FROM customers c
JOIN users u ON u.id = c.user_id
JOIN delivery_drivers d ON d.user_id = (SELECT id FROM users WHERE email = 'repartidor2@agua.com')
JOIN addresses a ON a.customer_id = c.id AND a.is_primary = TRUE
WHERE u.email = 'pedro@cliente.com';

-- Pedro: pedido preparando
INSERT INTO orders (customer_id, address_id, status, subtotal, delivery_fee, discount, total, payment_method, containers_delivered, containers_returned, created_at)
SELECT c.id, a.id, 'PREPARING', 2600, 2000, 0, 4600, 'CASH', 2, 1, NOW() - INTERVAL '2 hours'
FROM customers c
JOIN users u ON u.id = c.user_id
JOIN addresses a ON a.customer_id = c.id AND a.is_primary = TRUE
WHERE u.email = 'pedro@cliente.com';

-- María: pedido cancelado
INSERT INTO orders (customer_id, address_id, status, subtotal, delivery_fee, discount, total, payment_method, containers_delivered, containers_returned, created_at)
SELECT c.id, a.id, 'CANCELLED', 3000, 1500, 0, 4500, 'CARD', 1, 0, NOW() - INTERVAL '2 days'
FROM customers c
JOIN users u ON u.id = c.user_id
JOIN addresses a ON a.customer_id = c.id AND a.is_primary = TRUE
WHERE u.email = 'maria@cliente.com';

-- ---------- ORDER ITEMS ----------

INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
SELECT o.id, p.id, 2, 3000, 6000
FROM orders o
JOIN customers c ON c.id = o.customer_id
JOIN users u ON u.id = c.user_id
JOIN products p ON p.name = 'Bidón de agua 20L'
WHERE u.email = 'juan@cliente.com' AND o.status = 'DELIVERED';

INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
SELECT o.id, p.id, 3, 3000, 9000
FROM orders o
JOIN customers c ON c.id = o.customer_id
JOIN users u ON u.id = c.user_id
JOIN products p ON p.name = 'Bidón de agua 20L'
WHERE u.email = 'juan@cliente.com' AND o.status = 'OUT_FOR_DELIVERY';

INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
SELECT o.id, p.id, 2, 2200, 4400
FROM orders o
JOIN customers c ON c.id = o.customer_id
JOIN users u ON u.id = c.user_id
JOIN products p ON p.name = 'Bidón de agua 12L'
WHERE u.email = 'maria@cliente.com' AND o.status = 'PENDING';

INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
SELECT o.id, p.id, 1, 13500, 13500
FROM orders o
JOIN customers c ON c.id = o.customer_id
JOIN users u ON u.id = c.user_id
JOIN products p ON p.name = 'Pack 5 bidones 20L'
WHERE u.email = 'pedro@cliente.com' AND o.status = 'CONFIRMED';

INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
SELECT o.id, p.id, 2, 1300, 2600
FROM orders o
JOIN customers c ON c.id = o.customer_id
JOIN users u ON u.id = c.user_id
JOIN products p ON p.name = 'Bidón de agua 6L'
WHERE u.email = 'pedro@cliente.com' AND o.status = 'PREPARING';

INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
SELECT o.id, p.id, 1, 3000, 3000
FROM orders o
JOIN customers c ON c.id = o.customer_id
JOIN users u ON u.id = c.user_id
JOIN products p ON p.name = 'Bidón de agua 20L'
WHERE u.email = 'maria@cliente.com' AND o.status = 'CANCELLED';

-- ---------- PAGOS ----------

INSERT INTO payments (order_id, method, status, amount, reference, paid_at)
SELECT o.id, 'CASH', 'PAID', o.total, 'REC-0001', NOW() - INTERVAL '1 day'
FROM orders o
JOIN customers c ON c.id = o.customer_id
JOIN users u ON u.id = c.user_id
WHERE u.email = 'juan@cliente.com' AND o.status = 'DELIVERED';

INSERT INTO payments (order_id, method, status, amount, reference, paid_at)
SELECT o.id, 'CARD', 'PAID', o.total, 'REC-0002', NOW()
FROM orders o
JOIN customers c ON c.id = o.customer_id
JOIN users u ON u.id = c.user_id
WHERE u.email = 'juan@cliente.com' AND o.status = 'OUT_FOR_DELIVERY';

-- ---------- ENTREGAS ----------

INSERT INTO deliveries (order_id, driver_id, status, containers_returned, delivered_at, notes)
SELECT o.id, d.id, 'DELIVERED', 1, NOW() - INTERVAL '1 day', 'Entregado en domicilio'
FROM orders o
JOIN customers c ON c.id = o.customer_id
JOIN users u ON u.id = c.user_id
JOIN delivery_drivers d ON d.user_id = (SELECT id FROM users WHERE email = 'repartidor@agua.com')
WHERE u.email = 'juan@cliente.com' AND o.status = 'DELIVERED';

INSERT INTO deliveries (order_id, driver_id, status)
SELECT o.id, d.id, 'IN_TRANSIT'
FROM orders o
JOIN customers c ON c.id = o.customer_id
JOIN users u ON u.id = c.user_id
JOIN delivery_drivers d ON d.user_id = (SELECT id FROM users WHERE email = 'repartidor@agua.com')
WHERE u.email = 'juan@cliente.com' AND o.status = 'OUT_FOR_DELIVERY';

-- ---------- BIDONES: movimientos ----------

INSERT INTO container_movements (customer_id, order_id, type, quantity, notes, created_at)
SELECT c.id, o.id, 'DELIVERED', 2, 'Entrega de 2 bidones', NOW() - INTERVAL '1 day'
FROM customers c
JOIN users u ON u.id = c.user_id
JOIN orders o ON o.customer_id = c.id
WHERE u.email = 'juan@cliente.com' AND o.status = 'DELIVERED';

INSERT INTO container_movements (customer_id, order_id, type, quantity, notes, created_at)
SELECT c.id, o.id, 'RETURNED', 1, 'Retiro de 1 bidón', NOW() - INTERVAL '1 day'
FROM customers c
JOIN users u ON u.id = c.user_id
JOIN orders o ON o.customer_id = c.id
WHERE u.email = 'juan@cliente.com' AND o.status = 'DELIVERED';

INSERT INTO container_movements (customer_id, order_id, type, quantity, notes, created_at)
SELECT c.id, o.id, 'DELIVERED', 3, 'Entrega de 3 bidones', NOW()
FROM customers c
JOIN users u ON u.id = c.user_id
JOIN orders o ON o.customer_id = c.id
WHERE u.email = 'juan@cliente.com' AND o.status = 'OUT_FOR_DELIVERY';

INSERT INTO container_movements (customer_id, order_id, type, quantity, notes, created_at)
SELECT c.id, o.id, 'DELIVERED', 5, 'Entrega pack 5 bidones', NOW() - INTERVAL '3 hours'
FROM customers c
JOIN users u ON u.id = c.user_id
JOIN orders o ON o.customer_id = c.id
WHERE u.email = 'pedro@cliente.com' AND o.status = 'CONFIRMED';

-- Inventario físico de bidones en manos de clientes
INSERT INTO containers (status, customer_id)
SELECT 'WITH_CUSTOMER', c.id
FROM customers c
JOIN users u ON u.id = c.user_id
WHERE u.email = 'juan@cliente.com';

INSERT INTO containers (status, customer_id)
SELECT 'WITH_CUSTOMER', c.id
FROM customers c
JOIN users u ON u.id = c.user_id
WHERE u.email = 'pedro@cliente.com';

-- ---------- NOTIFICACIONES ----------

INSERT INTO notifications (user_id, type, title, message, read)
SELECT u.id, 'ORDER', 'Pedido entregado', 'Tu pedido fue entregado. ¡Gracias por comprar!', FALSE
FROM users u WHERE u.email = 'juan@cliente.com';

INSERT INTO notifications (user_id, type, title, message, read)
SELECT u.id, 'ORDER', 'Pedido en reparto', 'Tu pedido salió a reparto. Vas a recibirlo en breve.', FALSE
FROM users u WHERE u.email = 'juan@cliente.com';

INSERT INTO notifications (user_id, type, title, message, read)
SELECT u.id, 'ORDER', 'Pedido confirmado', 'Tu pedido fue confirmado y está en preparación.', TRUE
FROM users u WHERE u.email = 'pedro@cliente.com';

-- ---------- SUSCRIPCIONES ----------

INSERT INTO subscriptions (customer_id, address_id, product_id, quantity, frequency_days, status, next_delivery_date)
SELECT c.id, a.id, p.id, 2, 7, 'ACTIVE', CURRENT_DATE + 7
FROM customers c
JOIN users u ON u.id = c.user_id
JOIN addresses a ON a.customer_id = c.id AND a.is_primary = TRUE
JOIN products p ON p.name = 'Bidón de agua 20L'
WHERE u.email = 'maria@cliente.com';

INSERT INTO subscriptions (customer_id, address_id, product_id, quantity, frequency_days, status, next_delivery_date)
SELECT c.id, a.id, p.id, 3, 15, 'ACTIVE', CURRENT_DATE + 15
FROM customers c
JOIN users u ON u.id = c.user_id
JOIN addresses a ON a.customer_id = c.id AND a.is_primary = TRUE
JOIN products p ON p.name = 'Bidón de agua 12L'
WHERE u.email = 'juan@cliente.com';
