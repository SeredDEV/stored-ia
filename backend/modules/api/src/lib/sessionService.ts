import type { Request } from "express";
import { getRedisClient } from "./redisClient";
// @ts-ignore - uuid types will be available after npm install
import { v4 as uuidv4 } from "uuid";

export interface SessionData {
  sessionId: string;
  userId: string;
  email: string;
  role?: string;
  accessToken: string;
  refreshToken: string;
  createdAt: number;
  expiresAt: number;
}

export interface UserData {
  id: string;
  email: string;
  role?: string;
  email_confirmed_at?: string;
  last_sign_in_at?: string;
}

export interface FormattedSessionData {
  sessionId: string;
  userData: {
    user: UserData;
  };
}

/**
 * Servicio de sesiones usando Redis.
 * Similar al patrón del ejemplo: maneja sesiones y datos de usuario.
 */
export class SessionService {
  private readonly redisClient = getRedisClient();
  private readonly SESSION_PREFIX = "session:";
  private readonly USER_PREFIX = "user:";
  private readonly SESSION_TTL = 7 * 24 * 60 * 60; // 7 días en segundos

  /**
   * Formatea los datos de sesión a partir del resultado del login.
   */
  formatSessionData(
    entryApplicationId: number | undefined,
    loginResult: {
      access_token: string;
      refresh_token: string;
      user: any;
    }
  ): FormattedSessionData {
    const sessionId = uuidv4();
    const now = Date.now();
    const expiresAt = now + this.SESSION_TTL * 1000;

    const userData: UserData = {
      id: loginResult.user.id,
      email: loginResult.user.email || "",
      role: loginResult.user.app_metadata?.role || loginResult.user.user_metadata?.role,
      email_confirmed_at: loginResult.user.email_confirmed_at,
      last_sign_in_at: loginResult.user.last_sign_in_at,
    };

    return {
      sessionId,
      userData: {
        user: userData,
      },
    };
  }

  /**
   * Guarda los datos de sesión en Redis.
   */
  async setSessionData(
    req: Request,
    sessionDataPartial: FormattedSessionData
  ): Promise<void> {
    const { sessionId, userData } = sessionDataPartial;

    // Guardar sesión en Redis
    const sessionData: SessionData = {
      sessionId,
      userId: userData.user.id,
      email: userData.user.email,
      role: userData.user.role,
      accessToken: (req as any).body?.access_token || "",
      refreshToken: (req as any).body?.refresh_token || "",
      createdAt: Date.now(),
      expiresAt: Date.now() + this.SESSION_TTL * 1000,
    };

    await this.redisClient.setEx(
      `${this.SESSION_PREFIX}${sessionId}`,
      this.SESSION_TTL,
      JSON.stringify(sessionData)
    );

    // Guardar datos de usuario en Redis
    await this.redisClient.setEx(
      `${this.USER_PREFIX}${userData.user.id}`,
      this.SESSION_TTL,
      JSON.stringify(userData.user)
    );

    // Guardar sessionId en el request para uso posterior
    (req as any).sessionId = sessionId;
    (req as any).user = userData.user;
  }

  /**
   * Obtiene los datos de sesión desde Redis.
   */
  async getSessionData(sessionId: string): Promise<SessionData | null> {
    const data = await this.redisClient.get(`${this.SESSION_PREFIX}${sessionId}`);
    if (!data) return null;
    return JSON.parse(data) as SessionData;
  }

  /**
   * Elimina una sesión de Redis.
   */
  async deleteSession(sessionId: string): Promise<void> {
    await this.redisClient.del(`${this.SESSION_PREFIX}${sessionId}`);
  }

  /**
   * Obtiene los datos de usuario desde Redis.
   */
  async getUserData(userId: string): Promise<UserData | null> {
    const data = await this.redisClient.get(`${this.USER_PREFIX}${userId}`);
    if (!data) return null;
    return JSON.parse(data) as UserData;
  }
}

