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
  $erm = custom("Select * from
                (select 
                    CONCAT(e.Name, ' - ', et.Name) as Name
                    , uweh.Reps
                    , uweh.Weight as LiftWeight
                    , DATE_FORMAT(ExerciseStart, '%m/%d') as Date
                    , ROUND(Case when e.ExerciseTypeID not in (1,2,5) then uweh.Reps else uweh.Weight * (1 + (uweh.Reps / 30)) end, 1) as ORM
                        , RANK() OVER (PARTITION BY e.ExerciseID ORDER BY ExerciseStart DESC) as Rnk
                        , e.ExerciseID
                  from Exercises e
                    inner join ExerciseTypes et
                      on et.ExerciseTypeID = e.ExerciseTypeID
                    inner join UserWorkoutExerciseHistory uweh
                      on uweh.ExerciseID = e.ExerciseID
                      and uweh.Rating = 3
                    inner join RoutineBlocks rb
                      on rb.RoutineBlockID = uweh.RoutineBlockID
                      and rb.BlockTypeID <> 11
                    inner join RoutineBlockSet rbs
                      on rbs.RoutineBlockSetID = uweh.RoutineBlockSetID
                      and rbs.SetNumber =1
                    inner join RoutineBlockSetExercises rbse
                      on rbse.RoutineBlockSetExerciseID = uweh.RoutineBlockSetExerciseID
                      and rbse.ExerciseOrder = 1
                            and uweh.Reps >= rbse.Reps
                  Where 
                    uweh.UserID = " . $userID . " ) r
                Where rnk = 1
                    order by Name");
  $stats['ExercisesCurrent'] = $erm;
  echo(json_encode($stats,  JSON_NUMERIC_CHECK));
}