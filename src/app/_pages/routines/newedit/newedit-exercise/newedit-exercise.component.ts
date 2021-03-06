import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faSquare, faCheckSquare } from '@fortawesome/free-regular-svg-icons';
import { WorkoutService } from 'src/app/_services/workout.service';
import { Subscription } from 'rxjs';
import { ExercisePickerComponent } from 'src/app/_components/exercise-picker/exercise-picker.component';

@Component({
  selector: 'app-newedit-exercise',
  templateUrl: './newedit-exercise.component.html',
  styleUrls: ['./newedit-exercise.component.scss']
})
export class NeweditExerciseComponent implements OnInit, OnDestroy {
  @ViewChild('exerciseForm', { static: false }) form: any;
  obj = null;
  finish = null;
  faSquare: IconDefinition = faSquare;
  faCheckSquare: IconDefinition = faCheckSquare;
  original = null;
  listSub: Subscription = null;
  exModalRef = null;
  lists = null;
  constructor(public bsModalRef: BsModalRef, private service: WorkoutService, private modalService: BsModalService) { }

  ngOnDestroy() {
    if (this.listSub) { this.listSub.unsubscribe(); }
  }

  selectExercise(ex) {
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
        this.obj.Exercise = newex;
      }
    };
    this.exModalRef = this.modalService.show(ExercisePickerComponent, { initialState, ignoreBackdropClick: true });
  }

  ngOnInit() {
    // this.obj = Object.assign({}, this.obj);
    this.listSub = this.service.lists.subscribe(lists => {
      this.lists = Object.assign({}, lists);
      if (!this.obj.RoutineBlockSetExerciseID) {
        Object.assign(this.obj, {
          Exercise: null,
          ExerciseID: null,
          FixedWeight: -1,
          PostRest: 0,
          RepType: null,
          RepTypeID: null,
          Reps: 0,
          RoutineBlockSetExerciseID: 0,
          SideType: null,
          SideTypeID: null,
          Timer: -1,
          WeightType: null,
          WeightTypeID: null
        });
      } else {
        this.obj.RepType = this.lists.RepTypes.find(x => x.RepTypeID === this.obj.RepTypeID);
        this.obj.WeightType = this.lists.WeightTypes.find(x => x.WeightTypeID === this.obj.WeightTypeID);
        this.obj.SideType = this.lists.SideTypes.find(x => x.SideTypeID === this.obj.SideTypeID);
      }
      if (this.obj.PostRest === 0) { this.obj.PostRest = -1; }
      this.original = Object.assign({}, this.obj);
    });

  }

  save() {
    if (this.form.valid) {
      this.obj.ExerciseID = Number(this.obj.Exercise.ExerciseID);
      this.obj.RepTypeID = Number(this.obj.RepType.RepTypeID);
      this.obj.WeightTypeID = Number(this.obj.WeightType.WeightTypeID);
      this.obj.SideTypeID = Number(this.obj.SideType.SideTypeID);
      const payload: any = Object.assign({}, this.obj);
      const ex = Object.assign({}, payload.Exercise);
      delete payload.Exercise;
      const rt = Object.assign({}, payload.RepType);
      delete payload.RepType;
      const wt = Object.assign({}, payload.WeightType);
      delete payload.WeightType;
      const st = Object.assign({}, payload.SideType);
      delete payload.SideType;
      if (payload.PostRest === -1) { payload.PostRest = 0; }
      this.service.post('RoutineBlockSetExercises', payload).subscribe((rbse: any) => {
        if (payload.RoutineBlockSetExerciseID === 0) {
          payload.RoutineBlockSetExerciseID = rbse.RoutineBlockSetExerciseID;
          payload.Exercise = ex;
          payload.RepType = rt;
          payload.WeightType = wt;
          payload.SideType = st;
          this.finish(payload);
        } else {
          Object.assign(this.obj, payload);
          this.finish(null);
        }
        this.bsModalRef.hide();
      }, (e => {
        console.log(e);
      }));
    }
  }

  close() {
    if (this.form.pristine) {
      Object.assign(this.obj, this.original);
      this.bsModalRef.hide();
    } else {
      if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        Object.assign(this.obj, this.original);
        this.bsModalRef.hide();
      }
    }
  }
}
