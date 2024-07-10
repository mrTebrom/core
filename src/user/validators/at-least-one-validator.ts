import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function AtLeastOne(
  property: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'atLeastOne',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const relatedValues = args.constraints[0].map(
            (prop: string) => (args.object as any)[prop],
          );
          return relatedValues.some(
            (relatedValue: any) =>
              relatedValue !== null &&
              relatedValue !== undefined &&
              relatedValue !== '',
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `At least one of the following properties must be provided: ${args.constraints[0].join(', ')}`;
        },
      },
    });
  };
}
