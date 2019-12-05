<?php
include_once __DIR__.'/_rest.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = new DBClass();
$allowed = array('Programs', 'ProgramPhases', 'ProgramDays', 'ProgramRoutines');

if($method === "GET"){
  if(isset($_GET['i'])){    
    // get nested
    $program = get('Programs', intval($_GET['i']));
    $program['Phases']  = getBy('ProgramPhases', $program['ProgramID'], 'ProgramID');
    foreach($program['Phases'] as $phaseKey => $phase){
       $program['Phases'][$phaseKey]['Days'] = getBy('ProgramDays', $phase['ProgramPhaseID'], 'ProgramPhaseID');
      foreach($program['Phases'][$phaseKey]['Days'] as $dayKey => $day){
        $program['Phases'][$phaseKey]['Days'][$dayKey]['Routines'] = getBy('ProgramRoutines', $day['ProgramDayID'], 'ProgramDayID');
        foreach($program['Phases'][$phaseKey]['Days'][$dayKey]['Routines'] as $routineKey => $routine){
          $program['Phases'][$phaseKey]['Days'][$dayKey]['Routines'][$routineKey]['Routine'] = get('Routines', $routine['RoutineID']);
          $prev = getByUser('UserWorkoutHistory', $routine['ProgramRoutineID'], 'ProgramRoutineID', $userID);
          $program['Phases'][$phaseKey]['Days'][$dayKey]['Routines'][$routineKey]['RoutineCount'] = Count($prev);
        }
      }
     } 
    echo(json_encode($program));
  }
  else{    
    echo(json_encode(getAll('Programs')));
  }
}



if($method === "POST") {
  $payload = getPayload();
  $ProgramID = upsert('Programs', $payload);
  if(isset($payload->Phases)){
  foreach($payload->Phases as $phase){
    $phase->ProgramID = $ProgramID;
    $PhaseID = upsert('ProgramPhases', $phase);
    if(isset($phase->Days)){
      foreach($phase->Days as $day){
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
    }
  }
  echo(json_encode(array('ProgramID' => $ProgramID)));
}

if($method === "DELETE"){
  if(isset($_GET['t']) && isset($_GET['i'])){
    $id = $_GET['i'];
    if(in_array($_GET['t'], $allowed) && filter_var($id, FILTER_VALIDATE_INT)){
      deleteR($_GET['t'], $id);
      echo(json_encode('Good'));
    }
  }
}