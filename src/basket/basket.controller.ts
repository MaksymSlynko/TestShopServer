import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from "@nestjs/common";
import { BasketService } from "./basket.service";
import {
  CreateBasketDto,
  UpdateBasketDto,
  DeleteBasketDto,
} from "./basket.dto";

@Controller("/api/basket")
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Get(":id")
  findOne(@Param("id") id: number) {
    return this.basketService.findOne(id);
  }

  @Post()
  create(@Body() CreateBasketDto: CreateBasketDto) {
    return this.basketService.addProductToBasket(CreateBasketDto);
  }

  @Put()
  update(@Body() UpdateBasketDto: UpdateBasketDto) {
    return this.basketService.updateProductInBasket(UpdateBasketDto);
  }

  @Delete()
  remove(@Body() DeleteBasketDto: DeleteBasketDto) {
    return this.basketService.deleteProductFromBasket(DeleteBasketDto);
  }
}
