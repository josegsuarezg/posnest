import { Type } from "class-transformer";
import {  ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, Length, ValidateNested } from "class-validator";

export class TransactionContentsDto {
  @IsNotEmpty({ message: 'Id is Not Empty' })
  @IsInt({ message: 'ID is not valid' })
  productId: number;

  @IsNotEmpty({ message: 'Quantity is Not Empty' })
  @IsInt({ message: 'Quantity is not valid' }) // Validate quantity too
  quantity: number;

  @IsNotEmpty({ message: 'Price is Not Empty' })
  @IsNumber({}, { message: 'Price is not valid' })
  price: number;
}

export class CreateTransactionDto {
  @IsNotEmpty({message: 'Total is Not Empty'})
  @IsNumber({}, {message: 'Total is not valid'})
  total: number

  @IsArray()
  @ArrayNotEmpty({message: 'Contents is Not Empty'})
  @ValidateNested()
  @Type(() => TransactionContentsDto)
  contents: TransactionContentsDto[]
}
