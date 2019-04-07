import { isArray } from "util";

export type ValidationError = {
  msg: string;
  path: string;
  causes?: ValidationError[];
};

export type ValidationResult = ValidationError | "ok";

export const ValidationOK: ValidationResult = "ok";

function makeError(msg: string, path: string, causes?: ValidationError[]): ValidationError {
  return {
    msg: msg,
    path: path,
    causes: causes
  };
}

export function isError(vr: ValidationResult): vr is ValidationError {
  return vr !== ValidationOK;
}

export interface Validator {
  validate(input: any, path: string): ValidationResult;
}

export class OrValidator implements Validator {
  public readonly validators: ReadonlyArray<Validator>;

  constructor(validators: Validator[]) {
    this.validators = validators;
  }

  public validate(input: any, path: string) {
    const failures: ValidationError[] = [];
    const succeeded =
      undefined !==
      this.validators.find(validator => {
        const result = validator.validate(input, path);
        if (isError(result)) {
          failures.push(result);
          return false;
        } else {
          return true;
        }
      });

    return (
      succeeded
        ? ValidationOK
        : makeError("OrValidator failed", path, failures)
    );
  }
}

export class ArrayValidator implements Validator {
  public readonly elementValidator: Validator;

  constructor(elementValidator: Validator) {
    this.elementValidator = elementValidator;
  }

  public validate(input: any, path: string) {
    if (!(input instanceof Array)) {
      return makeError("ArrayValidator failed; not an array", path);
    }

    let result: ValidationResult = ValidationOK;
    input.find((element, index) => {
      result = this.elementValidator.validate(element, `${path}[${index}]`);
      return isError(result);
    });
    return result;
  }
}

export class ObjectValidator implements Validator {
  public readonly propertyValidators: Readonly<{
    [propertyName: string]: Validator;
  }>;

  constructor(propertyValidators: { [propertyName: string]: Validator }) {
    this.propertyValidators = propertyValidators;
  }

  public validate(input: any, path: string) {
    // TODO maybe reject if we see any values that aren't supposed to be there

    if (typeof input !== "object" || input instanceof Array || input === null) {
      return makeError("ObjectValidator failed; not an object", path);
    }

    let result: ValidationResult = ValidationOK;
    Object.entries(this.propertyValidators).find(
      ([propertyName, validator]) => {
        result = validator.validate(input[propertyName], `${path}.${propertyName}`);
        return isError(result);
      }
    );
    return result;
  }
}

export class TypeOfValidator implements Validator {
  public readonly typeOfString: string;

  constructor(typeOfString: string) {
    this.typeOfString = typeOfString;
  }

  public validate(input: any, path: string) {
    if (typeof input !== this.typeOfString) {
      return makeError(`TypeOfValidator (${this.typeOfString}) failed`, path);
    } else {
      return ValidationOK;
    }
  }
}

export class ExactValueValidator<T> implements Validator {
  public readonly values: ReadonlyArray<T>;

  constructor(values: T[] | T) {
    if (!isArray(values)) {
      values = [values];
    }
    this.values = values;
  }

  public validate(input: any, path: string) {
    for (const value of this.values) {
      if (input === value) {
        return ValidationOK;
      }
    }

    return makeError(`ExactValueValidator (${JSON.stringify(this.values)}) failed`, path);
  }
}

export class OptionalValidator implements Validator {
  public readonly delegate: Validator;

  constructor(delegate: Validator) {
    this.delegate = delegate;
  }

  public validate(input: any, path: string) {
    if (input === undefined) {
      return ValidationOK;
    } else {
      return this.delegate.validate(input, path);
    }
  }
}

export const undefinedValidator: Validator = new ExactValueValidator(undefined);
export const nullValidator: Validator = new ExactValueValidator(null);
export const stringValidator: Validator = new TypeOfValidator("string");
export const numberValidator: Validator = new TypeOfValidator("number");
export const booleanValidator: Validator = new TypeOfValidator("boolean");

export function createValidationFunction<T>(validator: Validator, name: string): (input: any) => T {
  return (input => {
    const result = validator.validate(input, name);
    if (isError(result)) {
      throw new Error(result.msg);
    }
    return input as T;
  });
}
