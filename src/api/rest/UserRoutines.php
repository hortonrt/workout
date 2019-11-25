<?php
include_once __DIR__.'/_rest.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = new DBClass();

if($method === "GET"){

    echo(json_encode(custom(
      "SELECT *
      FROM Routines
      WHERE RoutineID in (Select RoutineID from UserWorkoutHistory WHERE UserID = " . $userID . ")
      ORDER BY Name;"
    )));
}


