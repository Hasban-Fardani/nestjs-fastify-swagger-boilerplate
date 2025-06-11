import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { join } from 'node:path';
import { getOrTrhow } from '../utils/config.utils';

dotenv.config();

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: getOrTrhow("DB_HOST"),
    port: Number.parseInt(getOrTrhow("DB_PORT"), 10),
    username: getOrTrhow("DB_USERNAME"),
    password: getOrTrhow("DB_PASSWORD"),
    database: getOrTrhow("DB_DATABASE"),
    synchronize: false,
    entities: [
        join(__dirname, '/../../**/*.entity.{ts,js}')
    ],
};