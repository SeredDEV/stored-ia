import { Router } from "express";
import multer from "multer";
import { ImagenesUploadEndpoint } from "./imagenesUpload.endpoint";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo por archivo
  },
  fileFilter: (req, file, cb) => {
    // Validar que sean imágenes
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos de imagen"));
    }
  },
});

export class ImagenesUploadNetwork {
  private endpoint: ImagenesUploadEndpoint;

  constructor(endpoint: ImagenesUploadEndpoint) {
    this.endpoint = endpoint;
  }

  setNetwork(router: Router): void {
    // POST /api/productos/:id/imagenes
    router.post(
      "/:id/imagenes",
      upload.array("imagenes", 10), // Máximo 10 imágenes
      this.endpoint.validator.validateParams,
      this.endpoint.controller.upload
    );
  }
}
