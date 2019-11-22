<?php
include_once __DIR__.'/_rest.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = new DBClass();

if($method === "GET"){
  

  if(isset($_GET['i'])){
    $id = $_GET['i'];
    if(filter_var($id, FILTER_VALIDATE_INT)){
      $wo = custom("SELECT 	
            e.Name
            , u.Reps
            , u.Weight
            , u.Rating
            , e.ExerciseTypeID
            , DATE_FORMAT(ExerciseStart, '%m/%d') as ExerciseStart
            , rbse.Reps as ExerciseReps
            , ROUND(Case when e.ExerciseTypeID not in (1,2,5) then u.Reps else u.Weight * (1 + (u.Reps / 30)) end, 1) as ORM
        from UserWorkoutExerciseHistory u
          inner join Exercises e 
            on u.ExerciseID = e.ExerciseID
          INNER JOIN RoutineBlockSetExercises rbse
            on rbse.RoutineBlockSetExerciseID = u.RoutineBlockSetExerciseID
        where u.ExerciseID = " . $id . " order by ExerciseStart desc");
      echo(json_encode($wo));
    }    
  }
}