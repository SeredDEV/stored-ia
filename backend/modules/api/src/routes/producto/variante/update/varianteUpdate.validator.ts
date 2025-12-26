import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const updateVarianteSchema = z.object({
  titulo: z.string().min(1).optional(),
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

export type UpdateVarianteInput = z.infer<typeof updateVarianteSchema>;

export class VarianteUpdateValidator {
  public validate = RouteValidator.create(updateVarianteSchema);
}

