import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/typeorm.comfig';
import { SeederService } from './seeder.service';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      TypeOrmModule.forRootAsync({
        useFactory: typeOrmConfig,
        inject: [ConfigService],
      }),
      TypeOrmModule.forFeature([Category, Product]),
    ],
  providers: [SeederService],
})
export class SeederModule {}
