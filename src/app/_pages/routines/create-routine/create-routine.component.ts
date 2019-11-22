import { Component, OnInit, HostListener } from '@angular/core';
import { Routine } from 'src/app/_models/Routine';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { BlockType } from 'src/app/_models/BlockType';
import { RepType } from 'src/app/_models/RepType';
import { WeightType } from 'src/app/_models/WeightType';
import { SideType } from 'src/app/_models/SideType';
import { Exercise } from 'src/app/_models/Exercise';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutService } from 'src/app/_services/workout.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ExercisePickerComponent } from 'src/app/_components/exercise-picker/exercise-picker.component';

@Component({
  selector: 'app-create-routine',
  templateUrl: './create-routine.component.html',
  styleUrls: ['./create-routine.component.scss']
})
export class CreateRoutineComponent implements OnInit {
  bsModalRef: BsModalRef;
  routine: Routine = {} as Routine;
  routineForm: FormGroup;
  loaded = false;
  saving = false;
  blockTypes: BlockType[];
  repTypes: RepType[];
  weightTypes: WeightType[];
  sideTypes: SideType[];
  exercises: Exercise[];
  error = '';
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private service: WorkoutService,
    private router: Router,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.service.getAll('Exercises').subscribe((Exercises: any[]) => {
      this.service.getAll('Lists').subscribe((lists: any) => {
        this.blockTypes = lists.BlockTypes;
        this.exercises = Exercises;
        this.repTypes = lists.RepTypes;
        this.weightTypes = lists.WeightTypes;
        this.sideTypes = lists.SideTypes;
        this.route.paramMap.subscribe(params => {
          this.routine.RoutineID = Number(params.get('id'));
          if (this.routine.RoutineID > 0) {
            this.service.get('Routines', this.routine.RoutineID).subscribe((data: Routine) => {
              this.routine = data;
              this.setUpForm();
            });
          } else {
            this.setUpForm();
          }
        });
      });
    });
  }


  selectExercise(ex, ind) {
    const initialState = {
      exercise: ex, pickExercise: (exercise) => {
        const newex = Object.assign({}, exercise);
        delete newex.Equipment;
        delete newex.MuscleTypes;
        delete newex.PrimaryMuscleGroup;
        delete newex.PrimaryMuscleType;
        newex.ExerciseType = { ExerciseTypeID: newex.ExerciseTypeID, Name: newex.ExerciseTypeName };
        delete newex.ExerciseTyoeID;
        delete newex.ExerciseTypeName;
        ex.controls.Exercise.patchValue(newex);
        ex.patchValue({ ExerciseID: exercise.ExerciseID });
      }
    };
    this.bsModalRef = this.modalService.show(ExercisePickerComponent, { initialState });
  }

  setUpForm() {
    this.routineForm = this.formBuilder.group({
      RoutineID: [this.routine.RoutineID, Validators.required],
      Name: [this.routine.Name, Validators.required],
      Blocks: new FormArray([]),
    });
    this.initForm();
    this.loaded = true;
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.routineForm.pristine) {
      $event.returnValue = true;
    }
  }

  initForm() {
    if (this.routine.Blocks) {
      const blocksControl = this.routineForm.controls.Blocks as FormArray;
      this.routine.Blocks.map((block, blockX) => {
        blocksControl.push(
          this.formBuilder.group({
            RoutineBlockID: [block.RoutineBlockID, Validators.required],
            RoutineID: [this.routine.RoutineID, Validators.required],
            BlockTypeID: [block.BlockType.BlockTypeID, Validators.required],
            BlockType: [block.BlockType, Validators.required],
            BlockOrder: [block.BlockOrder, Validators.required],
            ProgressDiff: [block.ProgressDiff, Validators.required],
            ProgressType: [block.ProgressType, Validators.required],
            Sets: new FormArray([]),
          }),
        );
        if (block.Sets.length) {
          const setsGroup: any = blocksControl.controls[blockX];
          const setsControl = setsGroup.controls.Sets as FormArray;
          block.Sets.map((set, setX) => {
            setsControl.push(
              this.formBuilder.group({
                RoutineBlockSetID: [set.RoutineBlockSetID, Validators.required],
                RoutineBlockID: [block.RoutineBlockID, Validators.required],
                SetNumber: [set.SetNumber, Validators.required],
                Exercises: new FormArray([]),
              }),
            );
            if (set.Exercises.length) {
              const exerciseGroup: any = setsControl.controls[setX];
              const exerciseControl = exerciseGroup.controls
                .Exercises as FormArray;
              set.Exercises.map((exercise, exerciseX) => {
                exerciseControl.push(
                  this.formBuilder.group({
                    RoutineBlockSetExerciseID: [exercise.RoutineBlockSetExerciseID, Validators.required],
                    RoutineBlockSetID: [set.RoutineBlockSetID, Validators.required],
                    ExerciseID: [exercise.Exercise.ExerciseID, Validators.required],
                    Exercise: [exercise.Exercise, Validators.required],
                    RepTypeID: [exercise.RepType.RepTypeID, Validators.required],
                    RepType: [exercise.RepType, Validators.required],
                    Reps: [exercise.Reps, Validators.required],
                    WeightTypeID: [exercise.WeightType.WeightTypeID, Validators.required],
                    WeightType: [exercise.WeightType, Validators.required],
                    ExerciseOrder: [exercise.ExerciseOrder, Validators.required],
                    SideTypeID: [exercise.SideTypeID, Validators.required],
                    SideType: [exercise.SideType, Validators.required],
                    PostRest: [exercise.PostRest, Validators.required],
                  }),
                );
              });
            }
          });
        }
      });
    }
  }
  addBlock() {
    const control = this.routineForm.controls.Blocks as FormArray;
    control.push(
      this.formBuilder.group({
        RoutineBlockID: [0, Validators.required],
        RoutineID: [this.routine.RoutineID, Validators.required],
        BlockTypeID: [1],
        BlockType: [Validators.required],
        BlockOrder: [control.length + 1, Validators.required],
        ProgressDiff: [0, Validators.required],
        ProgressType: ['Block', Validators.required],
        Sets: new FormArray([]),
      }),
    );
  }

  addSet(block) {
    const control = block.controls.Sets as FormArray;
    control.push(
      this.formBuilder.group({
        RoutineBlockSetID: [0, Validators.required],
        RoutineBlockID: [block.value.RoutineBlockID, Validators.required],
        SetNumber: [block.controls.Sets.length + 1, Validators.required],
        Exercises: new FormArray([]),
      }),
    );
  }
  addExercise(set) {
    const control = set.controls.Exercises as FormArray;
    control.push(
      this.formBuilder.group({
        RoutineBlockSetExerciseID: [0, Validators.required],
        RoutineBlockSetID: [set.value.RoutineBlockSetID, Validators.required],
        ExerciseID: [-1, Validators.required],
        Exercise: [null, Validators.required],
        RepTypeID: [1, Validators.required],
        RepType: [Validators.required],
        Reps: [8, Validators.required],
        WeightTypeID: [1, Validators.required],
        WeightType: [Validators.required],
        SideTypeID: [1, Validators.required],
        SideType: [this.sideTypes.find(x => x.SideTypeID === 1), Validators.required],
        ExerciseOrder: [set.controls.Exercises.length + 1, Validators.required],
        PostRest: [0, Validators.required],
      }),
    );
  }

  delete(type, id, array: FormArray, index) {
    const conf = confirm('Are you sure?');
    if (conf) {
      this.service.delete('Routines', id, type).subscribe(x => {
        if (type === 'Routines') {
          this.router.navigate(['routines']);
        } else {
          array.removeAt(index);
        }
      });
    }
  }

  onSubmit() {
    this.error = '';
    if (this.routineForm.invalid) {
      this.saving = false;
      this.error = 'Invalid Form';
      return;
    }
    this.saving = true;
    const payload: Routine = this.routineForm.getRawValue();
    payload.Blocks.map(x => {
      delete x.BlockType;
      x.Sets.map(y => {
        y.Exercises.map(e => {
          delete e.RepType;
          delete e.Exercise;
          delete e.WeightType;
          delete e.SideType;
        });
      });
    });
    this.service.post('Routines', payload).subscribe(
      (data: Routine) => {
        this.routineForm.markAsPristine();
        if (this.routine.RoutineID === 0) {
          this.router.navigate(['routine/edit/', data.RoutineID]);
        } else {
          this.router.navigate(['routine/view/', -1, this.routine.RoutineID]);
        }
      },
      error => {
        this.error = error;
        this.saving = false;
      },
    );
  }
}