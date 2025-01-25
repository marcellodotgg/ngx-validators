import {AbstractControl, ValidationErrors, ValidatorFn, Validators as CoreValidators} from '@angular/forms';

/**
 * An extension of the default Angular Validators provided by the Angular team.
 *
 * This also includes some helper validators which may be useful for more complex
 * validations. Such as validation based on another control.
 *
 * You can add your own Validators to this by simply extending this class.
 *
 * @example
 * ```ts
 * // Requires firstName, only if lastName is provided.
 * new FormGroup({
 *   firstName: new FormControl('', Validators.requiredIfPresent('lastName'));
 *   lastName: new FormControl('');
 * });
 * ```
 */
export class Validators extends CoreValidators {
    /**
     * Requires the current control if the given condition is true.
     *
     * @param condition the condition to check against.
     * @returns null if the condition is false, { requiredIf: true, required: true } otherwise.
     */
    static requiredIf(condition: boolean): ValidatorFn {
        return (_: AbstractControl): ValidationErrors | null => {
            return condition ? { requiredIf: true, required: true } : null;
        }
    }

    /**
     * Requires the current control if the given control name has a truthy value.
     *
     * @param controlName the control name to check for a truthy value.
     * @returns null if not required, { requiredIfPresent: controlName, required: true } otherwise.
     */
    static requiredIfPresent(controlName: string): ValidatorFn {
       return (control: AbstractControl): ValidationErrors | null => {
           const parent = control.parent;

           if (!parent) return null;

           const otherControl = parent.get(controlName);

           if (!otherControl || !otherControl.value) return null;
           return control.value ? null : { requiredIfPresent: controlName, required: true }
       }
    }

    /**
     * Requires the current control if the given control name matches a specific value.
     *
     * @param controlName the control name to check for a specific value.
     * @param value the value to check against.
     * @returns null if not required, { requiredWhen: controlName, required: true } otherwise.
     */
    static requiredWhen(controlName: string, value: unknown): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const parent = control.parent;

            if (!parent) return null;

            const otherControl = parent.get(controlName);

            if (!otherControl || !otherControl.value) return null;
            return otherControl.value !== value ? null : { requiredWhen: controlName, required: true };
        }
    }
}
