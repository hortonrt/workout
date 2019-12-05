<?php
include_once __DIR__.'/_rest.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = new DBClass();
$allowed = array('Routines', 'RoutineBlocks', 'RoutineBlockSet', 'RoutineBlockSetExercises');

if($method === "POST") {
  $payload = getPayload();
  $setID = upsert('RoutineBlockSet', $payload);
  if(isset($payload->Exercises)){
    foreach($payload->Exercises as $exercise){
      $exercise->RoutineBlockSetID = $setID;
      upsert('RoutineBlockSetExercises', $exercise);
    }
  }
  echo(json_encode(array('RoutineBlockSetID' => $setID), JSON_NUMERIC_CHECK));
}
