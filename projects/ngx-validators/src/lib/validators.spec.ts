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

    describe('#requiredIf', () => {
        it('should have errors if the condition is true', () => {
            const form = new FormGroup({
                firstName: new FormControl('aang', Validators.requiredIf(true))
            })
            expect(form.get('firstName')?.errors).toEqual({
                requiredIf: true, required: true
            });
        });

       it('should not have errors if the condition is false', () => {
           const form = new FormGroup({
               firstName: new FormControl('aang', Validators.requiredIf(false))
           })
           expect(form.get('firstName')?.errors).toBeNull();
       })
    });

    describe("#requiredIfAny", () => {
        it('should be required if any of the controls have a truthy value', () => {
            const form = new FormGroup({
                firstName: new FormControl('', Validators.requiredIfAny('lastName', 'middleName')),
                lastName: new FormControl('last name'),
                middleName: new FormControl(''),
            });

            vi.advanceTimersByTime(1);

            expect(form.get('firstName')?.errors).toEqual({
                requiredIfAny: ['lastName'], required: true,
            })
        });

        it('should be required if all of the controls have a truthy value', () => {
            const form = new FormGroup({
                firstName: new FormControl('', Validators.requiredIfAny('lastName', 'middleName')),
                lastName: new FormControl('last name'),
                middleName: new FormControl('middle name'),
            });

            vi.advanceTimersByTime(1);

            expect(form.get('firstName')?.errors).toEqual({
                requiredIfAny: ['lastName', 'middleName'], required: true,
            })
        });

        it('should be valid if none of the controls have a value', () => {
            const form = new FormGroup({
                firstName: new FormControl('', Validators.requiredIfAny('lastName', 'middleName')),
                lastName: new FormControl(''),
                middleName: new FormControl(''),
            });

            vi.advanceTimersByTime(1);

            expect(form.get('firstName')?.errors).toBeNull();
        });

        it('should be valid if some control has a value and so does this one', () => {
            const form = new FormGroup({
                firstName: new FormControl('larry', Validators.requiredIfAny('lastName', 'middleName')),
                lastName: new FormControl('smith'),
                middleName: new FormControl(''),
            });

            vi.advanceTimersByTime(1);

            expect(form.get('firstName')?.errors).toBeNull();
        });
    })

    describe("#requiredIfAll", () => {
        it('should be required when all the controls have a truthy value', () => {
            const form = new FormGroup({
                firstName: new FormControl('', Validators.requiredIfAll('lastName', 'middleName')),
                lastName: new FormControl('smith'),
                middleName: new FormControl('allen'),
            });

            vi.advanceTimersByTime(1);

            expect(form.get('firstName')?.errors).toEqual({
                requiredIfAll: ['lastName', 'middleName'], required: true
            })
        });

        it('should be valid when any the controls have a falsy value', () => {
            const form = new FormGroup({
                firstName: new FormControl('', Validators.requiredIfAll('lastName', 'middleName')),
                lastName: new FormControl('smith'),
                middleName: new FormControl(''),
            });

            vi.advanceTimersByTime(1);

            expect(form.get('firstName')?.errors).toBeNull();
        });

        it('should be valid when none the controls have a truthy value', () => {
            const form = new FormGroup({
                firstName: new FormControl('', Validators.requiredIfAll('lastName', 'middleName')),
                lastName: new FormControl(''),
                middleName: new FormControl(''),
            });

            vi.advanceTimersByTime(1);

            expect(form.get('firstName')?.errors).toBeNull();
        });
    });

    describe("#requiredIfAnyEqual", () => {
        it('should be required if any of the controls match the value given', () => {
            const form = new FormGroup({
                firstName: new FormControl('', Validators.requiredIfAnyEqual(['lastName', 'bar'], ['middleName', 'baz'])),
                middleName: new FormControl(''),
                lastName: new FormControl('bar'),
            });

            vi.advanceTimersByTime(1);

            expect(form.get('firstName')?.errors).toEqual({
                requiredIfAnyEqual: [['lastName', 'bar']], required: true
            })
        });

        it('should not be required if a control matches a value, but you data is entered', () => {
            const form = new FormGroup({
                firstName: new FormControl('foo', Validators.requiredIfAnyEqual(['lastName', 'bar'], ['middleName', 'baz'])),
                middleName: new FormControl(''),
                lastName: new FormControl('bar'),
            });

            vi.advanceTimersByTime(1);

            expect(form.get('firstName')?.errors).toBeNull();
        })

        it('should not be required if a control does not match the value given', () => {
            const form = new FormGroup({
                firstName: new FormControl('', Validators.requiredIfAnyEqual(['lastName', 'baz'], ['middleName', 'baz'])),
                middleName: new FormControl(''),
                lastName: new FormControl('bar'),
            })

            vi.advanceTimersByTime(1);

            expect(form.get('firstName')?.errors).toBeNull();
        })
    })

    describe("#requiredIfAllEqual", () => {
        it('should be required only if all of the values match', () => {
            const form = new FormGroup({
                firstName: new FormControl('', Validators.requiredIfAllEqual(['lastName', 'baz'], ['middleName', 'bar'])),
                middleName: new FormControl('bar'),
                lastName: new FormControl('baz'),
            })

            vi.advanceTimersByTime(1);

            expect(form.get('firstName')?.errors).toEqual({
                requiredIfAllEqual: true,
                required: true
            });
        });

        it('should not be required if some values do not match', () => {
            const form = new FormGroup({
                firstName: new FormControl('', Validators.requiredIfAllEqual(['lastName', 'bar'], ['middleName', 'baz'])),
                middleName: new FormControl('foo'),
                lastName: new FormControl('bar'),
            })

            vi.advanceTimersByTime(1);

            expect(form.get('firstName')?.errors).toBeNull();
        });

        it('should not be required if all of the values match, but a value is provided', () => {
            const form = new FormGroup({
                firstName: new FormControl('foo', Validators.requiredIfAllEqual(['lastName', 'baz'], ['middleName', 'bar'])),
                middleName: new FormControl('bar'),
                lastName: new FormControl('baz'),
            })

            vi.advanceTimersByTime(1);

            expect(form.get('firstName')?.errors).toBeNull();
        });
    })
});