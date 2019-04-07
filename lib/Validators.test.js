"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Validators = require("./Validators");
function testValidator(attrs) {
    (attrs.validInputs || []).forEach(function (entry) {
        if (!(entry && typeof entry === "object" && "input" in entry)) {
            entry = { input: entry };
        }
        var description = entry.inputDescription || JSON.stringify(entry.input);
        it(attrs.prefix + ": accepts " + description, function () {
            expect(attrs.validator.validate(entry.input, "$")).toBe(Validators.ValidationOK);
        });
    });
    (attrs.invalidInputs || []).forEach(function (entry) {
        if (!(entry && typeof entry === "object" && "input" in entry)) {
            entry = { input: entry };
        }
        var description = entry.inputDescription || JSON.stringify(entry.input);
        it(attrs.prefix + ": rejects " + description, function () {
            var result = attrs.validator.validate(entry.input, "$");
            expect(result).not.toBe(Validators.ValidationOK);
            if (entry.errorPath !== undefined) {
                expect(result.path).toBe(entry.errorPath);
            }
        });
    });
}
testValidator({
    prefix: "OrValidator[<empty>]",
    validator: new Validators.OrValidator([]),
    invalidInputs: [undefined, 1]
});
testValidator({
    prefix: "OrValidator[boolean, number]",
    validator: new Validators.OrValidator([Validators.booleanValidator, Validators.numberValidator]),
    validInputs: [true, false, 0, 1],
    invalidInputs: ["foo", undefined, null, "0"]
});
testValidator({
    prefix: "ExactValueValidator[<empty>]",
    validator: new Validators.ExactValueValidator([]),
    invalidInputs: [undefined, 1]
});
testValidator({
    prefix: "ExactValueValidator(1)",
    validator: new Validators.ExactValueValidator(1),
    validInputs: [1],
    invalidInputs: [undefined, 2]
});
testValidator({
    prefix: "ExactValueValidator([1, 'foo'])",
    validator: new Validators.ExactValueValidator([1, "foo"]),
    validInputs: [1, "foo"],
    invalidInputs: [2]
});
testValidator({
    prefix: "OptionalValidator(boolean)",
    validator: new Validators.OptionalValidator(Validators.booleanValidator),
    validInputs: [undefined, true],
    invalidInputs: [null, 0, "true"]
});
testValidator({
    prefix: "OptionalValidator(undefined)",
    validator: new Validators.OptionalValidator(Validators.undefinedValidator),
    validInputs: [undefined]
});
testValidator({
    prefix: "ObjectValidator({})",
    validator: new Validators.ObjectValidator({}),
    validInputs: [{}, { "foo": 1 }],
    invalidInputs: [null, undefined, 0]
});
testValidator({
    prefix: "path tests with ObjectValidator({ foo: boolean, bar?: { a: number } })",
    validator: new Validators.ObjectValidator({
        foo: Validators.booleanValidator,
        bar: new Validators.OptionalValidator(new Validators.ObjectValidator({
            a: Validators.numberValidator
        }))
    }),
    validInputs: [
        { foo: true },
        { foo: false, bar: { a: 1 } }
    ],
    invalidInputs: [
        {
            input: null,
            errorPath: "$"
        },
        {
            input: {},
            errorPath: "$.foo"
        },
        {
            input: { foo: "xyz" },
            errorPath: "$.foo"
        },
        {
            input: { foo: true, bar: 0 },
            errorPath: "$.bar"
        },
        {
            input: { foo: true, bar: { a: "xyz" } },
            errorPath: "$.bar.a"
        }
    ]
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmFsaWRhdG9ycy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1ZhbGlkYXRvcnMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUEyQztBQUUzQyxTQUFTLGFBQWEsQ0FBQyxLQVl0QjtJQUNDLENBQUMsS0FBSyxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLO1FBQ3JDLElBQUksQ0FBQyxDQUFDLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksT0FBTyxJQUFJLEtBQUssQ0FBQyxFQUFFO1lBQzdELEtBQUssR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQztTQUMxQjtRQUNELElBQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMxRSxFQUFFLENBQUksS0FBSyxDQUFDLE1BQU0sa0JBQWEsV0FBYSxFQUFFO1lBQzVDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNuRixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsQ0FBQyxLQUFLLENBQUMsYUFBYSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEtBQUs7UUFDdkMsSUFBSSxDQUFDLENBQUMsS0FBSyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsSUFBSSxPQUFPLElBQUksS0FBSyxDQUFDLEVBQUU7WUFDN0QsS0FBSyxHQUFHLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDO1NBQzFCO1FBQ0QsSUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixJQUFJLElBQUks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