<?php
include_once __DIR__.'/_rest.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = new DBClass();

if($method === "GET"){
  if(isset($_GET['i'])){
    $id = $_GET['i'];
    if(filter_var($id, FILTER_VALIDATE_INT)){
  echo(json_encode(custom("SELECT 	
  e.Name
  , u.Reps
  , u.Weight
  , u.Rating
  , e.ExerciseTypeID
  , e.ExerciseID
  , u.RoutineBlockSetExerciseID
  , DATE_FORMAT(StartTime, '%c/%e') as WorkoutDate
  , case when e.ExerciseTypeID not in (1,2,5) then 1 else 0 end as ByRep
  , ROUND(Case when e.ExerciseTypeID not in (1,2,5) then u.Reps else u.Weight * (1 + (u.Reps / 30)) end, 1) as ORM
  , ExerciseOrder
from UserWorkoutExerciseHistory u
inner join Exercises e 
  on u.ExerciseID = e.ExerciseID
inner join UserWorkoutHistory uws
    on uws.UserWorkoutHistoryID = u.UserWorkoutHistoryID
where u.RoutineID = " . $id . " order by cast(ExerciseStart as datetime)")));
  
    }
  }
}