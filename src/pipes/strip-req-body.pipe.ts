import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { getMetadataStorage, ValidationTypes } from "class-validator";
import { isUndefined, omit, omitBy } from "lodash";
import { REQUEST_CONTEXT } from "src/interceptors/request.interceptor";

@Injectable()
export class StripRequestBodyPipe implements PipeTransform {
  manualWhitelist<T extends object>(
    dtoClass: new () => T,
    plain: Record<string, unknown>,
  ): Partial<T> {
    const metadataStorage = getMetadataStorage();
    const metadata = metadataStorage.getTargetValidationMetadatas(
      dtoClass,
      "",
      false,
      false,
    );
    const dtoKeys = Array.from(new Set(metadata.map((m) => m.propertyName)));

    const result: Record<string, any> = {};

    for (const key of dtoKeys) {
      const meta = metadata.find((m) => m.propertyName === key);

      const value = plain[key];

      if (
        meta?.type === ValidationTypes.NESTED_VALIDATION &&
        value &&
        typeof value === "object"
      ) {
        const nestedType = Reflect.getMetadata(
          "design:type",
          dtoClass.prototype,
          key,
        ) as new () => any;

        if (Array.isArray(value)) {
          result[key] = value.map((item) =>
            this.manualWhitelist(nestedType, item as Record<string, unknown>),
          );
        } else {
          result[key] = this.manualWhitelist(
            nestedType,
            value as Record<string, unknown>,
          );
        }
      } else {
        result[key] = value;
      }
    }

    return result as Partial<T>;
  }

  transform(value: any, metadata: ArgumentMetadata): any {
    if (
      metadata.type !== "body" ||
      typeof value !== "object" ||
      value === null
    ) {
      return value;
    }

    const dtoClass = metadata.metatype;
    if (!dtoClass || typeof dtoClass !== "function") {
      return value;
    }

    const omitted = omit(value, REQUEST_CONTEXT);
    const picked = this.manualWhitelist(dtoClass, omitted);
    return omitBy(picked, isUndefined);
  }
}
