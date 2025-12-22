// Event Bus - Sistema de publicación/suscripción de eventos
type EventHandler = (data: any) => void | Promise<void>;

export class EventBus {
  private static instance: EventBus;
  private handlers: Map<string, EventHandler[]> = new Map();

  private constructor() {}

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  // Suscribirse a un evento
  subscribe(event: string, handler: EventHandler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler);
  }

  // Desuscribirse de un evento
  unsubscribe(event: string, handler: EventHandler) {
    const handlers = this.handlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  // Emitir un evento
  async emit(event: string, data: any) {
    const handlers = this.handlers.get(event) || [];
    console.log(`📢 Event emitted: ${event}`, { handlers: handlers.length });
    
    // Ejecutar todos los handlers de forma asíncrona
    await Promise.all(
      handlers.map(async (handler) => {
        try {
          await handler(data);
        } catch (error) {
          console.error(`❌ Error in event handler for ${event}:`, error);
        }
      })
    );
  }
}

