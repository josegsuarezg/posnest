import { Product } from "src/products/entities/product.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Transaction {
  
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column('decimal')
  total: number;
  
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  transactionDate: Date;
  
  @OneToMany(() => TransactionContents, transaction => transaction.transactionId)
  contents: TransactionContents[];
  
}

@Entity()
export class TransactionContents {
  
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column('int')
  quantity: number;
  
  @Column('decimal')
  price: number;
  
  @ManyToOne(() => Product, (product) => product.id, { eager: true, cascade: true })
  productId: Product;
  
  @ManyToOne(() => Transaction, (transaction) => transaction.contents, { cascade: true })
  transactionId: Transaction;
  
}