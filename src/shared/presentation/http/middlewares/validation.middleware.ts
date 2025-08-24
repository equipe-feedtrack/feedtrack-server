import { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import jwt from 'jsonwebtoken';

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

const JWT_SECRET = process.env.JWT_SECRET as string;

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato esperado: Bearer TOKEN_JWT

  // Se o token não existir, retorna 401 (Unauthorized)
  if (!token) {
    return res.sendStatus(401);
  }

  // Verifica o token
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.sendStatus(403); // Token inválido ou expirado
    }

    // Salva o payload do usuário no objeto da requisição
    (req as any).user = payload;
    next(); // Continua para a próxima função (a rota)
  });
}
