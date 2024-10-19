<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Configuracion de Variables de entorno
1.  Renombre el archivo .env.templete a .env
e ingrese sus variables
## PostgreSQL
```bash
# Modifique su variable de entorno como primer paso
docker-compose.yml up
```
## Conection for database 
```bash
yarn add @nestjs/typeorm typeorm 
# driver para pgsql
yarn add pg --save
```

## Configuracion de conexion con nuestras entidades
```bash
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text', {
    unique: true,
  })
  title: string;
}
# para sicronizar cambios de nuestra entidad con db en postgress
# en el modulo de la Produc
  imports: [TypeOrmModule.forFeature([Product])],
```
## Carga de Archivos
```bash
# Instalar paquete para el tipado
yarn add -D @types/multer
```
## .GITKEEP
Permite capturar carpetas vacias en los commits, carpeta/.gitkeep
## Incriptacion de Contraseñas
```bash
# instalar bcrypt 
yarn add bcrypt
# typados
yarn add -D @types/bcrypt
```
## Autenticacion
```bash
yarn add @nestjs/passport passport
# para trabajar con jwt 
yarn add @nestjs/jwt passport-jwt
# par el tipado
yarn add -D @types/passport-jwt
```
## Guards
Usados para permitir o prevenir acceso a una ruta.
Ej: Aquí es donde se debe de autorizar una solicitud.

## Pipes
un Pipe es una clase que se utiliza para transformar o validar datos de entrada antes de que lleguen al controlador.

# Documentacion open API
```bash
npm install --save @nestjs/swagger
```
