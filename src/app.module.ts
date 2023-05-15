import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { KnexModule } from "nest-knexjs";
import { UsersModule } from "./users/users.module";
import { ProductsModule } from "./products/products.module";
import { BasketModule } from "./basket/basket.module";
import { OrdersModule } from "./orders/orders.module";
import { DBModule } from "./db/db.module";

@Module({
  imports: [DBModule, UsersModule, ProductsModule, BasketModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
