import { Component, OnInit } from '@angular/core';
import { Routine } from 'src/app/_models/Routine';
import { User } from 'src/app/_models/User';
import { ActivatedRoute } from '@angular/router';
import { WorkoutService } from 'src/app/_services/workout.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { RoutineBlockSet } from 'src/app/_models/RoutineBlockSet';

@Component({
  selector: 'app-view-routine',
  templateUrl: './view-routine.component.html',
  styleUrls: ['./view-routine.component.scss']
})
export class ViewRoutineComponent implements OnInit {
  routine: Routine = {} as Routine;
  currentUser: User = {} as User;
  programroutineid: number;
  loaded = false;
  maxSets = 0;
  constructor(
    private route: ActivatedRoute,
    private service: WorkoutService,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.route.paramMap.subscribe(params => {
        this.routine.RoutineID = Number(params.get('routineid'));
        this.programroutineid = Number(params.get('programroutineid') || -1);
        this.service
          .get('Routines', this.routine.RoutineID)
          .subscribe((data: Routine) => {
            // data.Blocks.map(x => {
            //   this.maxSets = Math.max(x.Sets.length, this.maxSets);
            // });
            // data.Blocks.map(x => {
            //   if (x.Sets.length < this.maxSets) {
            //     for (let i = 0; i <= this.maxSets - x.Sets.length; i++) {
            //       x.Sets.push({} as RoutineBlockSet);
            //     }
            //   }
            // });
            this.routine = data;
            this.loaded = true;
          });
      });
    });
  }
}
