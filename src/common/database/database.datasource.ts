import { DataSource } from 'typeorm';
import { join } from 'node:path';
import * as dotenv from 'dotenv';
import { getOrTrhow } from '../utils/config.utils';

dotenv.config();

export const connectionSource = new DataSource({
    type: 'postgres',
    host: getOrTrhow("DB_HOST"),
    port: Number.parseInt(getOrTrhow("DB_PORT"), 10),
    username: getOrTrhow("DB_USERNAME"),
    password: getOrTrhow("DB_PASSWORD"),
    database: getOrTrhow("DB_DATABASE"),
    synchronize: false,
    logging: true,
    entities: [
        join(__dirname, '/../../**/*.entity.{ts,js}')
    ],
    migrations: [
        join(__dirname, '/../../', 'common/database/migrations/**/*{.ts,.js}')
    ],
    migrationsTableName: 'typeorm_migrations',
    migrationsRun: false,
});
