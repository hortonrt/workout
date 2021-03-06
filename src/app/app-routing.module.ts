import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './_pages/home/home.component';
import { LoginComponent } from './_pages/login/login.component';
import { AuthGuard } from './_guards/auth.guard';
import { ProgramsComponent } from './_pages/programs/programs.component';
import { ViewProgramComponent } from './_pages/programs/view-program/view-program.component';
import { RoutinesComponent } from './_pages/routines/routines.component';
import { ViewRoutineComponent } from './_pages/routines/view-routine/view-routine.component';
import { ExercisesComponent } from './_pages/exercises/exercises.component';
import { HistoryComponent } from './_pages/history/history.component';
import { WorkoutHistoryComponent } from './_pages/history/workout-history/workout-history.component';
import { ExerciseHistoryComponent } from './_pages/history/exercise-history/exercise-history.component';
import { WorkoutComponent } from './_pages/workout/workout.component';
import { ConfirmGuard } from './_guards/confirm.guard';
import { CreateExerciseComponent } from './_pages/exercises/create-exercise/create-exercise.component';
import { CreateExerciseGuard } from './_guards/createexercise.guard';
import { MeasurementsComponent } from './_pages/measurements/measurements.component';
import { ProfileComponent } from './_pages/profile/profile.component';
import { StatsComponent } from './_pages/stats/stats.component';
import { WorkoutNowComponent } from './_pages/workout-now/workout-now.component';
import { ConfirmCustomGuard } from './_guards/confirm-custom.guard';

const routes: Routes = [{
  path: '',
  component: HomeComponent,
  canActivate: [AuthGuard],
},
{
  path: 'login',
  component: LoginComponent,
},
{
  path: 'programs',
  component: ProgramsComponent,
  canActivate: [AuthGuard],
},
{
  path: 'program/view/:id',
  component: ViewProgramComponent,
  canActivate: [AuthGuard],
},
{
  path: 'routines',
  component: RoutinesComponent,
  canActivate: [AuthGuard],
},
{
  path: 'routine/view/:programroutineid/:routineid',
  component: ViewRoutineComponent,
  canActivate: [AuthGuard],
},
{
  path: 'exercises',
  component: ExercisesComponent,
  canActivate: [AuthGuard],
},
{
  path: 'exercise/edit/:id',
  component: CreateExerciseComponent,
  canDeactivate: [CreateExerciseGuard],
},
{
  path: 'exercise/create',
  component: CreateExerciseComponent,
  canDeactivate: [CreateExerciseGuard],
},
{
  path: 'history',
  component: HistoryComponent,
  canActivate: [AuthGuard],
},
{
  path: 'history/workout/:id',
  component: WorkoutHistoryComponent,
  canActivate: [AuthGuard],
},
{
  path: 'history/exercise/:id',
  component: ExerciseHistoryComponent,
  canActivate: [AuthGuard],
},
{
  path: 'measurements',
  component: MeasurementsComponent,
  canActivate: [AuthGuard],
},
{
  path: 'profile',
  component: ProfileComponent,
  canActivate: [AuthGuard],
},
{
  path: 'stats',
  component: StatsComponent,
  canActivate: [AuthGuard],
},
{
  path: 'workout/:programroutineid/:routineid',
  component: WorkoutComponent,
  canActivate: [AuthGuard],
  canDeactivate: [ConfirmGuard],
},
{
  path: 'custom',
  component: WorkoutNowComponent,
  canActivate: [AuthGuard],
  canDeactivate: [ConfirmCustomGuard],
},
// otherwise redirect to home
{ path: '**', redirectTo: '', canActivate: [AuthGuard] }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
