import { getRepository } from "typeorm";
import { hash } from 'bcryptjs';

import AppError from '../errors/AppError';

import User from "../models/User";

interface ICreateUserService {
  name: string,
  email: string,
  password: string,
}

class CreateUserService {

  public async excute({ name, email, password }: ICreateUserService): Promise<User> {
    const userRepository = getRepository(User);

    const checkUserExists = await userRepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new AppError('Email address already used!');
    }

    const hashedPassword = await hash(password, 8);

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
