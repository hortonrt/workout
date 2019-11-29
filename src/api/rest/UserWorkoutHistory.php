<?php
include_once __DIR__.'/_rest.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = new DBClass();

if($method === "GET"){
  echo(json_encode(custom("SELECT 
                              u.UserWorkoutHistoryID
                                , r.Name
                                , Duration    
                                , DATE_FORMAT(StartTime,'%c/%e') as StartTime
                                , StartTime as StartTimeDate
                                , EndTime as EndTimeDate
                            from UserWorkoutHistory u
                              inner join Routines r
                                on u.RoutineID = r.RoutineID
                            where u.UserID = " . $userID . " and r.Name <> 'Rest' order by cast(StartTime as date) desc")));
  
}