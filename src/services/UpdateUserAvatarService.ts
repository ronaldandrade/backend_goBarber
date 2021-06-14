import { getRepository } from "typeorm";
import path from 'path';
import fs from 'fs';

import AppError from '../errors/AppError';

import uploadConfig from '../config/upload';
import User from "../models/User";


interface IUpdateUserAvatarService {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarSevice {
  public async execute({ user_id, avatarFilename }: IUpdateUserAvatarService): Promise<User>{
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if(!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if(user.avatar) {
      // Deletar avatar anterior

      // procurar o caminho da foto
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      // verifica se essa foto existe
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);
      //se existir, deleta.
      if(userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;
// metodo save do getRepository do typeorm(salva se o usuario nao exister ou salva a alteracao se ja existir )
    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarSevice;
