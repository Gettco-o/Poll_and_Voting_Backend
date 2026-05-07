import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { createDataSourceOptions } from './typeorm.config';

export const dataSourceOptions = createDataSourceOptions(new ConfigService());

export default new DataSource(dataSourceOptions);
