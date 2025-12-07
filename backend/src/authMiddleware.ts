import { Request, Response, NextFunction } from "express";
import { TokenService } from "./tokenService";

export interface AuthRequest extends Request {
  user?: { id: number; email: string; role: string };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const auth = req.headers.authorization;
    const token = auth?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = TokenService.verifyAccessToken(token);

    // Validación de seguridad
    if (!decoded || typeof decoded === "string") {
      return res.status(401).json({ error: "Token inválido" });
    }

    // Asumiendo que tu payload tiene id, email y role
    req.user = {
      id: Number(decoded.id),
      email: String(decoded.email),
      role: String(decoded.role),
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
};
