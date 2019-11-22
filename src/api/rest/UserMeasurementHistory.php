<?php
include_once __DIR__.'/_rest.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = new DBClass();
$allowed = array('Programs', 'ProgramPhases', 'ProgramDays', 'ProgramRoutines');

if($method === "GET"){
  if(isset($_GET['i'])){    
    $program = get('UserMeasurementHistory', intval($_GET['i']));
    echo(json_encode($program,JSON_NUMERIC_CHECK));
  }
  else{    
    echo(json_encode(getAllByUsercustomFilter('UserMeasurementHistory', $userID, "DateCreated >= '2019-11-18'"), JSON_NUMERIC_CHECK));
  }
}

if($method === "POST") {
  $payload = getPayload();
  $payload->UserID = $userID;
  $ProgramID = upsert('UserMeasurementHistory', $payload);
  echo(json_encode(array('good' => true)));
}

if($method === "DELETE"){
  if(isset($_GET['i'])){
    $id = $_GET['i'];
    if(filter_var($id, FILTER_VALIDATE_INT)){
      deleteR('UserMeasurementHistory', $id);
      echo(json_encode(array('good' => true)));
    }
  }
}