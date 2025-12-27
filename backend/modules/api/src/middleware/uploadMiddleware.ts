import multer from "multer";

// Configurar multer para guardar archivos en memoria
const storage = multer.memoryStorage();

// Configurar filtro para solo aceptar imágenes
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Tipos de archivo permitidos
  const allowedMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Tipo de archivo no soportado. Solo se permiten imágenes."));
  }
};

// Configurar multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

// Middleware para subir múltiples imágenes
export const uploadProductImages = upload.fields([
  { name: "miniatura", maxCount: 1 },
  { name: "imagenes", maxCount: 10 },
]);
