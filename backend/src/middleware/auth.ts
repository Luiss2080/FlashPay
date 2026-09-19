import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/auth";

export interface AuthRequest extends Request {
  userId: number;
}

/** Exige `Authorization: Bearer <jwt>` valido y deja el id en req.userId. */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const match = /^Bearer\s+(.+)$/i.exec(header);
  const userId = match ? verifyToken(match[1]) : null;
  if (userId === null) {
    res.status(401).json({ status: "error", message: "No autenticado" });
    return;
  }
  (req as AuthRequest).userId = userId;
  next();
}

export const uid = (req: Request): number => (req as AuthRequest).userId;
