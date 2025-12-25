export interface Product {
  id: string;
  name: string;
  icon: string;
  collection: string;
  salesChannel: string;
  variants: number;
  status: "Publicado" | "Borrador";
}
