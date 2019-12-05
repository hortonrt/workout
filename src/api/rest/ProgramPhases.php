<?php
include_once __DIR__.'/_rest.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = new DBClass();



if($method === "POST") {
  $payload = getPayload();
  $PhaseID = upsert('ProgramPhases', $payload);
  if(isset($payload->Days)){
    foreach($payload->Days as $day){
      $day->ProgramPhaseID = $PhaseID;
      $dayID = upsert('ProgramDays', $day);
      if(isset($day->Routines)){
        foreach($day->Routines as $routine){
          $routine->ProgramDayID = $dayID;
          upsert('ProgramRoutines', $routine); 
        }
      }
    }
  }
  echo(json_encode(array('ProgramPhaseID' => $PhaseID)));
}
