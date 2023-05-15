import { Controller, Get, Post, Body, Param, Delete } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./orders.dto";

@Controller("/api/orders")
export class OrdersController {
  constructor(private readonly OrdersService: OrdersService) {}

  @Get(":userId")
  findAll(@Param("userId") userId: number) {
    return this.OrdersService.findAllOrders(userId);
  }

  @Post()
  create(@Body() CreateOrderDto: CreateOrderDto) {
    return this.OrdersService.createOrder(CreateOrderDto);
  }

  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.OrdersService.deleteOrder(id);
  }
}
