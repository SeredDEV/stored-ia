// Inventory Subscriber - Maneja eventos relacionados con inventario
import { EventBus } from "../event-bus";

const eventBus = EventBus.getInstance();

eventBus.subscribe("product.created", async (product) => {
  console.log("📦 Product created, updating inventory:", product.id);
  // Crear registro de inventario para el nuevo producto
});

eventBus.subscribe("order.created", async (order) => {
  console.log("📉 Order created, updating stock:", order.id);
  // Reducir stock de productos cuando se crea un pedido
});

eventBus.subscribe("order.cancelled", async (order) => {
  console.log("📈 Order cancelled, restoring stock:", order.id);
  // Restaurar stock cuando se cancela un pedido
});





