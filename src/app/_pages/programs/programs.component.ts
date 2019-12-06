import { Component, OnInit, OnDestroy } from '@angular/core';
import { WorkoutService } from 'src/app/_services/workout.service';
import { Program } from '../../_models/Program';
import { Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NeweditProgramComponent } from './newedit/newedit-program/newedit-program.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html'
})
export class ProgramsComponent implements OnInit, OnDestroy {

  programs: Program[];
  progSub: Subscription = null;
  bsModalRef: BsModalRef;
  loaded = false;
  constructor(
    private service: WorkoutService,
    private modalService: BsModalService,
    private router: Router
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

  neweditProgram() {
    const initialState = {
      obj: null,
      finish: (program) => {
        if (program.ProgramID > 0) {
          this.router.navigate(['/program/view', program.ProgramID], { queryParams: { edit: '1' } });
        }
      }
    };
    this.bsModalRef = this.modalService.show(NeweditProgramComponent, { initialState, ignoreBackdropClick: true });
  }

}
