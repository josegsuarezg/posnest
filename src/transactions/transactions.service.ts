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

  async findAll(transactionDate?: string) {
    
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
    return await this.transactionRepository.find(options);
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where:  {id},
      relations: {contents: true}
    });
      
    if (!transaction) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
    return transaction;
  }

  async remove(id: number) {
    const transaction = await this.findOne(id);
    
    for(const contents of transaction.contents) {
      //Increase stock for each product in the transaction
      const product = await this.productRepository.findOneBy({id: contents.productId.id})
      product.stock += contents.quantity;
      await this.productRepository.save(product);
      
      //Remove transaction contents
      const transactionContents = await this.transactionContentsRepository.findOneBy({id: contents.id});
      await this.transactionContentsRepository.remove(transactionContents);
    }
    
    await this.transactionRepository.remove(transaction);
    return {message: `Transaction with id ${id} removed successfully`};
  }
}
