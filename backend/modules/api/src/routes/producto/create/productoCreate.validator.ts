import { z } from "zod";
import { RouteValidator } from "../../../lib/routeValidator";

// Helper para limpiar strings vacíos y convertir a undefined
const emptyStringToUndefined = z.preprocess((val) => {
  if (val === "" || val === null || val === undefined) return undefined;
  return val;
}, z.string().optional());

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

// Helper para convertir string a booleano desde FormData
const stringToBoolean = z.preprocess((val) => {
  if (val === undefined || val === null || val === "") return true;
  if (typeof val === "boolean") return val;
  return val === "true" || val === "1";
}, z.boolean());

// Helper para parsear arrays desde FormData (vienen como strings JSON)
const stringToArray = (schema: z.ZodTypeAny) =>
  z.preprocess((val) => {
    if (val === undefined || val === null || val === "") return undefined;
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch {
        return undefined;
      }
    }
    return val;
  }, schema.optional());

// Helper para UUID opcional que acepta strings vacíos
const optionalUuid = z.preprocess((val) => {
  if (val === "" || val === null || val === undefined) return undefined;
  return val;
}, z.string().uuid().optional());

// Schema principal para crear producto (SOLO datos básicos)
const createProductoSchema = z
  .object({
    // Detalles básicos - SOLO titulo y slug son obligatorios
    titulo: z.string().min(1, "El título es requerido"),
    slug: z.string().min(1, "El slug es requerido"),
    subtitulo: emptyStringToUndefined,
    descripcion: emptyStringToUndefined,

    // Relaciones directas en la tabla producto - TODOS opcionales
    tiene_descuento: stringToBoolean.optional(),
    tipo_producto_id: optionalUuid,
    coleccion_id: optionalUuid,
  })
  .passthrough(); // Permite campos adicionales sin validar (por si vienen datos extra del frontend)

export type CreateProductoInput = z.infer<typeof createProductoSchema>;

export class ProductoCreateValidator {
  public validate = RouteValidator.create(createProductoSchema);
}
