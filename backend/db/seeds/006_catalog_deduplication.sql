-- Seed 006: Desduplicación y normalización del catálogo oficial de San Rafael
-- Autores: Arian (arianluszczak@gmail.com), Agus (agus123e21@users.noreply.github.com), HugoAleOlguin (hugo145olguin@gmail.com)

-- Desactivar duplicados viejos conservando integridad referencial con order_items
UPDATE products
SET active = false
WHERE id >= 7 AND id != 26;

-- Asegurar nombres canónicos, stock y descripciones para el catálogo enriquecido
UPDATE products
SET name = 'Bidón 20L Retornable',
    description = 'Agua purificada por ósmosis inversa en envase retornable premium de 20 litros.',
    price = 3200,
    stock = 120,
    active = true
WHERE id = 1;

UPDATE products
SET name = 'Bidón 12L Compacto Retornable',
    description = 'Formato liviano de 12 litros ideal para espacios reducidos y fácil manipulación.',
    price = 2400,
    stock = 85,
    active = true
WHERE id = 2;

UPDATE products
SET name = 'Bidón 20L Descartable',
    description = 'Bidón descartable con manija ergonómica reforzada. No requiere canje de envase.',
    price = 4800,
    stock = 50,
    active = true
WHERE id = 3;

UPDATE products
SET name = 'Dispenser Frío / Calor de Pie',
    description = 'Dispensador de pie con compresor silencioso, agua helada y agua caliente instantánea.',
    price = 68000,
    stock = 15,
    active = true
WHERE id = 4;

UPDATE products
SET name = 'Pack Ahorro 5x Bidones 20L',
    description = 'Pack mensual de 5 recargas de 20 litros con descuento exclusivo y entrega bonificada.',
    price = 14500,
    stock = 40,
    active = true
WHERE id = 5;

UPDATE products
SET name = 'Bomba Eléctrica USB para Bidón',
    description = 'Dispensador automático inalámbrico recargable por USB con batería de larga duración.',
    price = 9500,
    stock = 60,
    active = true
WHERE id = 6;

-- Soporte de mesa reforzado con canilla dosificadora
INSERT INTO products (id, name, description, price, stock, active)
VALUES (
  26,
  'Soporte Metálico de Mesa + Canilla',
  'Estructura de acero reforzada para apoyar bidón en mesada con canilla dosificadora antigoteo.',
  8200.00,
  45,
  true
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  stock = EXCLUDED.stock,
  active = EXCLUDED.active;
