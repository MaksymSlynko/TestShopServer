import { IsNotEmpty, IsString } from "class-validator";

export class CreateOrderDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  @IsString()
  address: string;
}
