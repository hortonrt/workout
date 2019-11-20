import { Component, OnInit } from '@angular/core';
import {
  faChartLine,
  faDumbbell,
  faCalendarCheck,
  faCogs,
  faWeight,
  faRunning,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { User } from 'src/app/_models/User';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: User = null;
  faDumbbell = faDumbbell;
  faChartLine = faChartLine;
  faCalendarCheck = faCalendarCheck;
  faCogs = faCogs;
  faWeight = faWeight;
  faRunning = faRunning;
  faUser = faUser;

  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(
      (x: User) => (this.user = x),
    );
  }

  ngOnInit() { }

}
