import { Module } from "@nestjs/common";
import { KnexModule } from "nest-knexjs";

@Module({
  imports: [
    KnexModule.forRoot({
      config: {
        client: "mysql",
        version: "5.7",
        useNullAsDefault: true,
        connection: {
          host: "127.0.0.1",
          port: 3308,
          user: "root",
          password: "root",
          database: "TestShopDB",
        },
      },
    }),
  ],
})
export class DBModule {}
