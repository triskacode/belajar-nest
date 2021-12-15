import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { getRepository } from 'typeorm';

export function Unique(
  entity: EntityClassOrSchema,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entity],
      validator: UniqueConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'Unique' })
export class UniqueConstraint implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    const [entity] = args.constraints;

    const repository = getRepository(entity);

    const isAlreadyExist = !!(await repository.findOne({
      [args.property]: value,
    }));

    return !isAlreadyExist;
  }
  defaultMessage(): string {
    return 'This email address is already in use';
  }
}
