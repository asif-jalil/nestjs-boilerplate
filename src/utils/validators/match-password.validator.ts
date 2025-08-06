import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { Request } from "express";
import { REQUEST_CONTEXT } from "src/interceptors/request.interceptor";
import { User } from "src/modules/user/user.entity";
import { DataSource } from "typeorm";

@ValidatorConstraint({ async: true })
@Injectable()
export class MatchPasswordConstraint implements ValidatorConstraintInterface {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const request = args?.object[REQUEST_CONTEXT] as Request;
    const repo = this.dataSource.getRepository(User);

    const user = await repo.findOne({
      where: { id: request.user?.id },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      return false;
    }

    const isPasswordMatch = await user.comparePassword(value as string);

    return isPasswordMatch;
  }

  defaultMessage(): string {
    return "Password does not match.";
  }
}

export function MatchPassword(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (target: object, propertyName: string | symbol) {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyName.toString(),
      options: validationOptions,
      validator: MatchPasswordConstraint,
    });
  };
}
