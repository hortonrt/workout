import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { ExerciseType } from 'src/app/_models/ExerciseType';
import { MuscleType } from 'src/app/_models/MuscleType';
import { Equipment } from 'src/app/_models/Equipment';
import { Exercise } from 'src/app/_models/Exercise';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutService } from 'src/app/_services/workout.service';
import { Subscription } from 'rxjs';
import { IconDefinition, faSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-create-exercise',
  templateUrl: './create-exercise.component.html',
  styleUrls: ['./create-exercise.component.scss']
})
export class CreateExerciseComponent implements OnInit, OnDestroy {
  exerciseTypes: ExerciseType[] = [] as ExerciseType[];
  muscleTypes: MuscleType[] = [] as MuscleType[];
  equipment: Equipment[] = [] as Equipment[];
  exercise: Exercise = {} as Exercise;
  exerciseForm: FormGroup;
  loaded = false;
  error = '';
  saving = false;
  listSub: Subscription = null;
  routeSub: Subscription = null;
  exSub: Subscription = null;
  postSub: Subscription = null;
  faSquare: IconDefinition = faSquare;
  faCheckSquare: IconDefinition = faCheckSquare;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private service: WorkoutService,
    private router: Router
  ) { }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.exerciseForm.pristine) {
      $event.returnValue = true;
    }
  }

  ngOnDestroy() {
    if (this.listSub) { this.listSub.unsubscribe(); }
    if (this.routeSub) { this.routeSub.unsubscribe(); }
    if (this.exSub) { this.exSub.unsubscribe(); }
    if (this.postSub) { this.postSub.unsubscribe(); }
  }

  ngOnInit() {
    this.listSub = this.service.getAll('Lists').subscribe((lists: any) => {
      this.equipment = lists.Equipment;
      this.muscleTypes = lists.MuscleTypes;
      this.exerciseTypes = lists.ExerciseTypes;

      this.routeSub = this.route.paramMap.subscribe(params => {
        if (Number(params.get('id')) > 0) {
          this.exSub = this.service.get('Exercises', + Number(params.get('id'))).subscribe((data: Exercise) => {
            this.exercise = data;
            this.setUpForm();
          });
        } else {
          this.exercise.ExerciseID = 0;
          this.setUpForm();
        }
      });
    });
  }

  setUpForm() {
    if (this.exercise && this.exercise.ExerciseID) {
      this.exerciseForm = this.formBuilder.group({
        ExerciseID: [this.exercise.ExerciseID, Validators.required],
        Name: [this.exercise.Name, Validators.required],
        ExerciseTypeID: [
          this.exercise.ExerciseTypeID,
          Validators.required,
        ],
        ExerciseType: [this.exercise.ExerciseType, Validators.required],
        MuscleTypes: new FormArray([]),
        Equipment: new FormArray([]),
      });
    } else {
      this.exerciseForm = this.formBuilder.group({
        ExerciseID: [0, Validators.required],
        Name: ['', Validators.required],
        ExerciseTypeID: [-1],
        ExerciseType: [],
        MuscleTypes: new FormArray([]),
        Equipment: new FormArray([]),
      });
    }
    this.initForm();
    this.loaded = true;
  }

  initForm() {
    this.muscleTypes.map(muscleType => {
      const mt =
        this.exercise.MuscleTypes &&
        this.exercise.MuscleTypes.find(
          emt => emt.MuscleTypeID === muscleType.MuscleTypeID,
        );
      if (this.exercise.MuscleTypes && this.exercise.MuscleTypes.length && mt) {
        // exists
        const mtControl = this.exerciseForm.controls.MuscleTypes as FormArray;
        mtControl.push(
          this.formBuilder.group({
            ExerciseMuscleTypeID: [
              mt.ExerciseMuscleTypeID,
              Validators.required,
            ],
            ExerciseID: [mt.ExerciseID, Validators.required],
            MuscleTypeID: [
              { value: mt.MuscleTypeID, disabled: true },
              Validators.required,
            ],
            MuscleTypeName: [mt.MuscleTypeName],
            IsPrimary: [mt.IsPrimary],
            IsWorked: [mt.IsWorked],
          }),
        );
      } else {
        // add
        const mtControl = this.exerciseForm.controls.MuscleTypes as FormArray;
        mtControl.push(
          this.formBuilder.group({
            ExerciseMuscleTypeID: [0, Validators.required],
            ExerciseID: [this.exercise.ExerciseID, Validators.required],
            MuscleTypeID: [
              { value: muscleType.MuscleTypeID, disabled: true },
              Validators.required,
            ],
            MuscleTypeName: [muscleType.Name],
            IsPrimary: [false],
            IsWorked: [false],
          }),
        );
      }
    });
    this.equipment.map(equip => {
      const ee =
        this.exercise.Equipment &&
        this.exercise.Equipment.find(
          emt => emt.EquipmentID === equip.EquipmentID,
        );
      if (this.exercise.Equipment && this.exercise.Equipment.length && ee) {
        // exists
        const eqControl = this.exerciseForm.controls.Equipment as FormArray;
        eqControl.push(
          this.formBuilder.group({
            ExerciseEquipmentID: [ee.ExerciseEquipmentID, Validators.required],
            ExerciseID: [ee.ExerciseID, Validators.required],
            EquipmentID: [
              { value: ee.EquipmentID, disabled: true },
              Validators.required,
            ],
            EquipmentName: [ee.EquipmentName],
            IsOptional: [ee.IsOptional],
            IsUsed: [ee.IsUsed],
          }),
        );
      } else {
        // add
        const mtControl = this.exerciseForm.controls.Equipment as FormArray;
        mtControl.push(
          this.formBuilder.group({
            ExerciseEquipmentID: [0, Validators.required],
            ExerciseID: [this.exercise.ExerciseID, Validators.required],
            EquipmentID: [
              { value: equip.EquipmentID, disabled: true },
              Validators.required,
            ],
            EquipmentName: [equip.Name],
            IsOptional: [false],
            IsUsed: [false],
          }),
        );
      }
    });
  }

  onSubmit() {
    this.error = '';

    if (this.exerciseForm.invalid) {
      this.saving = false;
      return;
    }
    this.saving = true;
    const payload: Exercise = this.exerciseForm.getRawValue();
    payload.MuscleTypes.map(x => {
      delete x.MuscleType;
      delete x.MuscleTypeName;
      delete x.Exercise;
    });
    payload.Equipment.map(x => {
      delete x.Equipment;
      delete x.EquipmentName;
      delete x.Exercise;
    });
    delete payload.ExerciseType;
    payload.MuscleTypes = payload.MuscleTypes.filter(x => x.IsWorked);
    payload.Equipment = payload.Equipment.filter(x => x.IsUsed);
    this.postSub = this.service.post('Exercises', payload).subscribe(
      (data: Exercise) => {
        this.exerciseForm.markAsPristine();
        this.router.navigate(['exercises']);
      },
      error => {
        this.error = error;
        this.saving = false;
      },
    );
  }
}
