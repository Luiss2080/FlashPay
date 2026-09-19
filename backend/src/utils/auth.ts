import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { timingSafeEqual } from "crypto";

const DEV_SECRET = "flashpay-dev-only-secret-do-not-use-in-production";
const TOKEN_TTL = "12h";
const BCRYPT_ROUNDS = 10;

/** JWT_SECRET es obligatorio en produccion; en desarrollo/tests se usa un valor de prueba explicito. */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET es obligatorio en produccion");
  }
  return DEV_SECRET;
}

/** Falla al arrancar si la configuracion de autenticacion es invalida. */
export function assertAuthConfig(): void {
  getJwtSecret();
}

export function signToken(userId: number): string {
  return jwt.sign({ sub: String(userId) }, getJwtSecret(), {
    algorithm: "HS256",
    expiresIn: TOKEN_TTL,
  });
}

/** Devuelve el id de usuario si el token es valido (firma + expiracion); si no, null. */
export function verifyToken(token: string): number | null {
  try {
    const payload = jwt.verify(token, getJwtSecret(), {
      algorithms: ["HS256"],
    });
    if (typeof payload === "string" || !payload.sub) return null;
    const id = Number(payload.sub);
    return Number.isInteger(id) && id > 0 ? id : null;
  } catch {
    return null;
  }
}

export const isBcryptHash = (value: string): boolean =>
  /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(value);

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export interface PasswordCheck {
  ok: boolean;
  /** true si la clave guardada estaba en texto plano y hay que re-guardarla con hash. */
  needsUpgrade: boolean;
}

/**
 * Verifica una contrasena contra lo guardado. Si lo guardado no tiene formato bcrypt
 * (cuentas antiguas), se compara en texto plano UNA vez y se pide re-guardar con hash.
 */
export async function verifyPassword(
  plain: string,
  stored: string,
): Promise<PasswordCheck> {
  if (isBcryptHash(stored)) {
    return { ok: await bcrypt.compare(plain, stored), needsUpgrade: false };
  }
  const a = Buffer.from(plain);
  const b = Buffer.from(stored);
  const ok = a.length === b.length && timingSafeEqual(a, b);
  return { ok, needsUpgrade: ok };
}
