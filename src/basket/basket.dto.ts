import { IsNotEmpty, IsObject, IsString } from "class-validator";
import { IBasketProduct } from "./basket.inerface";
import { PartialType } from "@nestjs/mapped-types";

export class CreateBasketDto {
  @IsNotEmpty()
  @IsObject()
  product: IBasketProduct;

  @IsNotEmpty()
  @IsString()
  userId: string;
}

export class UpdateBasketDto {
  @IsNotEmpty()
  basketId: number;

  @IsNotEmpty()
  count: number;

  @IsNotEmpty()
  productId: number;
}

export class DeleteBasketDto extends PartialType(UpdateBasketDto) {}
