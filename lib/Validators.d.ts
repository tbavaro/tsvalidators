export declare type ValidationError = {
    msg: string;
    path: string;
    causes?: ValidationError[];
};
export declare type ValidationResult = ValidationError | "ok";
export declare const ValidationOK: ValidationResult;
export declare function isError(vr: ValidationResult): vr is ValidationError;
export interface Validator {
    validate(input: any, path: string): ValidationResult;
}
export declare class OrValidator implements Validator {
    readonly validators: ReadonlyArray<Validator>;
    constructor(validators: Validator[]);
    validate(input: any, path: string): ValidationResult;
}
export declare class ArrayValidator implements Validator {
    readonly elementValidator: Validator;
    constructor(elementValidator: Validator);
    validate(input: any, path: string): ValidationResult;
}
export declare class ObjectValidator implements Validator {
    readonly propertyValidators: Readonly<{
        [propertyName: string]: Validator;
    }>;
    constructor(propertyValidators: {
        [propertyName: string]: Validator;
    });
    validate(input: any, path: string): ValidationResult;
}
export declare class TypeOfValidator implements Validator {
    readonly typeOfString: string;
    constructor(typeOfString: string);
    validate(input: any, path: string): ValidationResult;
}
export declare class ExactValueValidator<T> implements Validator {
    readonly values: ReadonlyArray<T>;
    constructor(values: T[] | T);
    validate(input: any, path: string): ValidationResult;
}
export declare class OptionalValidator implements Validator {
    readonly delegate: Validator;
    constructor(delegate: Validator);
    validate(input: any, path: string): ValidationResult;
}
export declare const undefinedValidator: Validator;
export declare const nullValidator: Validator;
export declare const stringValidator: Validator;
export declare const numberValidator: Validator;
export declare const booleanValidator: Validator;
export declare function createValidationFunction<T>(validator: Validator, name: string): (input: any) => T;
