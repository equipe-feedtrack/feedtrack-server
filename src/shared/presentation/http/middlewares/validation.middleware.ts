import { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import jwt from "jsonwebtoken";

export function validationMiddleware<T>(type: any): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToClass(type, req.body);
    validate(dto).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors
  .filter((error: ValidationError) => error.constraints)
  .map((error: ValidationError) => Object.values(error.constraints!))
  .join(', ');
        res.status(400).json({ message });
      } else {
        req.body = dto;
        next();
      }
    });
  };
}


export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Token não informado" });
  }

  // Geralmente vem como "Bearer <token>"
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token inválido" });
  }

  try {
    const secret = process.env.JWT_SECRET || "seu_segredo_aqui";

    const decoded = jwt.verify(token, secret);

    // Se quiser, pode salvar o payload decodificado no req para usar depois
    (req as any).user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}


