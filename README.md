# ngx-validators ✅️

An extension of the Validators provided by the @angular team. Angular provides great out-of-the-box Validators for forms. However, they don't have validators when you need to depend on other FormControls. We extend the Validators provided by Angular and give more useful ones, particularly with cross-control functionality.

While this is on NPM and available to install as a dependency, I encourage you to copy the file and move into your code base to avoid a dependency.

## Sample Usage
```ts
import { Validators } from "@marcellodotgg/ngx-validators";

class MyComponent {
  // first name is always required
  // start and end date is optional, unless you enter a start date or end date.
  form = new FormGroup({
    firstName: new FormControl("", Validators.required),
    startDate: new FormControl("", Validators.requiredIfAny("endDate")),
    endDate: new FormControl("", Validators.requiredIfAny("startDate")),
  });
}
```

## API
* `requiredIf(condition: string)`
* `requiredIfAny(...controlNames: string[])`
* `requiredIfAll(...controlNames: string[])`
* `requiredIfAnyEqual(...controlPairs: [controlName, value][])`
* `requiredIfAllEqual(...controlPairs: [controlName, value][])`
* `inRange(start: number, end: number)`
* `lt(controlName: string, opts = { includeFalsy: false })`
* `lte(controlName: string, opts = { includeFalsy: false })`
* `gt(controlName: string, opts = { includeFalsy: false })`
* `gte(controlName: string, opts = { includeFalsy: false })`

## Future Work
* `profanity`
* `zipCode`
* `zipCodePlus4`
* `stateCode(country = 'USA')`
* `stateName(country = 'USA')`
* `address`

## Contributing
Pull Requests are welcome. We require passing tests and descriptions should be filled out. In addition, update any documentation if needed.

PRs may be closed for any reason.
