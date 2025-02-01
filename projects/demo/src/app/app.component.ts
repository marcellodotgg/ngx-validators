import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import { Validators } from "../../../ngx-validators/src/public-api";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    canProvideEmail: new FormControl(''),
    email: new FormControl('', [Validators.email, Validators.requiredIfAllEqual(['canProvideEmail', true])]),
    gender: new FormControl('', Validators.required),
    genderOther: new FormControl('', Validators.requiredIfAllEqual(['gender', 'other'])),
  })
}
