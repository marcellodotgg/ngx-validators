import {AbstractControl, ValidationErrors, ValidatorFn, Validators as CoreValidators} from '@angular/forms';
import {stateCodes} from "./postal/state-codes";
import {stateNames} from "./postal/state-names";

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
     *    field1: new FormControl('', Validators.if(mustRespond)),
     * });
     * @param condition the condition to determine if this is a required field or not.
     */
    static if(condition: boolean): ValidatorFn {
        return (_: AbstractControl): ValidationErrors | null => {
            return condition ? { if: true, required: true } : null;
        }
    }

    /**
     * The control is considered invalid if any of the control names have a truthy value.
     *
     * @example
     * const form = new FormGroup({
     *     field1: new FormControl('', Validators.any('field2', 'field3')),
     *     field2: new FormControl(''),
     *     field3: new FormControl('bar'),
     * });
     * @param controlNames the control names to search for a truthy value.
     */
    static any(...controlNames: string[]): ValidatorFn {
       return (control: AbstractControl): ValidationErrors | null => {
           if (!control.parent) {
               setTimeout(() => { control.updateValueAndValidity() });
               return null;
           }

           revalidate(control, controlNames);

           const controlHasValue = (controlName: string) => control.parent?.get(controlName)?.value;
           const isRequired = controlNames.some(controlHasValue)

           if (isRequired && control.value || !isRequired) return null;
           return { any: controlNames.filter(controlHasValue), required: true };
       }
    }

    /**
     * The control is considered invalid if all the control names have a truthy value.
     *
     * @example
     * const form = new FormGroup({
     *     field1: new FormControl('', Validators.all('field2', 'field3')),
     *     field2: new FormControl('foo'),
     *     field3: new FormControl('bar'),
     * });
     * @param controlNames the control names to search for a truthy value.
     */
    static all(...controlNames: string[]): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.parent) {
               setTimeout(() => { control.updateValueAndValidity() });
               return null;
           }

            revalidate(control, controlNames);

            const isRequired = controlNames.every(controlName => control.parent?.get(controlName)?.value);

            if (isRequired && control.value || !isRequired) return null;
            return { all: controlNames, required: true };
        }
    }

    /**
     * The control is considered invalid if any control pairs match.
     *
     * @example
     * const form = new FormGroup({
     *     field1: new FormControl('', Validators.anyEqual(['field2', 'foo'], ['field3', 'bar'])),
     *     field2: new FormControl('foo'),
     *     field3: new FormControl(''),
     * });
     * @param controlValuePairs a list of lists with 2 elements, `[controlName, controlValue]`
     */
    static anyEqual(...controlValuePairs: ControlValuePair[]): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.parent) {
                setTimeout(() => { control.updateValueAndValidity() });
                return null;
            }

            revalidate(control, controlValuePairs.map(pair => pair[0]));

            const pairMatch = (pair: ControlValuePair) => control.parent?.get(pair[0])?.value === pair[1];
            const isRequired = controlValuePairs.some(pairMatch);

            if (isRequired && control.value || !isRequired) return null;
            return { anyEqual: controlValuePairs.filter(pairMatch), required: true };
        }
    }

    /**
     * The control is considered valid if any of the given control pairs do not match.
     *
     * @example
     * const form = new FormGroup({
     *     field1: new FormControl('', Validators.allEqual(['field2', 'foo'], ['field3', 'bar'])),
     *     field2: new FormControl('foo'),
     *     field3: new FormControl('bar'),
     * });
     * @param controlValuePairs a list of lists with 2 elements, `[controlName, controlValue]`
     */
    static allEqual(...controlValuePairs: ControlValuePair[]): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
             if (!control.parent) {
                setTimeout(() => { control.updateValueAndValidity() });
                return null;
            }

            revalidate(control, controlValuePairs.map(pair => pair[0]));

            const isRequired = controlValuePairs.every(pair => control.parent?.get(pair[0])?.value === pair[1]);

            if (isRequired && control.value || !isRequired) return null;
            return { allEqual: controlValuePairs, required: true };
        }
    }

    /**
     * The control is considered valid if it is within the given range. Start is inclusive,
     * end is exclusive. Represented as [start, end).
     *
     * @example
     * const form = new FormGroup({
     *     age: new FormControl(67, Validators.range(18, 100))
     * });
     * @note value needs to be numeric, if it is a string, it will do it's best to perform a numeric
     *       comparison. If unable to, then it will be considered in range. For example, `null` would
     *       not return any errors.
     * @param start inclusive start
     * @param end exclusive end
     */
    static range(start: number, end: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (Number.isNaN(control.value)) return null;
           if (control.value === null || control.value === undefined || control.value === "") return null;
           if (Number(control.value) >= start && Number(control.value) < end) return null;
           return { outOfRange: true, range: [start, end], value: control.value };
        }
    }

    /**
     * The control is considered a valid zip code if it is in the 5 digit or 5 plus 4 digit
     * syntax. Therefore, if you prefer one over the other, you should pair this control
     * with a length check.
     *
     * @example
     * const form = new FormGroup({
     *     zip1: new FormControl('05434', Validators.zipCode),
     *     zip2: new FormControl('43424-2343', Validators.zipCode),
     * });
     * @note this will allow both 5 digit zip codes or 5 plus 4.
     * @param control
     */
     static zipCode(control: AbstractControl): ValidationErrors | null {
            if (!control.value || control.value.match(/^\d{5}(-\d{4})?$/)) return null;
            return { zipCode: true }
     }

    /**
     * The control is considered a valid state code as long as it matches a state code in America.
     *
     * @example
     * const form = new FormGroup({
     *     stateCode: new FormControl('CT', Validators.stateCode);
     * });
     * @note this is case-insensitive. Search time is constant.
     * @param control
     */
     static stateCode(control: AbstractControl): ValidationErrors | null {
        if (!control.value || stateCodes[control.value.toUpperCase()]) return null;
        return { stateCode: true }
     }

    /**
     * The control is considered a valid state name as long as it matches a state in America.
     *
     * @example
     * const form = new FormGroup({
     *     stateName: new FormControl('connecticut', Validators.stateName);
     * });
     * @note this is case-insensitive. Search time is constant.
     * @param control
     */
     static stateName(control: AbstractControl): ValidationErrors | null {
        if (!control.value || stateNames[control.value.toUpperCase()]) return null;
        return { stateName: true }
     }

    /**
     * The control is considered valid as long as it matches our criteria for an Address.
     *
     * @example
     * // All Valid
     * const form = new FormGroup({
     *    streetAddress1: new FormControl('123 Main St', Validators.streetAddress),
     *    streetAddress2: new FormControl('456 Elm Street Apt 5', Validators.streetAddress),
     *    streetAddress3: new FormControl('789-B Oak Rd', Validators.streetAddress),
     *    streetAddress4: new FormControl('101 First Ave, Unit #4', Validators.streetAddress),
     * });
     * // Invalid
     * form.get('streetAddress1').setValue('Apartment ##123');
     * @param control
     */
     static streetAddress(control: AbstractControl): ValidationErrors | null {
        if (!control.value || control.value.match(/^\d+(-[A-Za-z0-9]+)?\s+[A-Za-z0-9\s.,#\-]+$/)) return null;
        return { streetAddress: true };
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
