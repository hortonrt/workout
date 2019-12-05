<?php
include_once __DIR__.'/_rest.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = new DBClass();
$allowed = array('Routines', 'RoutineBlocks', 'RoutineBlockSet', 'RoutineBlockSetExercises');

if($method === "POST") {
  $payload = getPayload();
  $BlockID = upsert('RoutineBlocks', $payload);
  if(isset($payload->Sets)){
    foreach($payload->Sets as $set){
      $set->RoutineBlockID = $BlockID;
      $setID = upsert('RoutineBlockSet', $set);
      if(isset($set->Exercises)){
        foreach($set->Exercises as $exercise){
          $exercise->RoutineBlockSetID = $setID;
          upsert('RoutineBlockSetExercises', $exercise);
        }
      }
    }
  }
  echo(json_encode(array('RoutineBlockID' => $BlockID), JSON_NUMERIC_CHECK));
}
