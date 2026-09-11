-- Seed 006: Desduplicación y normalización del catálogo oficial de San Rafael
-- Autor: Arian (arianluszczak@gmail.com)

-- Asegurar que sólo los primeros 6 productos canónicos permanezcan activos
UPDATE products
SET is_active = false
WHERE id > 6;

-- Asegurar nombres canónicos y stock para los 6 productos primarios
UPDATE products
SET name = 'Bidón 20L Retornable',
    description = 'Agua purificada de máxima pureza en envase de 20 litros retornable. Incluye control bromatológico.',
    price = 3200,
    stock = 250,
    is_active = true
WHERE id = 1;

UPDATE products
SET name = 'Bidón 12L Compacto Retornable',
    description = 'Envase práctico y liviano de 12 litros retornable, ideal para espacios reducidos o bajo mesada.',
    price = 2400,
    stock = 180,
    is_active = true
WHERE id = 2;

UPDATE products
SET name = 'Bidón 20L Descartable',
    description = 'Envase de primer uso sin necesidad de entrega de retornables vacíos. Listo para consumir.',
    price = 4500,
    stock = 120,
    is_active = true
WHERE id = 3;

UPDATE products
SET name = 'Dispensador Frío/Calor de Pie',
    description = 'Equipo compresor de alto rendimiento para hogares y oficinas con doble canilla y termostato regulable.',
    price = 68000,
    stock = 25,
    is_active = true
WHERE id = 4;

UPDATE products
SET name = 'Bomba Eléctrica USB Recargable',
    description = 'Dispositivo dispensador portátil recargable por USB tipo C. Batería de larga duración (hasta 5 bidones).',
    price = 9500,
    stock = 60,
    is_active = true
WHERE id = 5;

UPDATE products
SET name = 'Soporte de Mesa + Canilla Dosificadora',
    description = 'Estructura metálica resistente con tratamiento epoxi blanco y válvula dosificadora de fácil limpieza.',
    price = 8200,
    stock = 40,
    is_active = true
WHERE id = 6;
