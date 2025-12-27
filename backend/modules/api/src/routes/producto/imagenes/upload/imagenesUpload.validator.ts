import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const uploadImagenesParamsSchema = z.object({
  id: z.string().uuid("ID de producto inválido"),
});

export type UploadImagenesParams = z.infer<typeof uploadImagenesParamsSchema>;

export class ImagenesUploadValidator {
  public validateParams = RouteValidator.params(uploadImagenesParamsSchema);
}
