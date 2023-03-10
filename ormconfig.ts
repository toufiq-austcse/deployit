import { DataSource } from 'typeorm';
import * as process from 'process';

console.log(' process.env.ENV_PATH ', process.env.ENV_PATH);
require('dotenv').config({
  path: process.env.ENV_PATH
});
console.log('driver ', process.env.DB_DRIVER);

const dataSource = new DataSource({
  type: process.env.DB_DRIVER as any,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrationsRun: process.env.RUN_MIGRATION === 'true',
  logging: process.env.DB_LOG_ENABLED === 'true',
  migrations: ['dist/migrations/*.js'],
  timezone: 'z'
});
export default dataSource;
