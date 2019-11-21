import { Component, OnInit } from '@angular/core';
import {
  faChartPie,
  faDumbbell,
  faCalendarCheck,
  faCogs,
  faWeight,
  faRunning,
  faUser,
  faCalendarAlt
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
  faChart = faChartPie;
  faCalendarCheck = faCalendarCheck;
  faCogs = faCogs;
  faWeight = faWeight;
  faRunning = faRunning;
  faUser = faUser;
  faCalendarAlt = faCalendarAlt;

  constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.currentUser.subscribe(
      (x: User) => (this.user = x),
    );
  }

  ngOnInit() { }

}
