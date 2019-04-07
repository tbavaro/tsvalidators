"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
exports.ValidationOK = "ok";
function makeError(msg, path, causes) {
    return {
        msg: msg,
        path: path,
        causes: causes
    };
}
function isError(vr) {
    return vr !== exports.ValidationOK;
}
exports.isError = isError;
var OrValidator = (function () {
    function OrValidator(validators) {
        this.validators = validators;
    }
    OrValidator.prototype.validate = function (input, path) {
        var failures = [];
        var succeeded = undefined !==
            this.validators.find(function (validator) {
                var result = validator.validate(input, path);
                if (isError(result)) {
                    failures.push(result);
                    return false;
                }
                else {
                    return true;
                }
            });
        return (succeeded
            ? exports.ValidationOK
            : makeError("OrValidator failed", path, failures));
    };
    return OrValidator;
}());
exports.OrValidator = OrValidator;
var ArrayValidator = (function () {
    function ArrayValidator(elementValidator) {
        this.elementValidator = elementValidator;
    }
    ArrayValidator.prototype.validate = function (input, path) {
        var _this = this;
        if (!(input instanceof Array)) {
            return makeError("ArrayValidator failed; not an array", path);
        }
        var result = exports.ValidationOK;
        input.find(function (element, index) {
            result = _this.elementValidator.validate(element, path + "[" + index + "]");
            return isError(result);
        });
        return result;
    };
    return ArrayValidator;
}());
exports.ArrayValidator = ArrayValidator;
var ObjectValidator = (function () {
    function ObjectValidator(propertyValidators) {
        this.propertyValidators = propertyValidators;
    }
    ObjectValidator.prototype.validate = function (input, path) {
        if (typeof input !== "object" || input instanceof Array || input === null) {
            return makeError("ObjectValidator failed; not an object", path);
        }
        var result = exports.ValidationOK;
        Object.entries(this.propertyValidators).find(function (_a) {
            var propertyName = _a[0], validator = _a[1];
            result = validator.validate(input[propertyName], path + "." + propertyName);
            return isError(result);
        });
        return result;
    };
    return ObjectValidator;
}());
exports.ObjectValidator = ObjectValidator;
var TypeOfValidator = (function () {
    function TypeOfValidator(typeOfString) {
        this.typeOfString = typeOfString;
    }
    TypeOfValidator.prototype.validate = function (input, path) {
        if (typeof input !== this.typeOfString) {
            return makeError("TypeOfValidator (" + this.typeOfString + ") failed", path);
        }
        else {
            return exports.ValidationOK;
        }
    };
    return TypeOfValidator;
}());
exports.TypeOfValidator = TypeOfValidator;
var ExactValueValidator = (function () {
    function ExactValueValidator(values) {
        if (!util_1.isArray(values)) {
            values = [values];
        }
        this.values = values;
    }
    ExactValueValidator.prototype.validate = function (input, path) {
        for (var _i = 0, _a = this.values; _i < _a.length; _i++) {
            var value = _a[_i];
            if (input === value) {
                return exports.ValidationOK;
            }
        }
        return makeError("ExactValueValidator (" + JSON.stringify(this.values) + ") failed", path);
    };
    return ExactValueValidator;
}());
exports.ExactValueValidator = ExactValueValidator;
var OptionalValidator = (function () {
    function OptionalValidator(delegate) {
        this.delegate = delegate;
    }
    OptionalValidator.prototype.validate = function (input, path) {
        if (input === undefined) {
            return exports.ValidationOK;
        }
        else {
            return this.delegate.validate(input, path);
        }
    };
    return OptionalValidator;
}());
exports.OptionalValidator = OptionalValidator;
exports.undefinedValidator = new ExactValueValidator(undefined);
exports.nullValidator = new ExactValueValidator(null);
exports.stringValidator = new TypeOfValidator("string");
exports.numberValidator = new TypeOfValidator("number");
exports.booleanValidator = new TypeOfValidator("boolean");
function createValidationFunction(validator, name) {
    return (function (input) {
        var result = validator.validate(input, name);
        if (isError(result)) {
            throw new Error(result.msg);
        }
        return input;
    });
}
exports.createValidationFunction = createValidationFunction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9WYWxpZGF0b3JzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQStCO0FBVWxCLFFBQUEsWUFBWSxHQUFxQixJQUFJLENBQUM7QUFFbkQsU0FBUyxTQUFTLENBQUMsR0FBVyxFQUFFLElBQVksRUFBRSxNQUEwQjtJQUN0RSxPQUFPO1FBQ0wsR0FBRyxFQUFFLEdBQUc7UUFDUixJQUFJLEVBQUUsSUFBSTtRQUNWLE1BQU0sRUFBRSxNQUFNO0tBQ2YsQ0FBQztBQUNKLENBQUM7QUFFRCxTQUFnQixPQUFPLENBQUMsRUFBb0I7SUFDMUMsT0FBTyxFQUFFLEtBQUssb0JBQVksQ0FBQztBQUM3QixDQUFDO0FBRkQsMEJBRUM7QUFNRDtJQUdFLHFCQUFZLFVBQXVCO1FBQ2pDLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQy9CLENBQUM7SUFFTSw4QkFBUSxHQUFmLFVBQWdCLEtBQVUsRUFBRSxJQUFZO1FBQ3RDLElBQU0sUUFBUSxHQUFzQixFQUFFLENBQUM7UUFDdkMsSUFBTSxTQUFTLEdBQ2IsU0FBUztZQUNULElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQUEsU0FBUztnQkFDNUIsSUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQy9DLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO29CQUNuQixRQUFRLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUN0QixPQUFPLEtBQUssQ0FBQztpQkFDZDtxQkFBTTtvQkFDTCxPQUFPLElBQUksQ0FBQztpQkFDYjtZQUNILENBQUMsQ0FBQyxDQUFDO1FBRUwsT0FBTyxDQUNMLFNBQVM7WUFDUCxDQUFDLENBQUMsb0JBQVk7WUFDZCxDQUFDLENBQUMsU0FBUyxDQUFDLG9CQUFvQixFQUFFLElBQUksRUFBRSxR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