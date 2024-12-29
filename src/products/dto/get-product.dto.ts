import { IsNumberString, IsOptional } from "class-validator";


export class GetProductsQueryDto {
  @IsOptional()
  @IsNumberString({}, { message: 'Invalid category_id' })
  category_id?: number;
  
  @IsOptional()
  @IsNumberString({}, { message: 'Invalid take' })
  take?: number;
  
  @IsOptional()
  @IsNumberString({}, { message: 'Invalid skip' })
  skip?: number;
}