-- =====================================================
-- MIGRACIÓN SUPABASE: Módulo de Producto - Medusa v2
-- Descripción: Crea las 13 tablas del módulo de producto
-- Autor: Echo Tecnología
-- Fecha: 2024-12-25
-- =====================================================

-- =====================================================
-- TABLAS PRINCIPALES (9 tablas)
-- =====================================================

-- 1. TIPO_PRODUCTO
CREATE TABLE IF NOT EXISTS tipo_producto (
  id VARCHAR PRIMARY KEY,
  valor VARCHAR NOT NULL,
  metadatos JSONB,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  fecha_eliminacion TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE tipo_producto IS 'Clasificación general del producto (ej: Domótica, Iluminación, Seguridad)';

-- 2. COLECCION_PRODUCTO
CREATE TABLE IF NOT EXISTS coleccion_producto (
  id VARCHAR PRIMARY KEY,
  titulo VARCHAR NOT NULL,
  slug VARCHAR UNIQUE,
  metadatos JSONB,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  fecha_eliminacion TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE coleccion_producto IS 'Agrupaciones especiales de productos para marketing y promociones';

CREATE INDEX IF NOT EXISTS idx_coleccion_slug ON coleccion_producto(slug);

-- 3. PRODUCTO (tabla principal)
CREATE TABLE IF NOT EXISTS producto (
  id VARCHAR PRIMARY KEY,
  titulo VARCHAR NOT NULL,
  subtitulo VARCHAR,
  descripcion TEXT,
  slug VARCHAR UNIQUE NOT NULL,
  id_externo VARCHAR,
  estado VARCHAR NOT NULL,
  es_tarjeta_regalo BOOLEAN DEFAULT FALSE,
  tiene_descuento BOOLEAN DEFAULT TRUE,
  miniatura VARCHAR,
  peso VARCHAR,
  largo VARCHAR,
  alto VARCHAR,
  ancho VARCHAR,
  pais_origen VARCHAR,
  codigo_hs VARCHAR,
  codigo_mid VARCHAR,
  material VARCHAR,
  tipo_producto_id VARCHAR REFERENCES tipo_producto(id),
  coleccion_id VARCHAR REFERENCES coleccion_producto(id),
  metadatos JSONB,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  fecha_eliminacion TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE producto IS 'Tabla principal de productos';

CREATE INDEX IF NOT EXISTS idx_producto_slug ON producto(slug);
CREATE INDEX IF NOT EXISTS idx_producto_estado ON producto(estado);
CREATE INDEX IF NOT EXISTS idx_producto_tipo_producto_id ON producto(tipo_producto_id);
CREATE INDEX IF NOT EXISTS idx_producto_coleccion_id ON producto(coleccion_id);

-- 4. VARIANTE_PRODUCTO
CREATE TABLE IF NOT EXISTS variante_producto (
  id VARCHAR PRIMARY KEY,
  producto_id VARCHAR NOT NULL REFERENCES producto(id) ON DELETE CASCADE,
  titulo VARCHAR NOT NULL,
  sku VARCHAR,
  codigo_barras VARCHAR,
  ean VARCHAR,
  upc VARCHAR,
  miniatura VARCHAR,
  permitir_pedido_pendiente BOOLEAN DEFAULT FALSE,
  gestionar_inventario BOOLEAN DEFAULT TRUE,
  peso NUMERIC,
  largo NUMERIC,
  alto NUMERIC,
  ancho NUMERIC,
  codigo_hs VARCHAR,
  pais_origen VARCHAR,
  codigo_mid VARCHAR,
  material VARCHAR,
  rango_variante NUMERIC,
  metadatos JSONB,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  fecha_eliminacion TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE variante_producto IS 'Variantes específicas de cada producto';

CREATE INDEX IF NOT EXISTS idx_variante_producto_id ON variante_producto(producto_id);
CREATE INDEX IF NOT EXISTS idx_variante_sku ON variante_producto(sku);
CREATE UNIQUE INDEX IF NOT EXISTS idx_variante_sku_unique ON variante_producto(sku) WHERE sku IS NOT NULL;

-- 5. OPCION_PRODUCTO
CREATE TABLE IF NOT EXISTS opcion_producto (
  id VARCHAR PRIMARY KEY,
  producto_id VARCHAR NOT NULL REFERENCES producto(id) ON DELETE CASCADE,
  titulo VARCHAR NOT NULL,
  metadatos JSONB,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  fecha_eliminacion TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE opcion_producto IS 'Opciones de variación (ej: Color, Talla, Canales)';

CREATE INDEX IF NOT EXISTS idx_opcion_producto_id ON opcion_producto(producto_id);

-- 6. VALOR_OPCION_PRODUCTO
CREATE TABLE IF NOT EXISTS valor_opcion_producto (
  id VARCHAR PRIMARY KEY,
  opcion_id VARCHAR NOT NULL REFERENCES opcion_producto(id) ON DELETE CASCADE,
  valor VARCHAR NOT NULL,
  metadatos JSONB,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  fecha_eliminacion TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE valor_opcion_producto IS 'Valores específicos para cada opción';

CREATE INDEX IF NOT EXISTS idx_valor_opcion_opcion_id ON valor_opcion_producto(opcion_id);

-- 7. IMAGEN_PRODUCTO
CREATE TABLE IF NOT EXISTS imagen_producto (
  id VARCHAR PRIMARY KEY,
  producto_id VARCHAR NOT NULL REFERENCES producto(id) ON DELETE CASCADE,
  url VARCHAR NOT NULL,
  rango NUMERIC DEFAULT 0,
  metadatos JSONB,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  fecha_eliminacion TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE imagen_producto IS 'Imágenes del producto';

CREATE INDEX IF NOT EXISTS idx_imagen_producto_id ON imagen_producto(producto_id);
CREATE INDEX IF NOT EXISTS idx_imagen_rango ON imagen_producto(producto_id, rango);

-- 8. ETIQUETA_PRODUCTO
CREATE TABLE IF NOT EXISTS etiqueta_producto (
  id VARCHAR PRIMARY KEY,
  valor VARCHAR NOT NULL UNIQUE,
  metadatos JSONB,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  fecha_eliminacion TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE etiqueta_producto IS 'Etiquetas/tags para clasificar productos';

CREATE UNIQUE INDEX IF NOT EXISTS idx_etiqueta_valor ON etiqueta_producto(valor);

-- 9. CATEGORIA_PRODUCTO
CREATE TABLE IF NOT EXISTS categoria_producto (
  id VARCHAR PRIMARY KEY,
  nombre VARCHAR NOT NULL,
  descripcion TEXT,
  slug VARCHAR UNIQUE,
  categoria_padre_id VARCHAR REFERENCES categoria_producto(id),
  ruta_materializada VARCHAR,
  rango NUMERIC DEFAULT 0,
  activa BOOLEAN DEFAULT TRUE,
  interna BOOLEAN DEFAULT FALSE,
  metadatos JSONB,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  fecha_eliminacion TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE categoria_producto IS 'Categorías jerárquicas de productos';

CREATE INDEX IF NOT EXISTS idx_categoria_slug ON categoria_producto(slug);
CREATE INDEX IF NOT EXISTS idx_categoria_padre_id ON categoria_producto(categoria_padre_id);
CREATE INDEX IF NOT EXISTS idx_categoria_ruta ON categoria_producto(ruta_materializada);

-- =====================================================
-- TABLAS PIVOTE (4 tablas)
-- =====================================================

-- 10. VARIANTE_PRODUCTO_OPCION
CREATE TABLE IF NOT EXISTS variante_producto_opcion (
  id VARCHAR PRIMARY KEY,
  variante_id VARCHAR NOT NULL REFERENCES variante_producto(id) ON DELETE CASCADE,
  valor_opcion_id VARCHAR NOT NULL REFERENCES valor_opcion_producto(id) ON DELETE CASCADE,
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(variante_id, valor_opcion_id)
);

COMMENT ON TABLE variante_producto_opcion IS 'Relaciona variantes con sus valores de opciones';

CREATE INDEX IF NOT EXISTS idx_vpo_variante_id ON variante_producto_opcion(variante_id);
CREATE INDEX IF NOT EXISTS idx_vpo_valor_opcion_id ON variante_producto_opcion(valor_opcion_id);

-- 11. VARIANTE_PRODUCTO_IMAGEN
CREATE TABLE IF NOT EXISTS variante_producto_imagen (
  variante_id VARCHAR NOT NULL REFERENCES variante_producto(id) ON DELETE CASCADE,
  imagen_id VARCHAR NOT NULL REFERENCES imagen_producto(id) ON DELETE CASCADE,
  PRIMARY KEY (variante_id, imagen_id)
);

COMMENT ON TABLE variante_producto_imagen IS 'Relaciona variantes con imágenes específicas';

CREATE INDEX IF NOT EXISTS idx_vpi_variante_id ON variante_producto_imagen(variante_id);
CREATE INDEX IF NOT EXISTS idx_vpi_imagen_id ON variante_producto_imagen(imagen_id);

-- 12. PRODUCTO_ETIQUETAS
CREATE TABLE IF NOT EXISTS producto_etiquetas (
  producto_id VARCHAR NOT NULL REFERENCES producto(id) ON DELETE CASCADE,
  etiqueta_producto_id VARCHAR NOT NULL REFERENCES etiqueta_producto(id) ON DELETE CASCADE,
  PRIMARY KEY (producto_id, etiqueta_producto_id)
);

COMMENT ON TABLE producto_etiquetas IS 'Relaciona productos con etiquetas (muchos a muchos)';

CREATE INDEX IF NOT EXISTS idx_pe_producto_id ON producto_etiquetas(producto_id);
CREATE INDEX IF NOT EXISTS idx_pe_etiqueta_id ON producto_etiquetas(etiqueta_producto_id);

-- 13. CATEGORIA_PRODUCTO_PRODUCTO
CREATE TABLE IF NOT EXISTS categoria_producto_producto (
  categoria_producto_id VARCHAR NOT NULL REFERENCES categoria_producto(id) ON DELETE CASCADE,
  producto_id VARCHAR NOT NULL REFERENCES producto(id) ON DELETE CASCADE,
  PRIMARY KEY (categoria_producto_id, producto_id)
);

COMMENT ON TABLE categoria_producto_producto IS 'Relaciona productos con categorías (muchos a muchos)';

CREATE INDEX IF NOT EXISTS idx_cpp_categoria_id ON categoria_producto_producto(categoria_producto_id);
CREATE INDEX IF NOT EXISTS idx_cpp_producto_id ON categoria_producto_producto(producto_id);

-- =====================================================
-- HABILITAR ROW LEVEL SECURITY (RLS) - Supabase
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE tipo_producto ENABLE ROW LEVEL SECURITY;
ALTER TABLE coleccion_producto ENABLE ROW LEVEL SECURITY;
ALTER TABLE producto ENABLE ROW LEVEL SECURITY;
ALTER TABLE variante_producto ENABLE ROW LEVEL SECURITY;
ALTER TABLE opcion_producto ENABLE ROW LEVEL SECURITY;
ALTER TABLE valor_opcion_producto ENABLE ROW LEVEL SECURITY;
ALTER TABLE imagen_producto ENABLE ROW LEVEL SECURITY;
ALTER TABLE etiqueta_producto ENABLE ROW LEVEL SECURITY;
ALTER TABLE categoria_producto ENABLE ROW LEVEL SECURITY;
ALTER TABLE variante_producto_opcion ENABLE ROW LEVEL SECURITY;
ALTER TABLE variante_producto_imagen ENABLE ROW LEVEL SECURITY;
ALTER TABLE producto_etiquetas ENABLE ROW LEVEL SECURITY;
ALTER TABLE categoria_producto_producto ENABLE ROW LEVEL SECURITY;

-- Políticas básicas de lectura pública (ajustar según necesidades)
CREATE POLICY "Productos públicos lectura" ON producto FOR SELECT USING (estado = 'publicado');
CREATE POLICY "Variantes públicas lectura" ON variante_producto FOR SELECT USING (true);
CREATE POLICY "Imágenes públicas lectura" ON imagen_producto FOR SELECT USING (true);
CREATE POLICY "Categorías públicas lectura" ON categoria_producto FOR SELECT USING (activa = true);
CREATE POLICY "Etiquetas públicas lectura" ON etiqueta_producto FOR SELECT USING (true);

-- =====================================================
-- FINALIZACIÓN
-- =====================================================

