import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Knex } from "knex";
import { InjectModel } from "nest-knexjs";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { IUser } from "./users.interface";

@Injectable()
export class UsersService {
  constructor(@InjectModel() private readonly knex: Knex) {}

  async findAll() {
    const users: IUser[] = await this.knex.table("users");
    return { users };
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = {
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        email: createUserDto.email,
      };
      await this.knex.table("users").insert(user);

      return { message: "User created", user };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number) {
    const user: IUser = await this.knex.table("users").where("id", id).first();
    if (!user) {
      throw new NotFoundException(`User with ${id} does not exist`);
    }

    return { user };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const user = {
        firstName: updateUserDto.firstName,
        lastName: updateUserDto.lastName,
        email: updateUserDto.email,
      };
      await this.knex.table("users").where("id", id).update(user);

      return { message: "User updated", user };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      await this.knex.table("users").where("id", id).del();
      return { message: "User deleted" };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
