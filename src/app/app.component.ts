import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './_services/authentication.service';
import { Subscription } from 'rxjs';
import { User } from './_models/User';
import { UpdateService } from './_services/update.service';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  currentUser = null;
  userSub: Subscription = null;
  updateAvailable = false;

  constructor(private authService: AuthenticationService, private updates: SwUpdate) {
    this.updates.available.subscribe((event) => {
      this.updateAvailable = true;
    });
  }

  ngOnInit() {
    const self = this;
    this.userSub = this.authService.currentUser.subscribe((user: User) => {
      self.currentUser = user;
    });
  }

}
