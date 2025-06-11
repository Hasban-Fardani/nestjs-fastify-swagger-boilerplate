import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  APP_TITLE: Joi.string().default('NestJS App'),
  APP_DESCRIPTION: Joi.string().default('NestJS App'),
  APP_PORT: Joi.number().default(3000),
  APP_VERSION: Joi.string().default('1'),
  NODE_ENV: Joi.string().valid('development', 'staging', 'testing', 'production').default('development'),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_SYNCHRONIZE: Joi.boolean().truthy('true').falsy('false').default(false),

  TYPEORM_SEEDING_FACTORIES: Joi.string().required(),
  TYPEORM_SEEDING_SEEDS: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION_TIME: Joi.string().required(), // can be like: '1d', '3600s', etc

  MEDIASOUP_LISTEN_IP: Joi.string().ip().required(),
  MEDIASOUP_MIN_PORT: Joi.number().integer().min(1024).max(65535).required(),
  MEDIASOUP_MAX_PORT: Joi.number().integer().min(1024).max(65535).required(),
  MEDIASOUP_INITIAL_AVAILABLE_OUTGOING_BITRATE: Joi.number().integer().min(100000).required(),
  MEDIASOUP_ANNOUNCED_IP: Joi.string().ip().optional(),

  RECORDING_TEMP_DIR: Joi.string().required(),
  FFMPEG_PATH: Joi.string().optional(),

  S3_ENDPOINT: Joi.string().required(),
  S3_REGION: Joi.string().required(),
  S3_ACCESS_KEY: Joi.string().required(),
  S3_SECRET_KEY: Joi.string().required(),
  S3_BUCKET: Joi.string().required(),
  S3_PUBLIC_URL: Joi.string().uri().required(),
  S3_USE_SSL: Joi.boolean().truthy('true').falsy('false').default(true),

  GLOBAL_THROTTLE_TTL: Joi.number().default(6000).required(),
  GLOBAL_THROTTLE_LIMIT: Joi.number().min(1).required(),

  AUTH_THROTTLE_TTL: Joi.number().default(6000).required(),
  AUTH_THROTTLE_LIMIT: Joi.number().min(1).required(),

  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_TTL: Joi.number().default(60),
});
