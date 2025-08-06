import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";

export function MatchField(
  property: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "MatchField",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints as string[];
          const obj = args.object as Record<string, unknown>;
          return value === obj[relatedPropertyName];
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints as string[];
          return `${args.property} must match ${relatedPropertyName}`;
        },
      },
    });
  };
}
