import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from './_services/authentication.service';
import { SwUpdate } from '@angular/service-worker';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  updateAvailable = false;
  updateSub: Subscription = null;

  constructor(
    private authService: AuthenticationService,
    private updates: SwUpdate
  ) { }

  ngOnInit() {
    this.updateSub = this.updates.available.subscribe((event) => {
      this.updateAvailable = true;
    });
    if (this.authService.tokenExpired()) {
      this.authService.logout(true);
    }
  }

  ngOnDestroy() {
    if (this.updateSub) { this.updateSub.unsubscribe(); }
  }
}
