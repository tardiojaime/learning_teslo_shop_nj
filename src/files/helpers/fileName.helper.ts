//para cambiar nombre
import { v4 as uuid } from 'uuid';
export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback,
) => {
  // en este caso ya tnemos el archivo
  if (!file) return callback(new Error('File is empty'), false);
  // "mimetype": "image/png",
  const fileExptension = file.mimetype.split('/')[1];
  const fileName = `${uuid()}.${fileExptension}`;
  // el callback, (error, true|false)
  // si es false no lo deja pasar el archivo
  // lo pasa el file como vacio
  callback(null, fileName);
};
