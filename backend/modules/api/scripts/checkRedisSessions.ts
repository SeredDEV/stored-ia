import { getRedisClient } from '../src/lib/redisClient';

async function checkSessions() {
  const redisClient = getRedisClient();
  
  try {
    // Buscar todas las claves de sesión
    const sessionKeys = await redisClient.keys('session:*');
    
    console.log(`\n📊 Total de sesiones encontradas: ${sessionKeys.length}\n`);
    
    if (sessionKeys.length === 0) {
      console.log('❌ No hay sesiones en Redis');
      return;
    }
    
    // Obtener y mostrar cada sesión
    for (const key of sessionKeys) {
      const sessionData = await redisClient.get(key);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        console.log(`\n🔑 Sesión: ${key.replace('session:', '')}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`User ID: ${session.userId}`);
        console.log(`Email: ${session.email}`);
        console.log(`Role: ${session.role || 'N/A'}`);
        console.log(`Access Token: ${session.accessToken ? session.accessToken.substring(0, 50) + '...' : '❌ VACÍO'}`);
        console.log(`Refresh Token: ${session.refreshToken ? session.refreshToken.substring(0, 50) + '...' : '❌ VACÍO'}`);
        console.log(`Created At: ${new Date(session.createdAt).toISOString()}`);
        console.log(`Expires At: ${new Date(session.expiresAt).toISOString()}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      }
    }
    
    // Buscar también datos de usuario
    const userKeys = await redisClient.keys('user:*');
    console.log(`\n👤 Total de usuarios en cache: ${userKeys.length}\n`);
    
  } catch (error) {
    console.error('❌ Error al verificar sesiones:', error);
  } finally {
    await redisClient.quit();
    process.exit(0);
  }
}

checkSessions();

