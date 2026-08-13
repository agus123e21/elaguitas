-- Usuarios de prueba (contraseña de todos: 123456)
-- Hash bcrypt de "123456": $2a$10$KE2e6wTLcQQxXpAS.Dza8ui.A7yJmi4RhPM0alZQSLBhhEyw4hV4i

INSERT INTO users (email, password_hash, name, phone, role_id)
SELECT 'admin@agua.com', '$2a$10$KE2e6wTLcQQxXpAS.Dza8ui.A7yJmi4RhPM0alZQSLBhhEyw4hV4i', 'Administrador', '11 1234 0001', r.id
FROM roles r WHERE r.name = 'ADMIN'
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (email, password_hash, name, phone, role_id)
SELECT 'repartidor@agua.com', '$2a$10$KE2e6wTLcQQxXpAS.Dza8ui.A7yJmi4RhPM0alZQSLBhhEyw4hV4i', 'Carlos Reparto', '11 1234 0002', r.id
FROM roles r WHERE r.name = 'DRIVER'
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (email, password_hash, name, phone, role_id)
SELECT 'repartidor2@agua.com', '$2a$10$KE2e6wTLcQQxXpAS.Dza8ui.A7yJmi4RhPM0alZQSLBhhEyw4hV4i', 'Lucía Reparto', '11 1234 0003', r.id
FROM roles r WHERE r.name = 'DRIVER'
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (email, password_hash, name, phone, role_id)
SELECT 'juan@cliente.com', '$2a$10$KE2e6wTLcQQxXpAS.Dza8ui.A7yJmi4RhPM0alZQSLBhhEyw4hV4i', 'Juan Pérez', '11 1234 0010', r.id
FROM roles r WHERE r.name = 'CLIENT'
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (email, password_hash, name, phone, role_id)
SELECT 'maria@cliente.com', '$2a$10$KE2e6wTLcQQxXpAS.Dza8ui.A7yJmi4RhPM0alZQSLBhhEyw4hV4i', 'María López', '11 1234 0011', r.id
FROM roles r WHERE r.name = 'CLIENT'
ON CONFLICT (email) DO NOTHING;

INSERT INTO users (email, password_hash, name, phone, role_id)
SELECT 'pedro@cliente.com', '$2a$10$KE2e6wTLcQQxXpAS.Dza8ui.A7yJmi4RhPM0alZQSLBhhEyw4hV4i', 'Pedro Gómez', '11 1234 0012', r.id
FROM roles r WHERE r.name = 'CLIENT'
ON CONFLICT (email) DO NOTHING;

-- Clientes
INSERT INTO customers (user_id)
SELECT id FROM users WHERE email = 'juan@cliente.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO customers (user_id)
SELECT id FROM users WHERE email = 'maria@cliente.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO customers (user_id)
SELECT id FROM users WHERE email = 'pedro@cliente.com'
ON CONFLICT (user_id) DO NOTHING;

-- Repartidores
INSERT INTO delivery_drivers (user_id, vehicle)
SELECT id, 'Moto Honda' FROM users WHERE email = 'repartidor@agua.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO delivery_drivers (user_id, vehicle)
SELECT id, 'Furgón Fiat' FROM users WHERE email = 'repartidor2@agua.com'
ON CONFLICT (user_id) DO NOTHING;
