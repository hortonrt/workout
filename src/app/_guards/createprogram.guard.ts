import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { CreateProgramComponent } from '../_pages/programs/create-program/create-program.component';

@Injectable({
  providedIn: 'root',
})
export class CreateProgramGuard
  implements CanDeactivate<CreateProgramComponent> {
  constructor() { }
  canDeactivate(component: CreateProgramComponent) {
    if (!component.programForm.pristine) {
      return confirm(
        'Are you sure you want to leave. All progress will be lost.',
      );
    }
    return true;
  }
}
