import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Knex } from "knex";
import { InjectModel } from "nest-knexjs";
import {
  CreateBasketDto,
  UpdateBasketDto,
  DeleteBasketDto,
} from "./basket.dto";
import { IBasket } from "./basket.inerface";
import {
  deleteBasketProductRelation,
  getBasketProductRelation,
  getBasketWithProducts,
  updateBasketProductRelation,
} from "./queries";

@Injectable()
export class BasketService {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async findOne(userId: number) {
    try {
      // const basket = await this.knex.table('basket').where('userId', userId).first();
      const basket = await this.knex.raw(getBasketWithProducts, {
        userId: userId,
      });
      if (!basket) {
        return { message: "Basket is empty" };
      }
      return {
        userId,
        productsInBasket: basket[0],
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async addProductToBasket(CreateBasketDto: CreateBasketDto) {
    try {
      const user = await this.knex
        .table("users")
        .where("id", CreateBasketDto.userId);

      if (!user) {
        throw new NotFoundException(
          `User ${CreateBasketDto.userId} does not exist`
        );
      }

      const product = await this.knex
        .table("products")
        .where("id", CreateBasketDto.product.id)
        .first();

      if (!product) {
        return { message: "Product does not exist in system" };
      }

      const basket: IBasket = await this.knex
        .table("basket")
        .where("userId", CreateBasketDto.userId)
        .first();

      if (!basket) {
        const basketItem: IBasket = await this.knex.table("basket").insert({
          userId: CreateBasketDto.userId,
        });
        await this.knex.table("basket_product_relations").insert({
          basketId: basketItem[0],
          productId: product.id,
          count: CreateBasketDto.product.count,
        });
        await this.knex
          .table("products")
          .where("id", CreateBasketDto.product.id)
          .update({
            productsInStock:
              product.productsInStock - CreateBasketDto.product.count,
          });

        return { message: "Product added to the basket" };
      }

      await this.knex.table("basket_product_relations").insert({
        basketId: basket.id,
        productId: product.id,
        count: CreateBasketDto.product.count,
      });

      await this.knex
        .table("products")
        .where("id", CreateBasketDto.product.id)
        .update({
          productsInStock:
            product.productsInStock - CreateBasketDto.product.count,
        });

      return { message: "Product added to the basket" };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteProductFromBasket(DeleteBasketDto: DeleteBasketDto) {
    const basket: IBasket = await this.knex
      .table("basket")
      .where("id", DeleteBasketDto.basketId)
      .first();

    if (!basket) {
      return { message: "Basket does not exist" };
    }
    await this.knex.raw(deleteBasketProductRelation, {
      basketId: DeleteBasketDto.basketId,
      productId: DeleteBasketDto.productId,
    });
    const updatedProduct = await this.knex
      .table("products")
      .where("id", DeleteBasketDto.productId)
      .first();
    await this.knex
      .table("products")
      .where("id", DeleteBasketDto.productId)
      .update({
        productsInStock: updatedProduct.productsInStock + DeleteBasketDto.count,
      });

    return { message: "The product removed from the basket" };
  }

  async updateProductInBasket(UpdateBasketDto: UpdateBasketDto) {
    try {
      const basket: IBasket = await this.knex
        .table("basket")
        .where("id", UpdateBasketDto.basketId)
        .first();

      if (!basket) {
        return { message: "Basket does not exist" };
      }

      const updatedProduct = await this.knex
        .table("products")
        .where("id", UpdateBasketDto.productId)
        .first();
      let basketItem = await this.knex
        .raw(getBasketProductRelation, {
          basketId: UpdateBasketDto.basketId,
          productId: UpdateBasketDto.productId,
        })
        .then((d) => (d && d[0]) || []);
      await this.knex.raw(updateBasketProductRelation, {
        basketId: UpdateBasketDto.basketId,
        productId: UpdateBasketDto.productId,
        count: UpdateBasketDto.count,
      });

      const newCountInStock =
        updatedProduct.productsInStock +
        basketItem[0].count -
        UpdateBasketDto.count;
      await this.knex
        .table("products")
        .where("id", UpdateBasketDto.productId)
        .update({
          productsInStock: newCountInStock,
        });

      return { message: "Product count updated" };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
