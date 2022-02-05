import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function Match(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
}
@ValidatorConstraint({ name: 'Match' })
export class MatchConstraint implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    const [property] = args.constraints;

    const relatedValue = (args.object as any)[property];

    return value === relatedValue;
  }
  defaultMessage(): string {
    return 'This confirm password is not match';
  }
}
