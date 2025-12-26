import { z } from "zod";
import { RouteValidator } from "../../../lib/routeValidator";

// Schema para opciones de variantes
const opcionSchema = z.object({
  titulo: z.string().min(1, "El título de la opción es requerido"),
  valores: z.array(z.string().min(1)).min(1, "Debe tener al menos un valor"),
});

// Schema para archivo de imagen (base64)
const imagenArchivoSchema = z.object({
  buffer: z.string().min(1, "El buffer de la imagen es requerido"),
  fileName: z.string().min(1, "El nombre del archivo es requerido"),
  contentType: z.string().optional(),
});

// Schema para miniatura (puede ser URL o archivo)
const miniaturaSchema = z.union([z.string().url(), imagenArchivoSchema]);

// Schema para imágenes (array de URLs o archivos)
const imagenesSchema = z.array(
  z.union([z.string().url(), imagenArchivoSchema])
);

// Schema principal para crear producto
const createProductoSchema = z.object({
  // Detalles
  titulo: z.string().min(1, "El título es requerido"),
  subtitulo: z.string().optional(),
  descripcion: z.string().optional(),
  slug: z.string().min(1, "El slug es requerido"),
  miniatura: miniaturaSchema.optional(),
  imagenes: imagenesSchema.optional(),

  // Organizar
  tiene_descuento: z.boolean().default(true),
  tipo_producto_id: z.string().uuid().optional(),
  coleccion_id: z.string().uuid().optional(),
  categorias: z.array(z.string().uuid()).optional(),
  etiquetas: z.array(z.string().uuid()).optional(),

  // Variantes
  tiene_variantes: z.boolean().default(false),
  opciones: z.array(opcionSchema).optional(),
});

export type CreateProductoInput = z.infer<typeof createProductoSchema>;

export class ProductoCreateValidator {
  public validate = RouteValidator.create(createProductoSchema);
}
