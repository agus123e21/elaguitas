-- Migration 009: Geozonas de entrega y validación de cobertura en San Rafael
-- Autor: Arian (arianluszczak@gmail.com)

CREATE TABLE IF NOT EXISTS delivery_zones (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(30) UNIQUE NOT NULL,
    base_shipping_cost NUMERIC(10, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO delivery_zones (name, code, base_shipping_cost, is_active)
VALUES 
    ('San Rafael Centro', 'SR-CENTRO', 0.00, true),
    ('Pueblo Diamante', 'SR-DIAMANTE', 0.00, true),
    ('Barrio Unimev', 'SR-UNIMEV', 0.00, true),
    ('Las Paredes', 'SR-PAREDES', 500.00, true),
    ('Cuadro Nacional', 'SR-CUADRO-NAL', 600.00, true)
ON CONFLICT (code) DO NOTHING;

-- Agregar columna opcional de zona a órdenes si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'delivery_zone_id'
    ) THEN
        ALTER TABLE orders ADD COLUMN delivery_zone_id INTEGER REFERENCES delivery_zones(id);
    END IF;
END $$;
