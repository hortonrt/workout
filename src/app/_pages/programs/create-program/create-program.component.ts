import { Component, OnInit, HostListener } from '@angular/core';
import { Program } from 'src/app/_models/Program';
import { Routine } from 'src/app/_models/Routine';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutService } from 'src/app/_services/workout.service';

@Component({
  selector: 'app-create-program',
  templateUrl: './create-program.component.html',
  styleUrls: ['./create-program.component.scss']
})
export class CreateProgramComponent implements OnInit {
  program: Program = {} as Program;
  routines: Routine[] = [] as Routine[];
  programForm: FormGroup;
  loaded = false;
  saving = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private service: WorkoutService,
    private router: Router,
  ) { }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.programForm.pristine) {
      $event.returnValue = true;
    }
  }

  ngOnInit() {
    this.service.getAll('Routines').subscribe((data: Routine[]) => {
      this.routines = data;
    });
    this.route.paramMap.subscribe(params => {
      this.program.ProgramID = Number(params.get('id'));
      if (this.program.ProgramID > 0) {
        this.service
          .get('Programs', this.program.ProgramID)
          .subscribe((data: Program) => {
            this.program = data;
            this.setUpForm();
          });
      } else {
        this.setUpForm();
      }
    });
  }

  setUpForm() {
    this.programForm = this.formBuilder.group({
      ProgramID: [this.program.ProgramID, Validators.required],
      Name: [this.program.Name, Validators.required],
      Phases: new FormArray([]),
    });
    this.initForm();
    this.loaded = true;
  }

  initForm() {
    if (this.program.Phases && this.program.Phases.length) {
      const phasesControl = this.programForm.controls.Phases as FormArray;
      this.program.Phases.map((phase, phaseX) => {
        phasesControl.push(
          this.formBuilder.group({
            ProgramPhaseID: [phase.ProgramPhaseID, Validators.required],
            ProgramDayID: [this.program.ProgramID, Validators.required],
            PhaseOrder: [phase.PhaseOrder, Validators.required],
            Name: [phase.Name, Validators.required],
            Days: new FormArray([]),
          }),
        );
        if (phase.Days.length) {
          const daysGroup: any = phasesControl.controls[phaseX];
          const daysControl = daysGroup.controls.Days as FormArray;
          phase.Days.map((day, dayX) => {
            daysControl.push(
              this.formBuilder.group({
                ProgramDayID: [day.ProgramDayID, Validators.required],
                ProgramPhaseID: [phase.ProgramPhaseID, Validators.required],
                DayNumber: [day.DayNumber, Validators.required],
                Routines: new FormArray([]),
              }),
            );
            if (day.Routines.length) {
              const routinesGroup: any = daysControl.controls[dayX];
              const routinesControl = routinesGroup.controls.Routines as FormArray;
              day.Routines.map((routine, routineX) => {
                routinesControl.push(
                  this.formBuilder.group({
                    ProgramRoutineID: [routine.ProgramRoutineID, Validators.required],
                    ProgramDayID: [day.ProgramDayID, Validators.required],
                    RoutineOrder: [routine.RoutineOrder, Validators.required],
                    RoutineID: [routine.RoutineID, Validators.required],
                    Routine: [routine.Routine, Validators.required],
                  }),
                );
              });
            }
          });
        }
      });
    }
  }

  addPhase() {
    const control = this.programForm.controls.Phases as FormArray;
    control.push(
      this.formBuilder.group({
        ProgramPhaseID: [0, Validators.required],
        ProgramID: [this.program.ProgramID, Validators.required],
        PhaseOrder: [this.program.Phases.length + 1, Validators.required],
        Name: ['', Validators.required],
        Days: new FormArray([]),
      }),
    );
  }

  addDay(phase) {
    const control = phase.controls.Days as FormArray;
    control.push(
      this.formBuilder.group({
        ProgramDayID: [0, Validators.required],
        ProgramPhaseID: [phase.value.ProgramPhaseID, Validators.required],
        DayNumber: [phase.controls.Days.length + 1, Validators.required],
        Routines: new FormArray([]),
      }),
    );
  }
  addRoutine(day) {
    const control = day.controls.Routines as FormArray;
    control.push(
      this.formBuilder.group({
        ProgramRoutineID: [0, Validators.required],
        ProgramDayID: [day.value.ProgramDayID, Validators.required],
        RoutineOrder: [day.controls.Routines.length + 1, Validators.required],
        RoutineID: [-1, Validators.required],
        Routine: [{} as Routine, Validators.required],
      }),
    );
  }

  delete(type, id, array: FormArray, index) {
    const conf = confirm('Are you sure?');
    if (conf) {
      this.service.delete('Programs', id, type).subscribe(x => {
        if (type === 'Programs') {
          this.router.navigate(['programs']);
        } else {
          array.removeAt(index);
        }
      });
    }
  }

  onSubmit() {
    this.error = '';
    if (this.programForm.invalid) {
      this.saving = false;
      this.error = 'Invalid Entry';
      return;
    }
    this.saving = true;
    const payload: Program = this.programForm.getRawValue();
    payload.Phases.map((x: any) => {
      delete x.ProgramDayID;
      x.Days.map(v => {
        v.Routines.map(r => {
          delete r.Routine;
        });
      });
    });
    this.service.post('Programs', payload).subscribe(
      (data: Program) => {
        this.programForm.markAsPristine();
        if (this.program.ProgramID === 0) {
          this.router.navigate(['program/edit/', data.ProgramID]);
        } else {
          this.router.navigate(['program/view/', this.program.ProgramID]);
        }
      },
      error => {
        this.error = error;
        this.saving = false;
      },
    );
  }
}
