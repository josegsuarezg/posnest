import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction, TransactionContents } from './entities/transaction.entity';
import { Product } from '../products/entities/product.entity';
import { CategoriesModule } from '../categories/categories.module';
import { ProductsModule } from '../products/products.module';
import { CouponsModule } from '../coupons/coupons.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, TransactionContents, Product]),
    CategoriesModule, ProductsModule, TransactionsModule, CouponsModule
    
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService, TypeOrmModule]
})
export class TransactionsModule {}
