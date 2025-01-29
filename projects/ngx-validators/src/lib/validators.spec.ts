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
});