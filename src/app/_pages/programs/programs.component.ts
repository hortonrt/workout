import { Component, OnInit, OnDestroy } from '@angular/core';
import { WorkoutService } from 'src/app/_services/workout.service';
import { Program } from '../../_models/Program';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent implements OnInit, OnDestroy {

  programs: Program[];
  progSub: Subscription = null;
  loaded = false;
  constructor(
    private service: WorkoutService,
  ) { }

  ngOnInit() {
    this.progSub = this.service.getAll('UserPrograms').subscribe((data: Program[]) => {
      this.programs = data;
      this.loaded = true;
    });
  }

  ngOnDestroy() {
    if (this.progSub) { this.progSub.unsubscribe(); }
  }
}
