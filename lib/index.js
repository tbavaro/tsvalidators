"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidationError extends Error {
    constructor(msg, causes) {
        super(msg);
        this.causes = causes;
    }
}
exports.ValidationError = ValidationError;
class Validator {
    static describeHelper(kind, otherProperties) {
        return Object.assign({ kind: kind }, otherProperties);
    }
}
exports.Validator = Validator;
class OrValidator extends Validator {
    constructor(validators) {
        super();
        this.validators = validators;
    }
    validate(input) {
        const failures = [];
        const succeeded = undefined !==
            this.validators.find(validator => {
                try {
                    validator.validate(input);
                    return true;
                }
                catch (e) {
                    if (e instanceof ValidationError) {
                        failures.push(e);
                        return false;
                    }
                    else {
                        throw e;
                    }
                }
            });
        if (!succeeded) {
            throw new ValidationError("OrValidator failed", failures);
        }
    }
    describe() {
        return Validator.describeHelper("OrValidator", {
            validators: this.validators.map(v => v.describe())
        });
    }
}
exports.OrValidator = OrValidator;
class ArrayValidator extends Validator {
    constructor(elementValidator) {
        super();
        this.elementValidator = elementValidator;
    }
    validate(input) {
        if (!(input instanceof Array)) {
            throw new ValidationError("ArrayValidator failed; not an array");
        }
        input.forEach((element, index) => {
            try {
                this.elementValidator.validate(element);
            }
            catch (e) {
                if (e instanceof ValidationError) {
                    throw new ValidationError(`ArrayValidator failed on element #${index}`, [e]);
                }
                else {
                    throw e;
                }
            }
        });
    }
    describe() {
        return Validator.describeHelper("ArrayValidator", {
            elementValidator: this.elementValidator.describe()
        });
    }
}
exports.ArrayValidator = ArrayValidator;
class ObjectValidator extends Validator {
    constructor(propertyValidators) {
        super();
        this.propertyValidators = propertyValidators;
    }
    validate(input) {
        if (typeof input !== "object" || input instanceof Array || input === null) {
            throw new ValidationError("ObjectValidator failed; not an object");
        }
        Object.entries(this.propertyValidators).forEach(([propertyName, validator]) => {
            try {
                validator.validate(input[propertyName]);
            }
            catch (e) {
                if (e instanceof ValidationError) {
                    throw new ValidationError(`ObjectValidator failed; property "${propertyName}"`, [e]);
                }
                else {
                    throw e;
                }
            }
        });
    }
    describe() {
        const children = {};
        for (const key of Object.keys(this.propertyValidators)) {
            const validator = this.propertyValidators[key];
            children[key] = validator.describe();
        }
        return Validator.describeHelper("ObjectValidator", {
            propertyValidators: children
        });
    }
}
exports.ObjectValidator = ObjectValidator;
class TypeOfValidator extends Validator {
    constructor(typeOfString) {
        super();
        this.typeOfString = typeOfString;
    }
    validate(input) {
        if (typeof input !== this.typeOfString) {
            throw new ValidationError("TypeOfValidator failed");
        }
    }
    describe() {
        return Validator.describeHelper("TypeOfValidator", {
            typeOfString: this.typeOfString
        });
    }
}
exports.TypeOfValidator = TypeOfValidator;
class ExactValueValidator extends Validator {
    constructor(value) {
        super();
        this.value = value;
    }
    validate(input) {
        if (input !== this.value) {
            throw new ValidationError("ExactValueValidator failed");
        }
    }
    describe() {
        return Validator.describeHelper("ExactValueValidator", {
            value: this.value
        });
    }
}
exports.ExactValueValidator = ExactValueValidator;
exports.undefinedValidator = new ExactValueValidator(undefined);
exports.nullValidator = new ExactValueValidator(null);
exports.stringValidator = new TypeOfValidator("string");
exports.numberValidator = new TypeOfValidator("number");
exports.booleanValidator = new TypeOfValidator("boolean");
function createValidationFunction(validator) {
    return (input => {
        validator.validate(input);
        return input;
    });
}
exports.createValidationFunction = createValidationFunction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQkFBNkIsU0FBUSxLQUFLO0lBR3hDLFlBQVksR0FBVyxFQUFFLE1BQTBCO1FBQ2pELEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7Q0FDRjtBQVBELDBDQU9DO0FBRUQ7SUFNWSxNQUFNLENBQUMsY0FBYyxDQUFDLElBQVksRUFBRSxlQUFvQjtRQUNoRSx1QkFBUyxJQUFJLEVBQUUsSUFBSSxJQUFLLGVBQWUsRUFBRztJQUM1QyxDQUFDO0NBQ0Y7QUFURCw4QkFTQztBQUdELGlCQUF5QixTQUFRLFNBQVM7SUFHeEMsWUFBWSxVQUF1QjtRQUNqQyxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQy9CLENBQUM7SUFFTSxRQUFRLENBQUMsS0FBVTtRQUN4QixNQUFNLFFBQVEsR0FBc0IsRUFBRSxDQUFDO1FBQ3ZDLE1BQU0sU0FBUyxHQUNiLFNBQVM7WUFDVCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtnQkFDL0IsSUFBSTtvQkFDRixTQUFTLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUMxQixPQUFPLElBQUksQ0FBQztpQkFDYjtnQkFBQyxPQUFPLENBQUMsRUFBRTtvQkFDVixJQUFJLENBQUMsWUFBWSxlQUFlLEVBQUU7d0JBQ2hDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2pCLE9BQU8sS0FBSyxDQUFDO3FCQUNkO3lCQUFNO3dCQUNMLE1BQU0sQ0FBQyxDQUFDO3FCQUNUO2lCQUNGO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFTCxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2QsTUFBTSxJQUFJLGVBQWUs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