import { Component, OnInit } from '@angular/core';
import { faBars, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services/authentication.service';
// import { SwUpdate } from '@angular/service-worker';

import { faSync } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  constructor(private router: Router, private authenticationService: AuthenticationService
    // , private updateService: SwUpdate
  ) { }
  faBars = faBars;
  isCollapsed = false;
  worker = false;
  checking = false;
  faSync: IconDefinition = faSync;

  ngOnInit() {
    this.isCollapsed = false;
    this.worker = false; // this.updateService.isEnabled;
    // if (this.worker) {
    //   this.updateService.available.subscribe(event => {
    //     this.checking = false;
    //   });
    // }
  }

  logout() {
    this.isCollapsed = false;
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  // update() {
  //   if (this.updateService.isEnabled) {
  //     this.checking = true;
  //     this.updateService.checkForUpdate().then(() => {
  //       setTimeout(() => {
  //         if (this.checking) {
  //           this.isCollapsed = false;
  //           this.checking = false;
  //           alert('No Update Available');
  //         }
  //       }, 3000);
  //     });
  //   }
  // }
}
