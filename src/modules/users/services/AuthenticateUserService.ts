import { compare } from "bcryptjs";
import { getRepository } from "typeorm";
import { sign } from 'jsonwebtoken';

import auth from '@config/auth';
import AppError from '@shared/errors/AppError';
import User from "../infra/typeorm/entities/User";

interface IAuthenticateUserService{ // Aqui o usuario faz a requisicao de email e senha.
  email: string;
  password: string;
};

interface IUser{ // Aqui o usuario obtem a resposta ( user ) apos digitar corretamente seu usuario e senha.
  user: User;
  token: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: IAuthenticateUserService): Promise<IUser> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if(!user) {
      throw new AppError('Incorrect email/password combination.',401);
    }

    const passwordMatched = await compare(password, user.password);

    if(!passwordMatched) {
      throw new AppError('Incorrect email/password combination.', 401);
    };

    const { secret, expiresIn } = auth.jwt;

    const token = sign({},secret,{
      subject: user.id,
      expiresIn: expiresIn,
      });

    return{
      user,
      token,
    };
  };
}

export default AuthenticateUserService;
