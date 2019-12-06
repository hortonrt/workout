import { Component, OnInit, OnDestroy } from '@angular/core';
import { Routine } from 'src/app/_models/Routine';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutService } from 'src/app/_services/workout.service';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faStopwatch, faPlus, faCertificate, faHeartbeat } from '@fortawesome/free-solid-svg-icons';
import { Subscription, SubscriptionLike } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NeweditBlockComponent } from '../newedit/newedit-block/newedit-block.component';
import { NeweditExerciseComponent } from '../newedit/newedit-exercise/newedit-exercise.component';
import { NeweditRoutineComponent } from '../newedit/newedit-routine/newedit-routine.component';
import { NeweditSetComponent } from '../newedit/newedit-set/newedit-set.component';
import { isArray } from 'util';
import * as cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'app-view-routine',
  templateUrl: './view-routine.component.html',
  styleUrls: ['./view-routine.component.scss']
})
export class ViewRoutineComponent implements OnInit, OnDestroy {
  routine: Routine = {} as Routine;
  programroutineid: number;
  loaded = false;
  faStopWatch: IconDefinition = faStopwatch;
  faPlus: IconDefinition = faPlus;
  faCertificate: IconDefinition = faCertificate;
  faHeartbeat = faHeartbeat;
  routeSub: Subscription = null;
  routineSub: Subscription = null;
  qsub: Subscription = null;
  cloneSub: SubscriptionLike = null;
  maxSets = 0;
  editing = false;
  bsModalRef: BsModalRef;
  constructor(
    private route: ActivatedRoute,
    private service: WorkoutService,
    private modalService: BsModalService,
    private router: Router
  ) { }

