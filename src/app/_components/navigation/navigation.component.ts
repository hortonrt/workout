import { Component, OnInit, OnDestroy } from '@angular/core';
import { faBars, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { SwUpdate } from '@angular/service-worker';

import { faSync } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, OnDestroy {
  constructor(private router: Router, private authenticationService: AuthenticationService, private updateService: SwUpdate
  ) { }
  faBars = faBars;
  isCollapsed = true;
  worker = false;
  checking = false;
  upSub: Subscription = null;
  userSub: Subscription = null;
  faSync: IconDefinition = faSync;
  show = false;

  ngOnInit() {
    this.worker = this.updateService.isEnabled;
    if (this.worker) {
      this.upSub = this.updateService.available.subscribe(event => {
        this.checking = false;
      });
    }
    this.userSub = this.authenticationService.currentUser.subscribe(user => {
      if (user) { this.show = true; } else { this.show = false; }
    });
  }

  ngOnDestroy() {
    if (this.upSub) { this.upSub.unsubscribe(); }
    if (this.userSub) { this.userSub.unsubscribe(); }
  }

  logout() {
    this.isCollapsed = true;
    this.router.navigate(['/login']);
  }

  update() {
    if (this.updateService.isEnabled) {
      this.checking = true;
      this.updateService.checkForUpdate().then(() => {
        setTimeout(() => {
          if (this.checking) {
            this.isCollapsed = true;
            this.checking = false;
            alert('No Update Available');
          }
        }, 1000);
      });
    }
  }
}
