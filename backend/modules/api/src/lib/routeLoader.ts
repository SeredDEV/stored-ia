import type { Express } from "express";
import path from "path";
import fs from "fs";

/**
 * Interfaz que deben implementar las clases de rutas.
 * Todas las rutas deben tener un método estático `register`.
 */
export interface RouteRegister {
  register(server: Express, ...args: any[]): void;
}

/**
 * Librería para cargar y registrar automáticamente todas las rutas.
 * Busca archivos `*.route.ts` en la carpeta de rutas y los registra automáticamente.
 */
export class RouteLoader {
  /**
   * Carga y registra automáticamente todas las rutas desde la carpeta especificada.
   * Busca archivos que terminen en `.route.ts` y llama a su método `register`.
   * 
   * NOTA: En TypeScript, las importaciones dinámicas requieren rutas relativas.
   * Este método busca los archivos y los registra usando importaciones estáticas.
   */
  public static async loadRoutes(
    server: Express,
    routesPath: string = path.join(__dirname, "../routes"),
    services?: Record<string, any>
  ): Promise<void> {
    const routeFiles = this.findRouteFiles(routesPath);

    // Importar y registrar cada ruta
    for (const routeFile of routeFiles) {
      try {
        // Convertir ruta absoluta a relativa desde src/
        // __dirname está en lib/, así que subimos un nivel para llegar a src/
        const srcPath = path.join(__dirname, "..");
        const relativePath = path.relative(srcPath, routeFile);
        // Convertir a formato de import (sin extensión .ts, usar / como separador)
        // La ruta debe ser relativa desde src/ (donde se ejecuta index.ts)
        const importPath = "./" + relativePath.replace(/\\/g, "/").replace(/\.ts$/, "");

        // Importación dinámica usando file:// URL para rutas absolutas
        const fileUrl = `file://${routeFile.replace(/\.ts$/, "")}`;
        const routeModule = await import(fileUrl);
        const RouteClass = this.getRouteClass(routeModule);

        if (RouteClass && typeof RouteClass.register === "function") {
          // Obtener los argumentos del servicio si están disponibles
          const args = this.getServiceArgs(RouteClass, services);
          RouteClass.register(server, ...args);
          console.log(`✓ Route registered: ${path.basename(routeFile)}`);
        }
      } catch (error) {
        console.error(`Error loading route ${routeFile}:`, error);
      }
    }
  }

  /**
   * Encuentra todos los archivos `.route.ts` en la carpeta de rutas y subcarpetas.
   */
  private static findRouteFiles(dir: string, fileList: string[] = []): string[] {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        this.findRouteFiles(filePath, fileList);
      } else if (file.endsWith(".route.ts") || file.endsWith(".route.js")) {
        fileList.push(filePath);
      }
    });

    return fileList;
  }

  /**
   * Obtiene la clase de ruta desde el módulo importado.
   */
  private static getRouteClass(routeModule: any): RouteRegister | null {
    // Buscar la clase exportada (puede ser default o named export)
    if (routeModule.default && typeof routeModule.default.register === "function") {
      return routeModule.default;
    }

    // Buscar cualquier export que tenga el método register
    for (const key in routeModule) {
      const exported = routeModule[key];
      if (
        exported &&
        typeof exported === "function" &&
        typeof exported.register === "function"
      ) {
        return exported;
      }
    }

    return null;
  }

  /**
   * Obtiene los argumentos del servicio basándose en el nombre de la clase.
   * Por ejemplo, AuthRoute necesita authService y resetPasswordService.
   */
  private static getServiceArgs(
    RouteClass: any,
    services?: Record<string, any>
  ): any[] {
    if (!services) return [];

    const className = RouteClass.name || "";
    
    // Mapeo de nombres de clases a servicios
    // AuthRoute -> authService y resetPasswordService
    if (className.includes("Auth") && className.includes("Route")) {
      const args: any[] = [];
      if (services.authService) {
        args.push(services.authService);
      }
      if (services.resetPasswordService) {
        args.push(services.resetPasswordService);
      }
      return args;
    }

    // Agregar más mapeos según sea necesario
    return [];
  }
}

