import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

//criar uma pasta tmp no root do projeto
const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

//  Os arquivos (foto) upadas para aplicacao irao para pasta 'tmp' representada no caminho (destination)
export default {
  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),

  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback){
      const fileHash = crypto.randomBytes(10).toString('hex');
      const fileName = `${fileHash}-${file.originalname}`; // nome criado randomico pela aplicacao + o nome original enviado pelo user

      return callback(null, fileName);
    },
  }),
};
