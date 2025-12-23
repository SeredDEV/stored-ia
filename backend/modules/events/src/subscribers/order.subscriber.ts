// Order Subscriber - Maneja eventos relacionados con pedidos
import { EventBus } from '../event-bus';

const eventBus = EventBus.getInstance();

// Suscribirse a eventos de pedidos
eventBus.subscribe('order.created', async (order) => {
  console.log('📦 Order created:', order.id);
  // Lógica cuando se crea un pedido
  // - Actualizar inventario
  // - Enviar notificación
  // - Generar factura
});

eventBus.subscribe('order.updated', async (order) => {
  console.log('🔄 Order updated:', order.id);
  // Lógica cuando se actualiza un pedido
});

eventBus.subscribe('order.cancelled', async (order) => {
  console.log('❌ Order cancelled:', order.id);
  // Lógica cuando se cancela un pedido
  // - Restaurar inventario
  // - Enviar notificación
});



