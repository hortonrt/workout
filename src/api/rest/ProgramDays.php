<?php
include_once __DIR__.'/_rest.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = new DBClass();



if($method === "POST") {
  $payload = getPayload();
  $ProgramDayID = upsert('ProgramDays', $payload);
  if(isset($payload->Routines)){
    foreach($payload->Routines as $routine){
      $routine->ProgramDayID = $ProgramDayID;
      upsert('ProgramRoutines', $routine); 
    }
  }
  echo(json_encode(array('ProgramDayID' => $ProgramDayID)));
}
