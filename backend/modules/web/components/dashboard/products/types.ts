export interface Product {
  id: string;
  name: string;
  icon: string;
  image?: string;
  collection: string;
  salesChannel: string;
  variants: number;
  status: "Publicado" | "Borrador" | "Inactivo";
}
