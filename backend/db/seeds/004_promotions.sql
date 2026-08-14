-- Promociones de prueba (idempotente por código)
INSERT INTO promotions (name, code, type, value, pack_quantity, min_quantity, min_order_amount, active, starts_at, ends_at) VALUES
  ('10% en packs de 5', 'PACK5', 'PACK', 10, 5, 5, NULL, TRUE, NULL, NULL),
  ('Código bienvenida', 'AGUA2026', 'PERCENTAGE', 10, NULL, NULL, NULL, TRUE, NULL, '2026-12-31'),
  ('Envío gratis +$15000', NULL, 'FREE_SHIPPING', NULL, NULL, NULL, 15000, TRUE, NULL, NULL),
  ('$500 de descuento +$10000', NULL, 'FIXED_AMOUNT', 500, NULL, NULL, 10000, TRUE, NULL, NULL)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  value = EXCLUDED.value,
  pack_quantity = EXCLUDED.pack_quantity,
  min_quantity = EXCLUDED.min_quantity,
  min_order_amount = EXCLUDED.min_order_amount,
  active = EXCLUDED.active,
  starts_at = EXCLUDED.starts_at,
  ends_at = EXCLUDED.ends_at;
