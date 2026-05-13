import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export const createDataSourceOptions = (
  configService: ConfigService,
): DataSourceOptions => ({
  type: 'postgres',
  url: configService.get<string>('DB_URI'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});

export const createTypeOrmOptions = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  ...createDataSourceOptions(configService),
  autoLoadEntities: true,
});

export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: createTypeOrmOptions,
};
