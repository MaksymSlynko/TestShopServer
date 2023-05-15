import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "nest-knexjs";
import { Knex } from "knex";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { IProduct } from "./products.interface";

@Injectable()
export class ProductsService {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async findAll() {
    const products: IProduct[] = await this.knex.table("products");
    return { products };
  }

  async create(CreateProductDto: CreateProductDto) {
    try {
      const product = {
        name: CreateProductDto.name,
        price: CreateProductDto.price,
        description: CreateProductDto.description,
        productsInStock: CreateProductDto.productsInStock,
      };
      await this.knex.table("products").insert(product);

      return { message: "New product added", product };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    const product: IProduct = await this.knex
      .table("products")
      .where("id", id)
      .first();
    if (!product) {
      throw new NotFoundException(`Product with ${id} does not exist`);
    }
    return { product };
  }

  async update(id: number, UpdateProductDto: UpdateProductDto) {
    try {
      const product = {
        name: UpdateProductDto.name,
        price: UpdateProductDto.price,
        description: UpdateProductDto.description,
        productsInStock: UpdateProductDto.productsInStock,
      };
      await this.knex.table("products").where("id", id).update(product);

      return { message: "Product updated", product };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    await this.knex.table("products").where("id", id).del();
    return { message: "Product deleted" };
  }
}
