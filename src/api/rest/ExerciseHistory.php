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
        from UserWorkoutExerciseHistory u
          inner join Exercises e 
            on u.ExerciseID = e.ExerciseID
        where u.ExerciseID = " . $id . " order by ExerciseStart desc");
      echo(json_encode($wo));
    }    
  }
}