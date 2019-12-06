import { Component, OnInit } from '@angular/core';
import {
  faChartPie,
  faCalendarCheck,
  faCogs,
  faWeight,
  faRunning,
  faUser,
  faCalendarAlt,
  faBolt
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  links = [
    { name: 'Programs', icon: faCalendarCheck, route: ['/programs'], css: 'btn-workout text-white' },
    { name: 'Routines', icon: faCogs, route: ['/routines'], css: 'btn-workout text-white' },
    { name: 'Exercises', icon: faRunning, route: ['/exercises'], css: 'btn-workout text-white' },
    { name: 'User History', icon: faCalendarAlt, route: ['/history'], css: 'btn-workout text-white' },
    { name: 'Measurements', icon: faWeight, route: ['/measurements'], css: 'btn-workout text-white' },
    { name: 'Profile', icon: faUser, route: ['/profile'], css: 'btn-workout text-white' },
    { name: 'Stats', icon: faChartPie, route: ['/stats'], css: 'btn-workout text-white' },
    { name: 'Workout Now', icon: faBolt, route: ['/custom'], css: 'btn-success text-white' },
  ];

  constructor() { }

  ngOnInit() { }

}
