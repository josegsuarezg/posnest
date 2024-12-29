import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionContents, Transaction } from './entities/transaction.entity';
import { Product } from 'src/products/entities/product.entity';
import { endOfDay, isValid, startOfDay } from 'date-fns';
import { parseISO } from 'date-fns/fp';

@Injectable()
export class TransactionsService {
  
  constructor(
    @InjectRepository(Transaction) private readonly  transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContents) private readonly  transactionContentsRepository: Repository<TransactionContents>,
    @InjectRepository(Product) private readonly  productRepository: Repository<Product>
  ) {}
  async create(createTransactionDto: CreateTransactionDto) {
    
    await this.productRepository.manager.transaction(async (transactionEntityManager) => {
      
      const transaction = new Transaction();
      transaction.total= createTransactionDto.contents.reduce((total, item) => total + (item.price * item.quantity), 0);
    
      for (const contents of createTransactionDto.contents) {
        
        const product = await transactionEntityManager.findOneBy(Product,{id: contents.productId});
        
        const errors = [];
        
        //Check if product exists
        if(!product) {
          errors.push(`Product with id ${contents.productId} not found`);
          throw new NotFoundException(errors);
        }
        
        //Check if there is enough stock
        if(contents.quantity > product.stock) {
          errors.push(`Not enough stock for product ${product.name}`);
          throw new BadRequestException(errors);
        }
        product.stock -= contents.quantity;
        
        //Create TransactionContents Instance
        const transactionContent = new TransactionContents();
        transactionContent.price = contents.price;
        transactionContent.productId = product;
        transactionContent.quantity = contents.quantity;
        transactionContent.transactionId = transaction;
        
        //Save Transaction and TransactionContents in the DB
        await transactionEntityManager.save(transaction);
        await transactionEntityManager.save(transactionContent);
      }
    })
    return 'Sale completed successfully';
  }

  findAll(transactionDate?: string) {
    
    const options : FindManyOptions<Transaction> = {
      relations: ['contents', 'contents.productId']
    }
    if(transactionDate) {
      const date = parseISO(transactionDate);
      if (!isValid(date)){
        throw new BadRequestException('Invalid date format');
      }
      
      const start = startOfDay(date);
      const end = endOfDay(date);
      
      options.where = {
        transactionDate: Between(start, end)
      }
    }
    return this.transactionRepository.find(options);
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
