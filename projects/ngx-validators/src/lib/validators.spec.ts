import {describe, expect, it} from "vitest";
import {Validators} from "./validators";
import {FormControl, FormGroup} from "@angular/forms";

describe('Validators', () => {
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

    describe('#requiredIfPresent', () => {
        it('should make our control be required if the given control name has a truthy value', () => {
           const form = new FormGroup({
               firstName: new FormControl('', Validators.requiredIfPresent('lastName')),
               lastName: new FormControl('anything')
           });
           form.get('firstName')?.updateValueAndValidity();
           expect(form.get('firstName')?.errors).toEqual({ requiredIfPresent: 'lastName', required: true })
        });

        it('should make our control not be required if the given control name has a falsy value', () => {
            const form = new FormGroup({
                firstName: new FormControl('', Validators.requiredIfPresent('lastName')),
                lastName: new FormControl('')
            });
            form.get('firstName')?.updateValueAndValidity();
            expect(form.get('firstName')?.errors).toBeNull();
        });

        it('should make our control not required if the control has a value', () => {
            const form = new FormGroup({
                firstName: new FormControl('Mike', Validators.requiredIfPresent('lastName')),
                lastName: new FormControl('Tester')
            });
            form.get('firstName')?.updateValueAndValidity();
            expect(form.get('firstName')?.errors).toBeNull();
        });

        it('should not make the control required if the other field does not exist', () => {
            const form = new FormGroup({
                firstName: new FormControl('', Validators.requiredIfPresent('lastName')),
            });
            form.get('firstName')?.updateValueAndValidity();
            expect(form.get('firstName')?.errors).toBeNull();
        });
    });

    describe('#requiredIfEqualTo', () => {
        it('should make the control required if the other control has a specific value', () => {
            const form = new FormGroup({
                genreFreeform: new FormControl('', Validators.requiredIfEqualTo('genre', 'Other')),
                genre: new FormControl('Other')
            });
            form.get('genreFreeform')?.updateValueAndValidity();
            expect(form.get('genreFreeform')?.errors).toEqual({ requiredIfEqualTo: 'genre', required: true })
        });

        it('should make the control optional if the other control does not have a specific value', () => {
            const form = new FormGroup({
                genreFreeform: new FormControl('', Validators.requiredIfEqualTo('genre', 'Other')),
                genre: new FormControl('Rock and Roll')
            });
            form.get('genreFreeform')?.updateValueAndValidity();
            expect(form.get('genreFreeform')?.errors).toBeNull();
        });

        it('should not make the control required if the given control does not exist', () => {
            const form = new FormGroup({
                genreFreeform: new FormControl('', Validators.requiredIfEqualTo('genre', 'Other')),
            });
            form.get('genreFreeform')?.updateValueAndValidity();
            expect(form.get('genreFreeform')?.errors).toBeNull();
        });
    });
});