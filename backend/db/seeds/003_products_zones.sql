-- Zonas de reparto
INSERT INTO delivery_zones (name, price, area) VALUES
  ('Zona 1', 1000, '[[-34.6037,-58.3816],[-34.6037,-58.3716],[-34.5937,-58.3716],[-34.5937,-58.3816]]'),
  ('Zona 2', 1500, '[[-34.6137,-58.3916],[-34.6137,-58.3816],[-34.6037,-58.3816],[-34.6037,-58.3916]]'),
  ('Zona 3', 2000, '[[-34.6237,-58.4016],[-34.6237,-58.3916],[-34.6137,-58.3916],[-34.6137,-58.4016]]')
ON CONFLICT (name) DO NOTHING;

-- Productos
INSERT INTO products (name, description, price, stock, active) VALUES
  ('Bidón de agua 20L', 'Bidón de agua mineral 20 litros con tapa', 3000, 150, TRUE),
  ('Bidón de agua 12L', 'Bidón de agua mineral 12 litros con tapa', 2200, 80, TRUE),
  ('Bidón de agua 6L', 'Bidón de agua mineral 6 litros con tapa', 1300, 60, TRUE),
  ('Dispenser de agua (fría y caliente)', 'Dispenser compacto, frío y caliente', 45000, 5, TRUE),
  ('Pack 5 bidones 20L', 'Pack de 5 bidones de 20 litros', 13500, 40, TRUE),
  ('Garrafe vacío 20L', 'Botellón vacío para cambio', 800, 200, TRUE);

-- Direcciones de clientes
INSERT INTO addresses (customer_id, label, street, city, lat, lng, delivery_zone_id, is_primary)
SELECT c.id, 'Casa', 'Av. San Martín 123', 'Buenos Aires', -34.6037, -58.3816, z.id, TRUE
FROM customers c
JOIN delivery_zones z ON z.name = 'Zona 1'
WHERE c.user_id = (SELECT id FROM users WHERE email = 'juan@cliente.com')
ON CONFLICT DO NOTHING;

INSERT INTO addresses (customer_id, label, street, city, lat, lng, delivery_zone_id, is_primary)
SELECT c.id, 'Trabajo', 'Av. Corrientes 456', 'Buenos Aires', -34.6087, -58.3816, z.id, FALSE
FROM customers c
JOIN delivery_zones z ON z.name = 'Zona 1'
WHERE c.user_id = (SELECT id FROM users WHERE email = 'juan@cliente.com')
ON CONFLICT DO NOTHING;

INSERT INTO addresses (customer_id, label, street, city, lat, lng, delivery_zone_id, is_primary)
SELECT c.id, 'Casa', 'Calle 15 789', 'La Plata', -34.9137, -57.9516, z.id, TRUE
FROM customers c
JOIN delivery_zones z ON z.name = 'Zona 2'
WHERE c.user_id = (SELECT id FROM users WHERE email = 'maria@cliente.com')
ON CONFLICT DO NOTHING;

INSERT INTO addresses (customer_id, label, street, city, lat, lng, delivery_zone_id, is_primary)
SELECT c.id, 'Casa', 'Rivadavia 321', 'Buenos Aires', -34.6137, -58.3916, z.id, TRUE
FROM customers c
JOIN delivery_zones z ON z.name = 'Zona 3'
WHERE c.user_id = (SELECT id FROM users WHERE email = 'pedro@cliente.com')
ON CONFLICT DO NOTHING;
