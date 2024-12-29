import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"


export class CreateProductDto {
  
  @IsNotEmpty({message: 'This field cannot be empty'})
  @IsString({message: 'This field must be a string'})
  name: string
  
  @IsOptional()
  @IsString()
  image: string
  
  @IsNotEmpty({message: 'This field cannot be empty'})
  @IsNumber({maxDecimalPlaces: 2}, {message: 'This field must be a number'})
  price: number
  
  @IsNotEmpty({message: 'This field cannot be empty'})
  @IsNumber({maxDecimalPlaces: 0}, {message: 'This field must be a number'})
  stock: number
  
  @IsNotEmpty({message: 'This field cannot be empty'})
  @IsInt({message: 'This field must be an integer'})
  categoryId: number
}
