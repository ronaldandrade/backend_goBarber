import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';
import auth from '@config/auth';

interface IToken{
  iat: number;
  exp: number;
  sub: string;
};

export default function ensureAuthenticated(
  request: Request ,
  response: Response,
  next: NextFunction
):void {
  // o Token vai pelo cabecalho(Header) da aplicacao
  const authHeader = request.headers.authorization;

  if(!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try{
    const decoded = verify(token, auth.jwt.secret);

    const { sub } = decoded as IToken;

    request.user= {
      id: sub,
    }

    return next();
  }catch(err) {
    throw new AppError('Invalid JWT token', 401);
  }
}
