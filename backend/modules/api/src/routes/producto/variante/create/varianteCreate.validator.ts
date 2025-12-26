import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const createVarianteSchema = z.object({
  producto_id: z.string().uuid("El producto_id debe ser un UUID válido"),
  titulo: z.string().min(1, "El título es requerido"),
  sku: z.string().optional(),
  codigo_barras: z.string().optional(),
  ean: z.string().optional(),
  upc: z.string().optional(),
  miniatura: z.string().optional(),
  permitir_pedido_pendiente: z.boolean().optional(),
  gestionar_inventario: z.boolean().optional(),
  peso: z.number().optional(),
  largo: z.number().optional(),
  alto: z.number().optional(),
  ancho: z.number().optional(),
  codigo_hs: z.string().optional(),
  pais_origen: z.string().optional(),
  codigo_mid: z.string().optional(),
  material: z.string().optional(),
  rango_variante: z.number().optional(),
  metadatos: z.record(z.any()).optional(),
  opciones: z.array(z.string().uuid()).optional(),
});

export type CreateVarianteInput = z.infer<typeof createVarianteSchema>;

export class VarianteCreateValidator {
  public validate = RouteValidator.create(createVarianteSchema);
}

