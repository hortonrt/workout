import { Injectable, ApplicationRef } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { interval, concat } from 'rxjs';
import { first } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  constructor(private appRef: ApplicationRef, private updates: SwUpdate) {
    // Allow the app to stabilize first, before starting polling for updates with `interval()`.
    const appIsStable$ = this.appRef.isStable.pipe(first(isStable => isStable === true));
    const everySixHours$ = interval(6 * 60 * 60 * 1000);
    const everySixHoursOnceAppIsStable$ = concat(appIsStable$, everySixHours$);
    everySixHoursOnceAppIsStable$.subscribe(() => this.updates.checkForUpdate());
    this.updates.checkForUpdate();
  }


  checkForUpdate() {
    if (this.updates.isEnabled) {
      this.updates.checkForUpdate();
    }
  }
}
