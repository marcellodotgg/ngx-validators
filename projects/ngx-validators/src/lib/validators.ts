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
    /**
     * The control is considered invalid if the given condition is met.
     *
     * @example
     * const mustRespond = true;
     *
     * const form = new FormGroup({
     *    field1: new FormControl('', Validators.requiredIf(mustRespond)),
     * });
     * @param condition the condition to determine if this is a required field or not.
     */
    static requiredIf(condition: boolean): ValidatorFn {
        return (_: AbstractControl): ValidationErrors | null => {
            return condition ? { requiredIf: true, required: true } : null;
        }
    }

    /**
     * The control is considered invalid if any of the control names have a truthy value.
     *
     * @example
     * const form = new FormGroup({
     *     field1: new FormControl('', Validators.requiredIfAll('field2', 'field3')),
     *     field2: new FormControl(''),
     *     field3: new FormControl('bar'),
     * });
     * @param controlNames the control names to search for a truthy value.
     */
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

    /**
     * The control is considered invalid if all the control names have a truthy value.
     *
     * @example
     * const form = new FormGroup({
     *     field1: new FormControl('', Validators.requiredIfAll('field2', 'field3')),
     *     field2: new FormControl('foo'),
     *     field3: new FormControl('bar'),
     * });
     * @param controlNames the control names to search for a truthy value.
     */
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

    /**
     * The control is considered invalid if any control pairs match.
     *
     * @example
     * const form = new FormGroup({
     *     field1: new FormControl('', Validators.requiredIfAllEqual(['field2', 'foo'], ['field3', 'bar'])),
     *     field2: new FormControl('foo'),
     *     field3: new FormControl(''),
     * });
     * @param controlValuePairs a list of lists with 2 elements, `[controlName, controlValue]`
     */
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

    /**
     * The control is considered valid if any of the given control pairs do not match.
     *
     * @example
     * const form = new FormGroup({
     *     field1: new FormControl('', Validators.requiredIfAllEqual(['field2', 'foo'], ['field3', 'bar'])),
     *     field2: new FormControl('foo'),
     *     field3: new FormControl('bar'),
     * });
     * @param controlValuePairs a list of lists with 2 elements, `[controlName, controlValue]`
     */
    static requiredIfAllEqual(...controlValuePairs: ControlValuePair[]): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
             if (!control.parent) {
                setTimeout(() => { control.updateValueAndValidity() });
                return null;
            }

            revalidate(control, controlValuePairs.map(pair => pair[0]));

            const isRequired = controlValuePairs.every(pair => control.parent?.get(pair[0])?.value === pair[1]);

            if (isRequired && control.value || !isRequired) return null;
            return { requiredIfAllEqual: controlValuePairs, required: true };
        }
    }

    /**
     * The control is considered valid if it is within the given range. Start is inclusive,
     * end is exclusive. Represented as [start, end).
     *
     * @example
     * const form = new FormGroup({
     *     age: new FormControl(67, Validators.inRange(18, 100))
     * });
     * @note value needs to be numeric, if it is a string, it will do it's best to perform a numeric
     *       comparison. If unable to, then it will be considered in range. For example, `null` would
     *       not return any errors.
     * @param start inclusive start
     * @param end exclusive end
     */
    static inRange(start: number, end: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (Number.isNaN(control.value)) return null;
           if (control.value === null || control.value === undefined || control.value === "") return null;
           if (Number(control.value) >= start && Number(control.value) < end) return null;
           return { outOfRange: true, range: [start, end], value: control.value };
        }
    }
}

function revalidate(control: any, controlNames: string[]): void {
    if (!(control as any)['_revalidationSetup']) {
        (control as any)['_revalidationSetup'] = true;
        controlNames.forEach((depControlName) => {
            control.parent?.get(depControlName)?.valueChanges.subscribe(() => {
                control.updateValueAndValidity({ emitEvent: false });
            });
        });
    }
}

type ControlValuePair = [controlName: string, value: any];
