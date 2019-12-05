<?php
include_once __DIR__.'/_rest.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = new DBClass();



if($method === "POST") {
  $payload = getPayload();
  $RoutineID = upsert('ProgramRoutines', $payload); 
  echo(json_encode(array('ProgramRoutineID' => $RoutineID)));
}
