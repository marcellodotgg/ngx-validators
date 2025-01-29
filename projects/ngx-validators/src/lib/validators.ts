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
 *   firstName: new FormControl('', Validators.requiredIfAny('lastName'));
 *   lastName: new FormControl('');
 * });
 * ```
 */
export class Validators extends CoreValidators {
    static requiredIf(condition: boolean): ValidatorFn {
        return (_: AbstractControl): ValidationErrors | null => {
            return condition ? { requiredIf: true, required: true } : null;
        }
    }

    // Checks if any control has a truthy value
    static requiredIfAny(...controlNames: string[]): ValidatorFn {
       return (control: AbstractControl): ValidationErrors | null => {
           if (!control.parent) return null;

           const controlHasValue = (controlName: string) => !!control.parent.get(controlName)?.value;
           const isValid = controlNames.some(controlHasValue)

           if (isValid) return null;
           return { requiredIfAny: controlNames.filter(controlHasValue), required: true };
       }
    }

    // Checks if all controls have a truthy value
    static requiredIfAll(...controlNames: string[]): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.parent) return null;

            const isValid = controlNames.every(controlName => !!control.parent.get(controlName)?.value);

            if (isValid) return null;
            return { requiredIfAll: controlNames, required: true };
        }
    }

    static requiredIfAnyEqual(...controlValuePairs: ControlValuePair[]): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.parent) return null;

            const pairMatch = (pair: ControlValuePair) => control.parent.get(pair[0])?.value === pair[1];
            const isValid = controlValuePairs.some(pairMatch);

            if (isValid) return null;
            return { requiredIfAnyEqual: controlValuePairs.filter(pairMatch), required: true };
        }
    }


    static requiredIfAllEqual(...controlValuePairs: ControlValuePair[]): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.parent) return null;

            const isValid = controlValuePairs.every(pair => control.parent.get(pair[0])?.value === pair[1]);

            if (isValid) return null;
            return { requiredIfAllEqual: true, required: true };
        }
    }
}

type ControlValuePair = [controlName: string, value: any];

