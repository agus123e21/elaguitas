-- Roles base
INSERT INTO roles (name) VALUES
  ('CLIENT'),
  ('DRIVER'),
  ('ADMIN')
ON CONFLICT (name) DO NOTHING;
