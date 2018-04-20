export type ValidationError = {
  msg: string;
  causes?: ValidationError[];
};

export type ValidationResult = ValidationError | "ok";

export const ValidationOK: ValidationResult = "ok";

function makeError(msg: string, causes?: ValidationError[]): ValidationError {
  return {
    msg: msg,
    causes: causes
  };
}

function isError(vr: ValidationResult): vr is ValidationError {
  return vr !== ValidationOK;
}

export abstract class Validator {
  public abstract validate(input: any): ValidationResult;

  public abstract describe(): { kind: string };

  protected static describeHelper(kind: string, otherProperties?: {}): { kind: string } {
    return { kind: kind, ...otherProperties };
  }
}

export class OrValidator extends Validator {
  public readonly validators: ReadonlyArray<Validator>;

  constructor(validators: Validator[]) {
    super();
    this.validators = validators;
  }

  public validate(input: any) {
    const failures: ValidationError[] = [];
    const succeeded =
      undefined !==
      this.validators.find(validator => {
        const result = validator.validate(input);
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
        : makeError("OrValidator failed", failures)
    );
  }

  public describe() {
    return Validator.describeHelper("OrValidator", {
      validators: this.validators.map(v => v.describe())
    });
  }
}

export class ArrayValidator extends Validator {
  public readonly elementValidator: Validator;

  constructor(elementValidator: Validator) {
    super();
    this.elementValidator = elementValidator;
  }

  public validate(input: any) {
    if (!(input instanceof Array)) {
      return makeError("ArrayValidator failed; not an array");
    }

    let result: ValidationResult = ValidationOK;
    input.find((element, index) => {
      result = this.elementValidator.validate(element);
      return isError(result);
    });
    return result;
  }

  public describe() {
    return Validator.describeHelper("ArrayValidator", {
      elementValidator: this.elementValidator.describe()
    });
  }
}


export class ObjectValidator extends Validator {
  public readonly propertyValidators: Readonly<{
    [propertyName: string]: Validator;
  }>;

  constructor(propertyValidators: { [propertyName: string]: Validator }) {
    super();
    this.propertyValidators = propertyValidators;
  }

  public validate(input: any) {
    // TODO maybe reject if we see any values that aren't supposed to be there

    if (typeof input !== "object" || input instanceof Array || input === null) {
      return makeError("ObjectValidator failed; not an object");
    }

    let result: ValidationResult = ValidationOK;
    Object.entries(this.propertyValidators).find(
      ([propertyName, validator]) => {
        const myResult = validator.validate(input[propertyName]);
        if (isError(myResult)) {
          result = makeError(`ObjectValidator failed; property "${propertyName}"`, [myResult]);
          return true;
        } else {
          return false;
        }
      }
    );
    return result;
  }

  public describe() {
    const children: { [k: string]: {} } = {};
    for (const key of Object.keys(this.propertyValidators)) {
      const validator = this.propertyValidators[key];
      children[key] = validator.describe();
    }

    return Validator.describeHelper("ObjectValidator", {
      propertyValidators: children
    });
  }
}

export class TypeOfValidator extends Validator {
  public readonly typeOfString: string;

  constructor(typeOfString: string) {
    super();
    this.typeOfString = typeOfString;
  }

  public validate(input: any) {
    if (typeof input !== this.typeOfString) {
      return makeError(`TypeOfValidator (${this.typeOfString}) failed`);
    } else {
      return ValidationOK;
    }
  }

  public describe() {
    return Validator.describeHelper("TypeOfValidator", {
      typeOfString: this.typeOfString
    });
  }
}

export class ExactValueValidator extends Validator {
  public readonly value: Readonly<any>;

  constructor(value: any) {
    super();
    this.value = value;
  }

  public validate(input: any) {
    if (input !== this.value) {
      return makeError(`ExactValueValidator (${this.value}) failed`);
    } else {
      return ValidationOK;
    }
  }

  public describe() {
    return Validator.describeHelper("ExactValueValidator", {
      value: this.value
    });
  }
}

export const undefinedValidator: Validator = new ExactValueValidator(undefined);
export const nullValidator: Validator = new ExactValueValidator(null);
export const stringValidator: Validator = new TypeOfValidator("string");
export const numberValidator: Validator = new TypeOfValidator("number");
export const booleanValidator: Validator = new TypeOfValidator("boolean");

export function createValidationFunction<T>(validator: Validator): (input: any) => T {
  return (input => {
    const result = validator.validate(input);
    if (isError(result)) {
      throw new Error(result.msg);
    }
    return input as T;
  });
}
