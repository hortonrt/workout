<?php
include_once __DIR__.'/_rest.php';

$method = $_SERVER['REQUEST_METHOD'];

if($method === "GET"){
  $stats = array();
  $rmh = custom("CALL rep_max_history(" . $userID . ");");
  $stats["RepMaxHistory"] = $rmh;
  $rmc = custom("CALL rep_max_current(" . $userID . ");");
  $stats["RepMaxCurrent"] = $rmc;
  $eh = custom("Select 
                  Reps
                    , Weight
                    , Rating
                    , cast(uweh.ExerciseStart as date) WorkoutDate
                    , concat(e.Name, ' - ', et.Name) as Name
                    , rbs.SetNumber
                    , case when e.ExerciseTypeID in (8,4) then 1 else 0 end as ByRep
                From UserWorkoutExerciseHistory uweh
                  Inner join Exercises e
                    on e.ExerciseID = uweh.ExerciseID
                  inner join ExerciseTypes et
                    on et.ExerciseTypeID = e.ExerciseTypeID
                  inner join RoutineBlockSet rbs
                    on rbs.RoutineBlockSetID = uweh.RoutineBlockSetID
                Where
                  UserID = " . $userID . " and timestampdiff(day, ExerciseStart, now()) <= 60 Order By concat(e.Name, ' - ', et.Name), WorkoutDate");
  $stats['ExerciseHistory'] = $eh;
  echo(json_encode($stats,  JSON_NUMERIC_CHECK));
}