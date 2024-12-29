import { Product } from "src/products/entities/product.entity";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity()
export class Category {
  
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ type: 'varchar', length: 100 })
  name: string;
  
  @OneToMany(() => Product, product => product.category, { cascade: true })
  products: Product[];
}
