<?php
include_once __DIR__.'/_rest.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = new DBClass();

if($method === "GET"){
  

  if(isset($_GET['i'])){
    $id = $_GET['i'];
    if(filter_var($id, FILTER_VALIDATE_INT)){
     $wo = custom("SELECT 
                    u.UserWorkoutHistoryID
                      , r.Name
                      , Duration    
                      , DATE_FORMAT(StartTime, '%m/%d - %l:%i %p') as StartTime 
                      , StartTime as StartTimeDate
                      , EndTime as EndTimeDate
                  from UserWorkoutHistory u
                    inner join Routines r
                      on u.RoutineID = r.RoutineID
                  where UserWorkoutHistoryID = " . $id . " order by StartTime desc");

      $wo[0]['Exercises'] = custom('SELECT 
                                    e.ExerciseID
                                      , e.Name
                                      , u.Reps
                                      , u.Weight
                                      , u.Rating
                                      , u.UserWorkoutExerciseHistoryID
                                      , ExerciseTypeID
                                  from UserWorkoutExerciseHistory u
                                    inner join Exercises e 
                                      on u.ExerciseID = e.ExerciseID
                                  where UserWorkoutHistoryID = ' . $id . ' order by ExerciseStart');
      echo(json_encode($wo[0]));
    }    
  }
}