import { getRepository } from "typeorm";
import { hash } from 'bcryptjs';

import AppError from '@shared/errors/AppError';

import User from "../infra/typeorm/entities/User";

interface ICreateUserService {
  name: string,
  email: string,
  password: string,
}

class CreateUserService {

  public async execute({ name, email, password }: ICreateUserService): Promise<User> {
    const userRepository = getRepository(User);

    const checkUserExists = await userRepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new AppError('Email address already used!');
    }

    const hashedPassword = await hash(password, 6);

    const user = userRepository.create({
      name,
      email,
      password: hashedPassword,
    });
    await userRepository.save(user);

    return user;
  }

}

export default CreateUserService;
