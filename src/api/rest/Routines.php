<?php
include_once __DIR__.'/_rest.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = new DBClass();
$allowed = array('Routines', 'RoutineBlocks', 'RoutineBlockSet', 'RoutineBlockSetExercises');

if($method === "GET"){
  if(isset($_GET['i'])){    
    // get nested
    $routine = get('Routines', intval($_GET['i']));
    $routine['Blocks']  = getBy('RoutineBlocks', $routine['RoutineID'], 'RoutineID');
    foreach($routine['Blocks'] as $blockKey => $block){
        $routine['Blocks'][$blockKey]['BlockType'] = get('BlockTypes', $block['BlockTypeID']);
        $routine['Blocks'][$blockKey]['Sets'] = getBy('RoutineBlockSet', $block['RoutineBlockID'], 'RoutineBlockID');
       foreach($routine['Blocks'][$blockKey]['Sets'] as $setKey => $set){
         $routine['Blocks'][$blockKey]['Sets'][$setKey]['Exercises'] = getBy('RoutineBlockSetExercises', $set['RoutineBlockSetID'], 'RoutineBlockSetID');
        foreach($routine['Blocks'][$blockKey]['Sets'][$setKey]['Exercises'] as $exerciseKey => $exercise){
          $routine['Blocks'][$blockKey]['Sets'][$setKey]['Exercises'][$exerciseKey]['RepType'] = get('RepTypes', $exercise['RepTypeID']);
          $routine['Blocks'][$blockKey]['Sets'][$setKey]['Exercises'][$exerciseKey]['SideType'] = get('SideTypes', $exercise['SideTypeID']);
          $routine['Blocks'][$blockKey]['Sets'][$setKey]['Exercises'][$exerciseKey]['WeightType'] = get('WeightTypes', $exercise['WeightTypeID']);
          $routine['Blocks'][$blockKey]['Sets'][$setKey]['Exercises'][$exerciseKey]['Exercise'] = get('Exercises', $exercise['ExerciseID']);
          $routine['Blocks'][$blockKey]['Sets'][$setKey]['Exercises'][$exerciseKey]['Exercise']['ExerciseType'] = get('ExerciseTypes', $routine['Blocks'][$blockKey]['Sets'][$setKey]['Exercises'][$exerciseKey]['Exercise']['ExerciseTypeID']);
        }
      }
    } 
    $needed = custom('CALL workout_required_equipment(' . $_GET['i'] . ')');
    $routine['NeededEquipment'] = $needed[0]['NeededEquipment'];
    $optional = custom('CALL workout_optional_equipment(' . $_GET['i'] . ')');
    $routine['OptionalEquipment'] = $optional[0]['OptionalEquipment'];
    $primary = custom('CALL workout_primary_groups(' . $_GET['i'] . ')');
    $routine['PrimaryMuscleGroups'] = $primary[0]['PrimaryMuscleGroups'];
    $secondary = custom('CALL workout_secondary_groups(' . $_GET['i'] . ')');
    $routine['SecondaryMuscleGroups'] = $secondary[0]['SecondaryMuscleGroups'];
     echo(json_encode($routine));
  }
  else{    
    echo(json_encode(getAll('Routines')));
  }
}



if($method === "POST") {
  $payload = getPayload();
  $RoutineID = upsert('Routines', $payload);
  foreach($payload->Blocks as $block){
    $block->RoutineID = $RoutineID;
    $BlockID = upsert('RoutineBlocks', $block);
    foreach($block->Sets as $set){
      $set->RoutineBlockID = $BlockID;
      $setID = upsert('RoutineBlockSet', $set);
      foreach($set->Exercises as $exercise){
        $exercise->RoutineBlockSetID = $setID;
        upsert('RoutineBlockSetExercises', $exercise);
      }
    }
  }
  echo(json_encode(array('RoutineID' => $RoutineID)));
}

if($method === "DELETE"){
  if(isset($_GET['t']) && isset($_GET['i']) && $isAdmin === 1){
    $id = $_GET['i'];
    if(in_array($_GET['t'], $allowed) && filter_var($id, FILTER_VALIDATE_INT)){
      deleteR($_GET['t'], $id);
      echo(json_encode('Good'));
    }
  }
}