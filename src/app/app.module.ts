import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// vendor
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// ng-bootstrap
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
// highcharts
import { HighchartsChartModule } from 'highcharts-angular';
// pages
import { HomeComponent } from './_pages/home/home.component';
import { LoginComponent } from './_pages/login/login.component';
import { NavigationComponent } from './_components/navigation/navigation.component';
import { AuthInterceptor } from './_interceptors/auth.interceptor';
import { ErrorInterceptor } from './_interceptors/errors.interceptor';
import { ProgramsComponent } from './_pages/programs/programs.component';
import { LoaderComponent } from './_components/loader/loader.component';
import { ViewProgramComponent } from './_pages/programs/view-program/view-program.component';
import { RoutinesComponent } from './_pages/routines/routines.component';
import { ViewRoutineComponent } from './_pages/routines/view-routine/view-routine.component';
import { ExercisesComponent } from './_pages/exercises/exercises.component';
import { HistoryComponent } from './_pages/history/history.component';
import { WorkoutHistoryComponent } from './_pages/history/workout-history/workout-history.component';
import { ExerciseHistoryComponent } from './_pages/history/exercise-history/exercise-history.component';
import { SecondstimerPipe } from './_pipes/secondstimer.pipe';
import { WorkoutComponent } from './_pages/workout/workout.component';
import { RepmaxPipe } from './_pipes/repmax.pipe';
import { CreateRoutineComponent } from './_pages/routines/create-routine/create-routine.component';
import { CreateExerciseComponent } from './_pages/exercises/create-exercise/create-exercise.component';
import { CreateProgramComponent } from './_pages/programs/create-program/create-program.component';
import { ExercisePickerComponent } from './_components/exercise-picker/exercise-picker.component';
import { FilterExercisePipe } from './_pipes/filter-exercise.pipe';
import { MeasurementsComponent } from './_pages/measurements/measurements.component';
import { OutputGraphComponent } from './_pages/measurements/output-graph/output-graph.component';
import { CreateMeasurementComponent } from './_pages/measurements/create-measurement/create-measurement.component';
import { AdjusterComponent } from './_components/adjuster/adjuster.component';
import { ProfileComponent } from './_pages/profile/profile.component';
import { UpdateComponent } from './_components/update/update.component';
import { EditWorkoutComponent } from './_pages/history/workout-history/edit-workout/edit-workout.component';
import { BandSelectorComponent } from './_components/band-selector/band-selector.component';
import { DumbbellSelectorComponent } from './_components/dumbbell-selector/dumbbell-selector.component';
import { WorkoutPreviewComponent } from './_pages/workout/workout-preview/workout-preview.component';
import { StatsComponent } from './_pages/stats/stats.component';
import { RepMaxHistoryComponent } from './_pages/stats/rep-max-history/rep-max-history.component';
import { RepMaxCurrentComponent } from './_pages/stats/rep-max-current/rep-max-current.component';
import { WorkoutMusclesComponent } from './_pages/workout/workout-preview/workout-muscles/workout-muscles.component';
import { RepMaxChartComponent } from './_components/rep-max-chart/rep-max-chart.component';
import { RoutineHistoryComponent } from './_pages/stats/routine-history/routine-history.component';
import { ExerciseHistoryReportComponent } from './_pages/stats/exercise-history-report/exercise-history-report.component';
import { ExercisesCurrentComponent } from './_pages/stats/exercises-current/exercises-current.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavigationComponent,
    ProgramsComponent,
    LoaderComponent,
    ViewProgramComponent,
    RoutinesComponent,
    ViewRoutineComponent,
    ExercisesComponent,
    HistoryComponent,
    WorkoutHistoryComponent,
    ExerciseHistoryComponent,
    SecondstimerPipe,
    WorkoutComponent,
    RepmaxPipe,
    CreateRoutineComponent,
    CreateExerciseComponent,
    CreateProgramComponent,
    ExercisePickerComponent,
    FilterExercisePipe,
    MeasurementsComponent,
    OutputGraphComponent,
    CreateMeasurementComponent,
    AdjusterComponent,
    ProfileComponent,
    UpdateComponent,
    EditWorkoutComponent,
    BandSelectorComponent,
    DumbbellSelectorComponent,
    WorkoutPreviewComponent,
    StatsComponent,
    RepMaxHistoryComponent,
    RepMaxCurrentComponent,
    WorkoutMusclesComponent,
    RepMaxChartComponent,
    RoutineHistoryComponent,
    ExerciseHistoryReportComponent,
    ExercisesCurrentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    CollapseModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    HighchartsChartModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ExercisePickerComponent, CreateMeasurementComponent, EditWorkoutComponent, RepMaxChartComponent]
})
export class AppModule { }
