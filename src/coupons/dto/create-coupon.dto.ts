import { IsDateString, IsInt, IsNotEmpty, Max, Min } from "class-validator";


export class CreateCouponDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Percentage is required' })
  @IsInt({ message: 'Percentage must be betwin 1 and 100' })
  @Max(100, { message: 'Percentage must be max value to 100' })
  @Min(1, { message: 'Percentage must be min value to 1' })
  percentage: number;
  
  @IsNotEmpty({ message: 'Expiration date is required' })
  @IsDateString({}, { message: 'Expiration date must be a valid date' })
  expirationDate: Date;
}
