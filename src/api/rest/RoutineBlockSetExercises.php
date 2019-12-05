<?php
include_once __DIR__.'/_rest.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = new DBClass();
$allowed = array('Routines', 'RoutineBlocks', 'RoutineBlockSet', 'RoutineBlockSetExercises');

if($method === "POST") {
  $payload = getPayload();
  $exerciseID = upsert('RoutineBlockSetExercises', $payload);
  echo(json_encode(array('RoutineBlockSetExerciseID' => $exerciseID), JSON_NUMERIC_CHECK));
}
