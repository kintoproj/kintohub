import * as Yup from 'yup';
import {
  getFieldRequiredMessage,
  getFieldTooShortMessage,
  getFieldTooLongMessage,
} from 'libraries/constants';

declare module 'yup' {
  // tslint:disable-next-line
  interface ArraySchema<T> {
    unique(mapper: (a: T) => any, message?: any): ArraySchema<T>;
  }

  interface StringSchema<T> {
    domain(message?: any): StringSchema<T>;
    fieldRequired(field: string): StringSchema<T>;
    limit(field: string, min: number, max: number): StringSchema<T>;
  }
}

Yup.addMethod(Yup.array, 'unique', function unique(
  mapper = (a: any) => a,
  // eslint-disable-next-line no-template-curly-in-string
  message: string = '${path} may not have duplicates'
) {
  return this.test('unique', message, (list) => {
    return list.length === new Set(list.map(mapper)).size;
  });
});

Yup.addMethod(Yup.string, 'domain', function pattern(
  // eslint-disable-next-line no-template-curly-in-string
  message: string = '${value} is not a valid domain'
) {
  const regex =
    /^(?!:\/\/)([a-zA-Z0-9-_]+\.)*[a-zA-Z0-9][a-zA-Z0-9-_]+\.[a-zA-Z]{2,11}?$/;

  return this.test({
    message,
    test: (value) =>
      value === null ||
      value === '' ||
      value === undefined ||
      regex.test(value),
  });
});

Yup.addMethod(Yup.string, 'fieldRequired', function pattern(
  // eslint-disable-next-line no-template-curly-in-string
  field: string = '${path}'
) {
  return this.test({
    message: getFieldRequiredMessage(field),
    test: (value) => !!value,
  });
});

Yup.addMethod<Yup.StringSchema<string>>(Yup.string, 'limit', function pattern(
  // eslint-disable-next-line no-template-curly-in-string
  field: string = '${path}',
  min: number,
  max: number
) {
  return this.min(min, getFieldTooShortMessage(field, min))
    .max(max, getFieldTooLongMessage(field, max))
    .required(getFieldRequiredMessage(field));
});
