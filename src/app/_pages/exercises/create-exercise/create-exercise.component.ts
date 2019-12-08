import { Component, OnInit, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { ExerciseType } from 'src/app/_models/ExerciseType';
import { Exercise } from 'src/app/_models/Exercise';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutService } from 'src/app/_services/workout.service';
import { Subscription } from 'rxjs';
import { IconDefinition, faSquare } from '@fortawesome/free-regular-svg-icons';
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import * as cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'app-create-exercise',
  templateUrl: './create-exercise.component.html',
  styleUrls: ['./create-exercise.component.scss']
})
export class CreateExerciseComponent implements OnInit, OnDestroy {
  @ViewChild('exerciseForm', { static: false }) form: any;
  exerciseTypes: ExerciseType[] = [] as ExerciseType[];
  exercise: Exercise = {} as Exercise;
  loaded = false;
  error = '';
  saving = false;
  listSub: Subscription = null;
  routeSub: Subscription = null;
  exSub: Subscription = null;
  postSub: Subscription = null;
  noprime = true;
  faSquare: IconDefinition = faSquare;
  faCheckSquare: IconDefinition = faCheckSquare;

  constructor(
    private route: ActivatedRoute,
    private service: WorkoutService,
    private router: Router
  ) { }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (!this.form.pristine) {
      $event.returnValue = true;
    }
  }

  ngOnDestroy() {
    if (this.listSub) { this.listSub.unsubscribe(); }
    if (this.routeSub) { this.routeSub.unsubscribe(); }
    if (this.exSub) { this.exSub.unsubscribe(); }
    if (this.postSub) { this.postSub.unsubscribe(); }
  }

  checkForPrime() {
    this.noprime = true;
    if (this.exercise.MuscleTypes.filter(x => x.IsPrimary && x.IsWorked).length === 1) {
      this.noprime = false;
    }
  }

  ngOnInit() {
    this.listSub = this.service.getAll('Lists').subscribe((lists: any) => {
      this.exerciseTypes = lists.ExerciseTypes;
      this.routeSub = this.route.paramMap.subscribe(params => {
        lists.MuscleTypes.map(mt => {
          mt.ExerciseID = this.exercise.ExerciseID;
          mt.IsWorked = 0;
          mt.IsPrimary = 0;
          delete mt.MuscleGroupTypeID;
        });
        lists.Equipment.map(eq => {
          eq.ExerciseID = this.exercise.ExerciseID;
          eq.IsOptional = 1;
          eq.IsUsed = 0;
        });
        if (Number(params.get('id')) > 0) {
          this.exSub = this.service.get('Exercises', + Number(params.get('id'))).subscribe((data: Exercise) => {
            this.exercise = data;
            this.exercise.ExerciseType = this.exerciseTypes.find(x => x.ExerciseTypeID === this.exercise.ExerciseTypeID);
            this.exercise.MuscleTypes.map(mt => {
              delete mt.ExerciseMuscleTypeID;
              mt.Name = mt.MuscleTypeName;
              delete mt.MuscleTypeName;
            });
            this.exercise.MuscleTypes = this.removeDupsAndMerge(lists.MuscleTypes, this.exercise.MuscleTypes, 'Name')
              .sort((a, b) => {
                if (a.Name < b.Name) { return -1; }
                if (a.Name > b.Name) { return 1; }
                return 0;
              });
            this.exercise.Equipment.map(eq => {
              delete eq.ExerciseEquipmentID;
              eq.Name = eq.EquipmentName;
              delete eq.EquipmentName;
            });
            this.exercise.Equipment = this.removeDupsAndMerge(lists.Equipment, this.exercise.Equipment, 'Name')
              .sort((a, b) => {
                if (a.Name < b.Name) { return -1; }
                if (a.Name > b.Name) { return 1; }
                return 0;
              });
            this.checkForPrime();
            this.loaded = true;
          });
        } else {
          this.exercise = { ExerciseID: 0, ExerciseType: null, ExerciseTypeID: null, MuscleTypes: [], Equipment: [], Name: '' };
          this.exercise.MuscleTypes = [...lists.MuscleTypes];
          this.exercise.Equipment = [...lists.Equipment];
          this.loaded = true;
        }
      });
    });
  }

  removeDupsAndMerge(stock, removeFromStock, prop) {
    for (const stockObj of stock) {
      for (const removed of removeFromStock) {
        if (stockObj && (stockObj[prop] === removed[prop])) {
          stock.splice(stock.indexOf(stockObj), 1);
        }
      }
    }
    return [...stock, ...removeFromStock];
  }

  togglePrimary(mtype) {
    this.exercise.MuscleTypes.filter(x => x.MuscleTypeID !== mtype.MuscleTypeID).map(x => x.IsPrimary = false);
    mtype.IsPrimary = !mtype.IsPrimary;
    if (mtype.IsPrimary) { mtype.IsWorked = true; }
    this.checkForPrime();
    this.form.form.markAsDirty();
  }

  toggleWorked(mtype) {
    mtype.IsWorked = !mtype.IsWorked;
    if (!mtype.IsWorked) { mtype.IsPrimary = false; }
    this.checkForPrime();
    this.form.form.markAsDirty();
  }

  toggleUsed(eq) {
    eq.IsUsed = !eq.IsUsed;
    if (!eq.IsUsed) { eq.IsOptional = true; }
    this.form.form.markAsDirty();
  }

  toggleRequired(eq) {
    eq.IsOptional = !eq.IsOptional;
    if (!eq.IsOptional) { eq.IsUsed = true; }
    this.form.form.markAsDirty();
  }

  save() {
    this.checkForPrime();

    if (this.form.invalid || this.noprime) {
      this.saving = false;
      return;
    }
    this.saving = true;
    const payload = cloneDeep(this.exercise);
    payload.MuscleTypes.map(x => {
      delete x.Name;
    });
    payload.Equipment.map(x => {
      delete x.Name;
    });
    payload.ExerciseTypeID = payload.ExerciseType.ExerciseTypeID;
    delete payload.ExerciseType;
    payload.MuscleTypes = payload.MuscleTypes.filter(x => x.IsWorked);
    payload.Equipment = payload.Equipment.filter(x => x.IsUsed);
    this.postSub = this.service.post('Exercises', payload).subscribe(
      (data: Exercise) => {
        this.form.form.markAsPristine();
        this.router.navigate(['exercises']);
      },
      error => {
        this.error = error;
        this.saving = false;
      },
    );
  }
}
