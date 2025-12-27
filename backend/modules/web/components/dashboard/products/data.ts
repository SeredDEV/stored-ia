import { faker } from '@faker-js/faker';
import { Product } from "./types";

// Establecer una semilla para tener datos consistentes y evitar errores de hidratación
faker.seed(123);

export const products: Product[] = Array.from({ length: 50 }, () => ({
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  icon: "checkroom",
  image: faker.image.urlLoremFlickr({ category: 'fashion', width: 100, height: 100 }),
  collection: faker.commerce.department(),
  salesChannel: "Default Sales Channel",
  variants: faker.number.int({ min: 1, max: 15 }),
  status: faker.helpers.arrayElement(["Publicado", "Borrador", "Inactivo"]),
}));