  ngOnInit() {
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.routine.RoutineID = Number(params.get('routineid'));
      this.programroutineid = Number(params.get('programroutineid') || -1);
      this.routineSub = this.service.get('Routines', this.routine.RoutineID).subscribe((data: Routine) => {
        this.routine = data;
        this.qsub = this.route.queryParams.subscribe(paramsQ => {
          if (paramsQ.edit === '1') { this.editing = true; }
          this.loaded = true;
        });
      });
    });
  }
  ngOnDestroy() {
    if (this.routineSub) { this.routineSub.unsubscribe(); }
    if (this.routeSub) { this.routeSub.unsubscribe(); }
    if (this.qsub) { this.qsub.unsubscribe(); }
    if (this.cloneSub) { this.cloneSub.unsubscribe(); }
  }

  doneEdit(keepEditing = false) {
    this.loaded = false;
    this.routineSub = this.service.get('Routines', this.routine.RoutineID).subscribe((data: Routine) => {
      this.routine = Object.assign({}, data);
      this.editing = keepEditing;
      this.loaded = true;
    });
  }

  neweditBlock(block) {
    if (!block) {
      block = { RoutineID: this.routine.RoutineID, BlockOrder: this.routine.Blocks.length + 1 };
    }
    const initialState = {
      obj: block,
      finish: (newblock: any) => {
        if (newblock) {
          this.routine.Blocks.push(newblock);
        }
        this.routine.Blocks.sort((a, b) => a.BlockOrder - b.BlockOrder);
      }
    };
    this.bsModalRef = this.modalService.show(NeweditBlockComponent, { initialState });
  }

  neweditExercise(exercise, set) {
    if (!exercise) {
      exercise = {
        ExerciseOrder: set.Exercises.length + 1,
        RoutineBlockSetID: set.RoutineBlockSetID
      };
    }
    const initialState = {
      obj: exercise,
      finish: (newExercise) => {
        if (newExercise) {
          set.Exercises.push(newExercise);
        } else {
          set = this.deepSearch(this.routine, 'RoutineBlockSetID', exercise.RoutineBlockSetID);
        }
        set.Exercises.sort((a, b) => a.ExerciseOrder - b.ExerciseOrder);
      }
    };
    this.bsModalRef = this.modalService.show(NeweditExerciseComponent, { initialState });
  }

  neweditRoutine($event) {
    const initialState = { obj: $event, finish: (routine) => { Object.assign(this.routine, routine); } };
    this.bsModalRef = this.modalService.show(NeweditRoutineComponent, { initialState });
  }

  deepSearch(object, key, val) {
    if (object.hasOwnProperty(key) && object[key] === val) {
      return object;
    }

    for (const keyO of Object.keys(object)) {
      if (typeof object[keyO] === 'object') {
        const o = this.deepSearch(object[keyO], key, val);
        if (o != null) {
          return o;
        }
      }
    }
    return null;
  }

  neweditSet(set, block) {
    if (!set) {
      set = { RoutineBlockID: block.RoutineBlockID, SetNumber: block.Sets.length + 1 };
    }
    const initialState = {
      obj: set,
      finish: (newSet) => {
        if (newSet) {
          block.Sets.push(newSet);
        } else {
          block = this.routine.Blocks.find(b => b.RoutineBlockID === set.RoutineBlockID);
        }
        block.Sets.sort((a, b) => a.SetNumber - b.SetNumber);
      }
    };
    this.bsModalRef = this.modalService.show(NeweditSetComponent, { initialState });
  }

  clone(obj) {
    const conf = confirm('Are you sure you want to clone this?');
    if (conf) {
      const payload = cloneDeep(obj.obj);
      if (obj.type === 'Routines') {
        this.replaceIDs(payload, ['RoutineID', 'RoutineBlockID', 'RoutineBlockSetID', 'RoutineBlockSetExerciseID']);
        delete payload.PrimaryMuscleGroups;
        delete payload.SecondaryMuscleGroups;
        delete payload.NeededEquipment;
        delete payload.OptionalEquipment;
        delete payload.UserID;
        payload.Name += ' (Clone)';
      } else if (obj.type === 'RoutineBlocks') {
        this.replaceIDs(payload, ['RoutineBlockID', 'RoutineBlockSetID', 'RoutineBlockSetExerciseID']);
        payload.BlockOrder = this.routine.Blocks.length + 1;
      } else if (obj.type === 'RoutineBlockSet') {
        this.replaceIDs(payload, ['RoutineBlockSetID', 'RoutineBlockSetExerciseID']);
        const block = this.routine.Blocks.find(b => b.RoutineBlockID === payload.RoutineBlockID);
        payload.SetNumber = block.Sets.length + 1;
      } else if (obj.type === 'RoutineBlockSetExercises') {
        this.replaceIDs(payload, ['RoutineBlockSetExerciseID']);
        const set = this.deepSearch(this.routine, 'RoutineBlockSetID', payload.RoutineBlockSetID);
        payload.ExerciseOrder = set.Exercises.length + 1;
      }
      this.cloneSub = this.service.post(obj.type, payload).subscribe((x: any) => {
        if (obj.type === 'Routines') {
          this.router.navigate(['/routine/view', -1, x.RoutineID]);
        } else {
          this.routineSub = this.service.get('Routines', this.routine.RoutineID).subscribe((data: Routine) => {
            if (obj.type === 'RoutineBlocks') {
              this.routine.Blocks = Object.assign([], data.Blocks);
            } else if (obj.type === 'RoutineBlockSet') {
              const block = this.deepSearch(this.routine, 'RoutineBlockID', obj.obj.RoutineBlockID);
              block.Sets = Object.assign([], this.deepSearch(data, 'RoutineBlockID', obj.obj.RoutineBlockID).Sets);
            } else if (obj.type === 'RoutineBlockSetExercises') {
              const set = this.deepSearch(this.routine, 'RoutineBlockSetID', obj.obj.RoutineBlockSetID);
              set.Exercises = Object.assign([], this.deepSearch(data, 'RoutineBlockSetID', obj.obj.RoutineBlockSetID).Exercises);
            }
          });
        }
      });
    }
  }

  replaceIDs(object, toBeReplaced) {
    Object.keys(object).some((k: any) => {
      if (typeof object[k] === 'object' && !isArray(object[k]) && isNaN(k)) {
        delete object[k];
      }
      if (toBeReplaced.indexOf(k) !== -1) {
        object[k] = 0;
      }
      if (object[k] && typeof object[k] === 'object') {
        this.replaceIDs(object[k], toBeReplaced);
      }
    });
    // return object;
  }

  delete(obj) {
    const conf = confirm('Are you sure you want to delete this item?');
    let id = -99;
    if (obj.type === 'Routines') {
      id = obj.obj.RoutineID;
    } else if (obj.type === 'RoutineBlocks') {
      id = obj.obj.RoutineBlockID;
    } else if (obj.type === 'RoutineBlockSet') {
      id = obj.obj.RoutineBlockSetID;
    } else if (obj.type === 'RoutineBlockSetExercises') {
      id = obj.obj.RoutineBlockSetExerciseID;
    }
    if (conf) {
      this.service.delete('Routines', id, obj.type).subscribe(x => {
        if (obj.type === 'Routines') {
          this.router.navigate(['/routines']);
        } else if (obj.type === 'RoutineBlocks') {
          this.routine.Blocks.splice(this.routine.Blocks.indexOf(this.routine.Blocks.find(b => b.RoutineBlockID === id)), 1);
          this.routine.Blocks.sort((a, b) => a.BlockOrder - b.BlockOrder);
        } else if (obj.type === 'RoutineBlockSet') {
          const block = this.routine.Blocks.find(b => b.RoutineBlockID === obj.obj.RoutineBlockID);
          block.Sets.splice(block.Sets.indexOf(block.Sets.find(b => b.RoutineBlockSetID === id)), 1);
          block.Sets.sort((a, b) => a.SetNumber - b.SetNumber);
        } else if (obj.type === 'RoutineBlockSetExercises') {
          const set = this.deepSearch(this.routine, 'RoutineBlockSetID', obj.obj.RoutineBlockSetID);
          set.Exercises.splice(set.Exercises.indexOf(set.Exercises.find(b => b.RoutineBlockSetExerciseID === id)), 1);
          set.Exercises.sort((a, b) => a.ExerciseOrder - b.ExerciseOrder);
        }
      });
    }
  }
}
