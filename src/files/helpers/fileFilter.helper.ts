//para aceptar o no un archivo
export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback,
) => {
  console.log({ file });
  if (!file) return callback(new Error('File is empty'), false);
  // "mimetype": "image/png",
  const fileExptension = file.mimetype.split('/')[1];
  const validExptension = ['jpg', 'jpeg', 'png'];
  if (validExptension.includes(fileExptension)) {
    return callback(null, true);
  }
  // el callback, (error, true|false)
  // si es false no lo deja pasar el archivo
  // lo pasa el file como vacio
  callback(null, true);
};
