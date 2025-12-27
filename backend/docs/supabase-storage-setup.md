# Configuración del Bucket de Supabase para Imágenes de Productos

Este proyecto utiliza Supabase Storage para almacenar imágenes de productos.

## Crear el Bucket

1. Ve a tu proyecto de Supabase: https://supabase.com/dashboard
2. Ve a la sección "Storage"
3. Haz clic en "New bucket"
4. Nombre del bucket: `productos`
5. Haz el bucket **público** (Public bucket: ON)
6. Haz clic en "Create bucket"

## Configurar Políticas de Acceso (RLS)

El bucket debe ser público para permitir que las imágenes sean accesibles sin autenticación.

### Política de Lectura (SELECT)

```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'productos' );
```

### Política de Inserción (INSERT)

```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'productos' );
```

### Política de Actualización (UPDATE)

```sql
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'productos' );
```

### Política de Eliminación (DELETE)

```sql
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'productos' );
```

## Estructura de Carpetas

Las imágenes se organizan en:

- `/imagenes/` - Imágenes de productos
- `/videos/` - Videos de productos (si aplica)

## Variables de Entorno Requeridas

Asegúrate de tener estas variables en tu archivo `.env`:

```
SUPABASE_URL=tu_url_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
SUPABASE_ANON_KEY=tu_anon_key (opcional, para frontend)
```

## Verificar Configuración

Para verificar que todo esté configurado correctamente, puedes probar subiendo una imagen desde el dashboard de Supabase Storage.
