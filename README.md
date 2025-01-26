# ngx-validators ✅️

An extension of the Validators provided by the @angular team. Angular provides great out-of-the-box Validators for forms. However, they don't have validators when you need to depend on other FormControls. We extend the Validators provided by Angular and give more useful ones, particularly with cross-control functionality.

## Sample Usage
```ts
import { Validators } from "@marcellodotgg/ngx-validators";

class MyComponent {
  // first name is always required
  // start and end date is optional, unless you enter a start date or end date.
  form = new FormGroup({
    firstName: new FormControl("", Validators.required),
    startDate: new FormControl("", Validators.requiredIfTruthy("endDate")),
    endDate: new FormControl("", Validators.requiredIfTruthy("startDate")),
  });
}
```

