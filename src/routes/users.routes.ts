import { Router } from 'express'
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreateUserService from "../services/CreateUserService";

import ensureAuthenticate from '../middlewares/ensureAuthenticated';
import UpdateUserAvatarSevice from '../services/UpdateUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);

// Rotar de login do usuario
usersRouter.post('/', async (request, response)=> {

    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.excute({
      name,
      email,
      password,
    });

    delete user.password;

    return response.json(user);

});

// rota de alteracao do avatar(foto) do usuario
usersRouter.patch('/avatar',ensureAuthenticate, upload.single('avatar'), async( request, response) => {

    const updateUserAvatar = new UpdateUserAvatarSevice();

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete user.password;

    return response.json(user);

})

export default usersRouter;
