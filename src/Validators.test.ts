import * as Validators from "./Validators";

function testValidator(attrs: {
  prefix: string,
  validator: Validators.Validator,
  validInputs?: Array<{
    inputDescription?: string,
    input: any
  } | any>,
  invalidInputs?: Array<{
    inputDescription?: string
    input: any,
    errorPath?: string
  } | any>
}) {
  (attrs.validInputs || []).forEach(entry => {
    if (!(entry && typeof entry === "object" && "input" in entry)) {
      entry = { input: entry };
    }
    const description = entry.inputDescription || JSON.stringify(entry.input);
    it(`${attrs.prefix}: accepts ${description}`, () => {
      expect(attrs.validator.validate(entry.input, "$")).toBe(Validators.ValidationOK);
    });
  });

  (attrs.invalidInputs || []).forEach(entry => {
    if (!(entry && typeof entry === "object" && "input" in entry)) {
      entry = { input: entry };
    }
    const description = entry.inputDescription || JSON.stringify(entry.input);
    it(`${attrs.prefix}: rejects ${description}`, () => {
      const result = attrs.validator.validate(entry.input, "$");
      expect(result).not.toBe(Validators.ValidationOK);
      if (entry.errorPath !== undefined) {
        expect((result as Validators.ValidationError).path).toBe(entry.errorPath);
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
  validInputs: [{}, {"foo": 1}],
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
