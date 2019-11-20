import { Component, OnInit } from '@angular/core';
import { WorkoutService } from 'src/app/_services/workout.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { User } from 'src/app/_models/User';
import { Program } from '../../_models/Program';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent implements OnInit {

  programs: Program[];
  currentUser: User = {} as User;
  loaded = false;
  constructor(
    private service: WorkoutService,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.service.getAll('Programs').subscribe((data: Program[]) => {
      this.programs = data;
      this.authenticationService.currentUser.subscribe(x => {
        this.currentUser = x;
        this.loaded = true;
      });
    });
  }
}
