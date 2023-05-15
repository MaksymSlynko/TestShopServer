import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { InjectModel } from "nest-knexjs";
import { getBasketProductRelation, getProducts4CancelOrder } from "./queries";
import { CreateOrderDto } from "./orders.dto";
import { IOrder, IProducts } from "./orders.interface";
import { IBasket } from "src/basket/basket.inerface";
import { IProduct } from "src/products/products.interface";

@Injectable()
export class OrdersService {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async findAllOrders(userId: number) {
    const orders: IOrder[] = await this.knex
      .table("orders")
      .where("userId", userId);

    return { orders };
  }

  async createOrder(CreateOrderDto: CreateOrderDto) {
    try {
      const basket: IBasket = await this.knex
        .table("basket")
        .where("userId", CreateOrderDto.userId)
        .first();
      if (!basket) {
        return { message: "Basket is empty" };
      }
      const basketWithProducts: IProducts[] = await this.knex
        .raw(getBasketProductRelation, { basketId: basket.id })
        .then((d) => (d && d[0]) || []);
      const priceForOrder = basketWithProducts.reduce(
        (acc, product) => acc + product.count * product.price,
        0
      );
      const order = {
        userId: CreateOrderDto.userId,
        orderDetails: JSON.stringify(basketWithProducts),
        totalPrice: priceForOrder,
        deliveryAddress: CreateOrderDto.address,
      };
      await this.knex.table("orders").insert(order);

      await this.knex.table("basket").where("id", basket.id).del();

      return { message: "Order created", order };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteOrder(orderId: number) {
    try {
      const order: IOrder = await this.knex
        .table("orders")
        .where("id", orderId)
        .first();
      await this.knex.table("orders").where("id", orderId).del();

      const products4Delete: IProducts[] = JSON.parse(order.orderDetails);
      const productsIds = products4Delete.map((el) => el.productId);
      const productInDb: IProduct[] = await this.knex
        .raw(getProducts4CancelOrder(productsIds))
        .then((d) => (d && d[0]) || []);
      productInDb.forEach((product) => {
        product.productsInStock =
          products4Delete.find((el) => el.productId === product.id).count +
          product.productsInStock;
      });
      // Create query
      for (const product of productInDb) {
        await this.knex.table("products").where("id", product.id).update({
          productsInStock: product.productsInStock,
        });
      }

      return { message: "Order removed" };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
