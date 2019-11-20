<?php
include_once __DIR__.'/_rest.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = new DBClass();

if($method === "GET"){
  if(isset($_GET['p']) && isset($_GET['r'])){    
    if(filter_var($_GET['p'], FILTER_VALIDATE_INT) && filter_var($_GET['r'], FILTER_VALIDATE_INT)){
        $wo = custom('CALL workout(' . $userID . ',' . $_GET['p'] . ')');
        $needed = custom('CALL workout_required_equipment(' . $_GET['r'] . ')');
        $wo[0]['NeededEquipment'] = $needed[0]['NeededEquipment'];
        $optional = custom('CALL workout_optional_equipment(' . $_GET['r'] . ')');
        $wo[0]['OptionalEquipment'] = $optional[0]['OptionalEquipment'];
        $primary = custom('CALL workout_primary_groups(' . $_GET['r'] . ')');
        $wo[0]['PrimaryMuscleGroups'] = $primary[0]['PrimaryMuscleGroups'];
        $secondary = custom('CALL workout_secondary_groups(' . $_GET['r'] . ')');
        $wo[0]['SecondaryMuscleGroups'] = $secondary[0]['SecondaryMuscleGroups'];
        $wo[0]['Exercises'] = custom('CALL workout_exercise(' . $userID . ',' . $_GET['r'] . ')');
        echo(json_encode($wo[0], JSON_NUMERIC_CHECK));
    }    
  }
}

if($method === "POST") {
  $payload = getPayload();
  $payload->UserID = $userID;
  $WorkoutID = upsert('UserWorkoutHistory', $payload);
  foreach($payload->Exercises as $exercise){
    $exercise->UserID = $userID;
    $exercise->UserWorkoutHistoryID = $WorkoutID;
    upsert('UserWorkoutExerciseHistory', $exercise);
  }
  echo(json_encode(array('UserWorkoutHistoryID'=> $WorkoutID)));
}