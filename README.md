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