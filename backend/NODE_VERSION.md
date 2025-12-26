# Requisitos de Versión de Node.js

Este proyecto requiere **Node.js 20.x LTS** para funcionar correctamente.

## Problema conocido

Next.js 15 tiene problemas de compatibilidad con Node.js 23, especialmente en WSL2, que pueden causar "Bus error (core dumped)".

## Solución: Usar Node.js 20 LTS

### Con nvm (Node Version Manager)

1. **Instalar nvm** (si no lo tienes):

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
   source ~/.bashrc
   ```

2. **Instalar Node.js 20**:

   ```bash
   nvm install 20
   nvm use 20
   ```

3. **Verificar la versión**:

   ```bash
   node -v  # Debería mostrar v20.x.x
   ```

4. **Configurar como versión por defecto** (opcional):
   ```bash
   nvm alias default 20
   ```

### El archivo .nvmrc

El proyecto incluye un archivo `.nvmrc` que especifica Node.js 20. Si tienes nvm instalado, puedes simplemente ejecutar:

```bash
nvm use
```

Esto cambiará automáticamente a la versión correcta de Node.js.

## Verificación

Después de cambiar a Node.js 20, ejecuta:

```bash
yarn dev:web
```

El servidor debería iniciar sin el error "Bus error (core dumped)".
