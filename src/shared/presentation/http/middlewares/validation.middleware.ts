import { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

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
