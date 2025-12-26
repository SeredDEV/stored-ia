-- =====================================================
-- MIGRACIÓN SUPABASE: Módulo de Precios - Medusa v2
-- Descripción: Crea las 7 tablas del módulo de precios
-- Autor: Echo Tecnología
-- Fecha: 2024-12-25
-- PREREQUISITO: Ejecutar primero create_modulo_producto.sql
-- =====================================================

-- =====================================================
-- TABLAS PRINCIPALES (5 tablas)
-- =====================================================

-- 1. CONJUNTO_PRECIOS
CREATE TABLE IF NOT EXISTS conjunto_precios (
  id VARCHAR PRIMARY KEY,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  fecha_eliminacion TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE conjunto_precios IS 'Agrupa todos los precios de una variante de producto';

-- 2. PRECIO
CREATE TABLE IF NOT EXISTS precio (
  id VARCHAR PRIMARY KEY,
  conjunto_precios_id VARCHAR NOT NULL REFERENCES conjunto_precios(id) ON DELETE CASCADE,
  monto NUMERIC NOT NULL,
  codigo_moneda VARCHAR(3) NOT NULL,
  cantidad_minima NUMERIC,
  cantidad_maxima NUMERIC,
  contador_reglas INTEGER DEFAULT 0,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  fecha_eliminacion TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE precio IS 'Precios específicos con sus condiciones';
COMMENT ON COLUMN precio.monto IS 'Precio en CENTAVOS (ej: 15000 = $150.00)';

CREATE INDEX IF NOT EXISTS idx_precio_conjunto_id ON precio(conjunto_precios_id);
CREATE INDEX IF NOT EXISTS idx_precio_moneda ON precio(codigo_moneda);
CREATE INDEX IF NOT EXISTS idx_precio_cantidad ON precio(cantidad_minima, cantidad_maxima);

-- 3. REGLA_PRECIO
CREATE TABLE IF NOT EXISTS regla_precio (
  id VARCHAR PRIMARY KEY,
  precio_id VARCHAR NOT NULL REFERENCES precio(id) ON DELETE CASCADE,
  atributo VARCHAR NOT NULL,
  operador VARCHAR NOT NULL,
  valor JSONB NOT NULL,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE regla_precio IS 'Reglas condicionales para aplicar un precio específico';

CREATE INDEX IF NOT EXISTS idx_regla_precio_precio_id ON regla_precio(precio_id);
CREATE INDEX IF NOT EXISTS idx_regla_precio_atributo ON regla_precio(atributo);

-- 4. LISTA_PRECIOS
CREATE TABLE IF NOT EXISTS lista_precios (
  id VARCHAR PRIMARY KEY,
  titulo VARCHAR NOT NULL,
  descripcion TEXT,
  estado VARCHAR,
  tipo VARCHAR,
  fecha_inicio TIMESTAMP WITH TIME ZONE,
  fecha_fin TIMESTAMP WITH TIME ZONE,
  contador_reglas INTEGER DEFAULT 0,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  fecha_eliminacion TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE lista_precios IS 'Listas especiales de precios (promociones, grupos de clientes, etc.)';

CREATE INDEX IF NOT EXISTS idx_lista_precios_estado ON lista_precios(estado);
CREATE INDEX IF NOT EXISTS idx_lista_precios_vigencia ON lista_precios(fecha_inicio, fecha_fin);

-- 5. REGLA_LISTA_PRECIOS
CREATE TABLE IF NOT EXISTS regla_lista_precios (
  id VARCHAR PRIMARY KEY,
  lista_precios_id VARCHAR NOT NULL REFERENCES lista_precios(id) ON DELETE CASCADE,
  atributo VARCHAR NOT NULL,
  operador VARCHAR NOT NULL,
  valor JSONB NOT NULL,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

COMMENT ON TABLE regla_lista_precios IS 'Reglas para aplicar una lista de precios completa';

CREATE INDEX IF NOT EXISTS idx_rlp_lista_id ON regla_lista_precios(lista_precios_id);

-- =====================================================
-- TABLAS PIVOTE (2 tablas)
-- =====================================================

-- 6. LISTA_PRECIOS_PRECIO
CREATE TABLE IF NOT EXISTS lista_precios_precio (
  lista_precios_id VARCHAR NOT NULL REFERENCES lista_precios(id) ON DELETE CASCADE,
  precio_id VARCHAR NOT NULL REFERENCES precio(id) ON DELETE CASCADE,
  PRIMARY KEY (lista_precios_id, precio_id)
);

COMMENT ON TABLE lista_precios_precio IS 'Relaciona listas de precios con precios específicos';

CREATE INDEX IF NOT EXISTS idx_lpp_lista_id ON lista_precios_precio(lista_precios_id);
CREATE INDEX IF NOT EXISTS idx_lpp_precio_id ON lista_precios_precio(precio_id);

-- 7. VARIANTE_PRODUCTO_CONJUNTO_PRECIOS (LINK entre módulos)
CREATE TABLE IF NOT EXISTS variante_producto_conjunto_precios (
  variante_id VARCHAR NOT NULL REFERENCES variante_producto(id) ON DELETE CASCADE,
  conjunto_precios_id VARCHAR NOT NULL REFERENCES conjunto_precios(id) ON DELETE CASCADE,
  PRIMARY KEY (variante_id, conjunto_precios_id)
);

COMMENT ON TABLE variante_producto_conjunto_precios IS '⭐ TABLA CRÍTICA: Conecta el Módulo de Producto con el Módulo de Precios';

CREATE INDEX IF NOT EXISTS idx_vpcp_variante_id ON variante_producto_conjunto_precios(variante_id);
CREATE INDEX IF NOT EXISTS idx_vpcp_conjunto_id ON variante_producto_conjunto_precios(conjunto_precios_id);

-- =====================================================
-- HABILITAR ROW LEVEL SECURITY (RLS) - Supabase
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE conjunto_precios ENABLE ROW LEVEL SECURITY;
ALTER TABLE precio ENABLE ROW LEVEL SECURITY;
ALTER TABLE regla_precio ENABLE ROW LEVEL SECURITY;
ALTER TABLE lista_precios ENABLE ROW LEVEL SECURITY;
ALTER TABLE regla_lista_precios ENABLE ROW LEVEL SECURITY;
ALTER TABLE lista_precios_precio ENABLE ROW LEVEL SECURITY;
ALTER TABLE variante_producto_conjunto_precios ENABLE ROW LEVEL SECURITY;

-- Políticas básicas de lectura pública (ajustar según necesidades)
CREATE POLICY "Precios públicos lectura" ON precio FOR SELECT USING (true);
CREATE POLICY "Conjuntos públicos lectura" ON conjunto_precios FOR SELECT USING (true);
CREATE POLICY "Variante-Precios públicos lectura" ON variante_producto_conjunto_precios FOR SELECT USING (true);

-- =====================================================
-- FUNCIONES AUXILIARES PARA PRICING
-- =====================================================

-- Función para convertir centavos a formato decimal
CREATE OR REPLACE FUNCTION centavos_a_decimal(centavos NUMERIC)
RETURNS NUMERIC AS $$
BEGIN
  RETURN centavos / 100;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION centavos_a_decimal IS 'Convierte precio en centavos a formato decimal (15000 -> 150.00)';

-- Función para obtener precio activo de una variante
CREATE OR REPLACE FUNCTION obtener_precio_variante(
  p_variante_id VARCHAR,
  p_codigo_moneda VARCHAR DEFAULT 'usd',
  p_cantidad NUMERIC DEFAULT 1
)
RETURNS TABLE(
  precio_id VARCHAR,
  monto NUMERIC,
  monto_decimal NUMERIC,
  codigo_moneda VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.monto,
    centavos_a_decimal(p.monto) as monto_decimal,
    p.codigo_moneda
  FROM precio p
  INNER JOIN conjunto_precios cp ON p.conjunto_precios_id = cp.id
  INNER JOIN variante_producto_conjunto_precios vpcp ON vpcp.conjunto_precios_id = cp.id
  WHERE vpcp.variante_id = p_variante_id
    AND p.codigo_moneda = p_codigo_moneda
    AND (p.cantidad_minima IS NULL OR p.cantidad_minima <= p_cantidad)
    AND (p.cantidad_maxima IS NULL OR p.cantidad_maxima >= p_cantidad)
    AND p.fecha_eliminacion IS NULL
  ORDER BY p.monto ASC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION obtener_precio_variante IS 'Obtiene el precio activo de una variante según moneda y cantidad';

-- =====================================================
-- TRIGGERS PARA ACTUALIZAR TIMESTAMP
-- =====================================================

CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.fecha_actualizacion = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas de precios
CREATE TRIGGER trigger_actualizar_conjunto_precios
  BEFORE UPDATE ON conjunto_precios
  FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trigger_actualizar_precio
  BEFORE UPDATE ON precio
  FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trigger_actualizar_regla_precio
  BEFORE UPDATE ON regla_precio
  FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trigger_actualizar_lista_precios
  BEFORE UPDATE ON lista_precios
  FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trigger_actualizar_regla_lista_precios
  BEFORE UPDATE ON regla_lista_precios
  FOR EACH ROW EXECUTE FUNCTION actualizar_fecha_modificacion();

-- =====================================================
-- FINALIZACIÓN
-- =====================================================

