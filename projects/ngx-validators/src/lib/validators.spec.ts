import {describe, expect, it, beforeEach, afterEach, vi} from "vitest";
import {Validators} from "./validators";
import {FormControl, FormGroup} from "@angular/forms";

describe('Validators', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.clearAllTimers();
    });

    describe('#if', () => {
        it('should have errors if the condition is true', () => {
            const form = new FormGroup({
                firstName: new FormControl('aang', Validators.if(true))
            })
            expect(form.get('firstName')?.errors).toEqual({
                if: true, required: true
            });
        });

       it('should not have errors if the condition is false', () => {
           const form = new FormGroup({
               firstName: new FormControl('aang', Validators.if(false))
           })
           expect(form.get('firstName')?.errors).toBeNull();
       })
    });

    describe("#any", () => {
        it('should be required if any of the controls have a truthy value', () => {
            const form = new FormGroup({
                firstName: new FormControl('', Validators.any('lastName', 'middleName')),
                lastName: new FormControl('last name'),
                middleName: new FormControl(''),
            });

            vi.advanceTimersByTime(1);

            expect(form.get('firstName')?.errors).toEqual({
                any: ['lastName'], required: true,
            })
        });

        it('should be required if all of the controls have a truthy value', () => {
            const form = new FormGroup({
                firstName: new FormControl('', Validators.any('lastName', 'middleName')),
                lastName: new FormControl('last name'),
                middleName: new FormControl('middle name'),
            });

            vi.advanceTimersByTime(1);

            expect(form.get('firstName')?.errors).toEqual({
                any: ['lastName', 'middleName'], required: true,
            })
        });

        it('should be valid if none of the controls have a value', () => {
            const form = new FormGroup({
                firstName: new FormControl('', Validators.any('lastName', 'middleName')),
                lastName: new FormControl(''),
                middleName: new FormControl(''),
            });

            vi.advanceTimersByTime(1);

            expect(form.get('firstName')?.errors).toBeNull();
        });

        it('should be valid if some control has a value and so does this one', () => {
            const form = new FormGroup({
                firstName: new FormControl('larry', Validators.any('lastName', 'middleName')),
                lastName: new FormControl('smith'),
                middleName: new FormControl(''),
            });

            vi.advanceTimersByTime(1);

            expect(form.get('firstName')?.errors).toBeNull();
        });
    })

    describe("#all", () => {
        it('should be required when all the controls have a truthy value', () => {
            const form = new FormGroup({
                firstName: new FormControl('', Validators.all('lastName', 'middleName')),
                lastName: new FormControl('smith'),
                middleName: new FormControl('allen'),
            });

            vi.advanceTimersByTime(1);

            expect(form.get('firstName')?.errors).toEqual({
                all: ['lastName', 'middleName'], required: true
            })
        });

        it('should be valid when any the controls have a falsy value', () => {
            const form = new FormGroup({
                firstName: new FormControl('', Validators.all('lastName', 'middleName')),
                lastName: new FormControl('smith'),
                middleName: new FormControl(''),
            });

            vi.advanceTimersByTime(1);

            expect(form.get('firstName')?.errors).toBeNull();
        });

        it('should be valid when none the controls have a truthy value', () => {
            const form = new FormGroup({
                firstName: new FormControl('', Validators.all('lastName', 'middleName')),
                lastName: new FormControl(''),
                middleName: new FormControl(''),
            });

            vi.advanceTimersByTime(1);

            expect(form.get('firstName')?.errors).toBeNull();
        });
    });

    describe("#anyEqual", () => {
        it('should be required if any of the controls match the value given', () => {
            const form = new FormGroup({
                firstName: new FormControl('', Validators.anyEqual(['lastName', 'bar'], ['middleName', 'baz'])),
                middleName: new FormControl(''),
                lastName: new FormControl('bar'),
            });

            vi.advanceTimersByTime(1);

            expect(form.get('firstName')?.errors).toEqual({
                anyEqual: [['lastName', 'bar']], required: true
            })
        });

        it('should not be required if a control matches a value, but you data is entered', () => {
            const form = new FormGroup({
                firstName: new FormControl('foo', Validators.anyEqual(['lastName', 'bar'], ['middleName', 'baz'])),
                middleName: new FormControl(''),
                lastName: new FormControl('bar'),
            });

            vi.advanceTimersByTime(1);

            expect(form.get('firstName')?.errors).toBeNull();
        })

        it('should not be required if a control does not match the value given', () => {
            const form = new FormGroup({
                firstName: new FormControl('', Validators.anyEqual(['lastName', 'baz'], ['middleName', 'baz'])),
                middleName: new FormControl(''),
                lastName: new FormControl('bar'),
            })

            vi.advanceTimersByTime(1);

            expect(form.get('firstName')?.errors).toBeNull();
        })
    })

    describe("#allEqual", () => {
        it('should be required only if all of the values match', () => {
            const form = new FormGroup({
                firstName: new FormControl('', Validators.allEqual(['lastName', 'baz'], ['middleName', 'bar'])),
                middleName: new FormControl('bar'),
                lastName: new FormControl('baz'),
            })

            vi.advanceTimersByTime(1);

            expect(form.get('firstName')?.errors).toEqual({
                allEqual: [['lastName', 'baz'], ['middleName', 'bar']],
                required: true
            });
        });

        it('should not be required if some values do not match', () => {
            const form = new FormGroup({
                firstName: new FormControl('', Validators.allEqual(['lastName', 'bar'], ['middleName', 'baz'])),
                middleName: new FormControl('foo'),
                lastName: new FormControl('bar'),
            })

            vi.advanceTimersByTime(1);

            expect(form.get('firstName')?.errors).toBeNull();
        });

        it('should not be required if all of the values match, but a value is provided', () => {
            const form = new FormGroup({
                firstName: new FormControl('foo', Validators.allEqual(['lastName', 'baz'], ['middleName', 'bar'])),
                middleName: new FormControl('bar'),
                lastName: new FormControl('baz'),
            })

            vi.advanceTimersByTime(1);

            expect(form.get('firstName')?.errors).toBeNull();
        });
    })

    describe('#range', () => {
        it('should be valid when the control is null or undefined', () => {
            const form = new FormGroup({
                age: new FormControl<number | null | undefined>(null, Validators.range(18, 100))
            });
            expect(form.get('age')?.errors).toBeNull();

            form.get('age')?.setValue(undefined);
            expect(form.get('age')?.errors).toBeNull()
        });

        it('should be valid when the control is empty string', () => {
            const form = new FormGroup({
                age: new FormControl(null, Validators.range(18, 100))
            });
            expect(form.get('age')?.errors).toBeNull();
        })

        it('should have errors when the value is outside of the range', () => {
            const form = new FormGroup({
                age: new FormControl(100, Validators.range(18, 100))
            });

            expect(form.get('age')?.errors).toEqual({
                outOfRange: true, range: [18, 100], value: 100
            });

            form.get('age')?.setValue(99);
            expect(form.get('age')?.errors).toBeNull();

            form.get('age')?.setValue(18);
            expect(form.get('age')?.errors).toBeNull();

            form.get('age')?.setValue(17);
            expect(form.get('age')?.errors).toEqual({
                outOfRange: true, range: [18, 100], value: 17
            })
        })
    });

    describe('#zipCode', () => {
        it('should support 5 digit zip codes', () => {
            const form = new FormGroup({
                zipCode: new FormControl('93540'),
            });
            expect(form.get('zipCode')?.errors).toBeNull();
        });

        it('should support 5 plus 4 digit zip codes (extended zip codes)', () => {
            const form = new FormGroup({
                zipCode: new FormControl('06423-3471', Validators.zipCode),
            });
            expect(form.get('zipCode')?.errors).toBeNull();
        });

        it('should only check when there is a value', () => {
            const form = new FormGroup({
                zipCode: new FormControl('', Validators.zipCode),
            })
            expect(form.get('zipCode')?.errors).toBeNull();
        })
    });

    describe('#stateCode', () => {
        it('should support any state code, regardless of case', () => {
            const form = new FormGroup({
                stateCode: new FormControl('Ct', Validators.stateCode),
            });
            expect(form.get('stateCode')?.errors).toBeNull();
        });

        it('should be valid when there is nothing entered yet', () => {
            const form = new FormGroup({
                stateCode: new FormControl('', Validators.stateCode),
            });
            expect(form.get('stateCode')?.errors).toBeNull();
        });

        it('should have error when it is not a valid state code', () => {
            const form = new FormGroup({
                stateCode: new FormControl('AF', Validators.stateCode),
            });
            expect(form.get('stateCode')?.errors).toEqual({ stateCode: true });
        });
    });

    describe('#stateName', () => {
        it('should support any state name, regardless of case', () => {
            const form = new FormGroup({
                stateName: new FormControl('New YORK', Validators.stateName),
            });
            expect(form.get('stateName')?.errors).toBeNull();
        });

        it('should be valid when there is nothing entered yet', () => {
            const form = new FormGroup({
                stateName: new FormControl('', Validators.stateName),
            });
            expect(form.get('stateName')?.errors).toBeNull();
        });

        it('should have error when it is not a valid state name', () => {
            const form = new FormGroup({
                stateName: new FormControl('Orlando', Validators.stateName),
            });
            expect(form.get('stateName')?.errors).toEqual({ stateName: true });
        });
    });

    describe('#address', () => {
        it('should support any address', () => {
            const form = new FormGroup({
                streetAddress1: new FormControl('123 Main St', Validators.streetAddress),
                streetAddress2: new FormControl('456 Elm Street Apt 5', Validators.streetAddress),
                streetAddress3: new FormControl('789-B Oak Rd', Validators.streetAddress),
                streetAddress4: new FormControl('101 First Ave, Unit #4', Validators.streetAddress),
            });
            expect(form.get('streetAddress1')?.errors).toBeNull();
            expect(form.get('streetAddress2')?.errors).toBeNull();
            expect(form.get('streetAddress3')?.errors).toBeNull();
            expect(form.get('streetAddress4')?.errors).toBeNull();
        });

        it('should be valid when there is nothing entered yet', () => {
            const form = new FormGroup({
                streetAddress: new FormControl('', Validators.streetAddress),
            });
            expect(form.get('streetAddress')?.errors).toBeNull();
        });

        it('should have error when it is not address', () => {
            const form = new FormGroup({
                streetAddress: new FormControl('Apartment ##123', Validators.streetAddress),
            });
            expect(form.get('streetAddress')?.errors).toEqual({ streetAddress: true });
        });
    });
});