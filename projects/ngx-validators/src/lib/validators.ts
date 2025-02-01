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

    static requiredIfAny(...controlNames: string[]): ValidatorFn {
       return (control: AbstractControl): ValidationErrors | null => {
           if (!control.parent) {
               setTimeout(() => { control.updateValueAndValidity() });
               return null;
           }

           revalidate(control, controlNames);

           const controlHasValue = (controlName: string) => control.parent?.get(controlName)?.value;
           const isRequired = controlNames.some(controlHasValue)

           if (isRequired && control.value || !isRequired) return null;
           return { requiredIfAny: controlNames.filter(controlHasValue), required: true };
       }
    }

    static requiredIfAll(...controlNames: string[]): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.parent) {
               setTimeout(() => { control.updateValueAndValidity() });
               return null;
           }

            revalidate(control, controlNames);

            const isRequired = controlNames.every(controlName => control.parent?.get(controlName)?.value);

            if (isRequired && control.value || !isRequired) return null;
            return { requiredIfAll: controlNames, required: true };
        }
    }

    static requiredIfAnyEqual(...controlValuePairs: ControlValuePair[]): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.parent) {
                setTimeout(() => { control.updateValueAndValidity() });
                return null;
            }

            revalidate(control, controlValuePairs.map(pair => pair[0]));

            const pairMatch = (pair: ControlValuePair) => control.parent?.get(pair[0])?.value === pair[1];
            const isRequired = controlValuePairs.some(pairMatch);

            if (isRequired && control.value || !isRequired) return null;
            return { requiredIfAnyEqual: controlValuePairs.filter(pairMatch), required: true };
        }
    }

    static requiredIfAllEqual(...controlValuePairs: ControlValuePair[]): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
             if (!control.parent) {
                setTimeout(() => { control.updateValueAndValidity() });
                return null;
            }

            revalidate(control, controlValuePairs.map(pair => pair[0]));

            const isRequired = controlValuePairs.every(pair => control.parent?.get(pair[0])?.value === pair[1]);

            if (isRequired && control.value || !isRequired) return null;
            return { requiredIfAllEqual: true, required: true };
        }
    }
}

function revalidate(control: any, controlNames: string[]): void {
    if (!(control as any)['_revalidationSetup']) {
        (control as any)['_revalidationSetup'] = true;
        console.log('HELP')
        controlNames.forEach((depControlName) => {
            control.parent?.get(depControlName)?.valueChanges.subscribe(() => {
                control.updateValueAndValidity({ emitEvent: false });
            });
        });
    }
}

type ControlValuePair = [controlName: string, value: any];

