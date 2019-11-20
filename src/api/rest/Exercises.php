<?php
include_once __DIR__.'/_rest.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = new DBClass();

if($method === "GET"){
  if(isset($_GET['i'])){    
    // get nested
    $exercises = get('Exercises', intval($_GET['i']));
    $exercises["MuscleTypes"] = custom("SELECT emt.*, mt.Name as MuscleTypeName from ExerciseMuscleTypes emt INNER JOIN MuscleTypes mt on mt.MuscleTypeID = emt.MuscleTypeID Where ExerciseID = " . $exercises['ExerciseID'] . ";");
    $exercises["Equipment"] = custom("SELECT ee.*, e.Name as EquipmentName from ExerciseEquipment ee INNER JOIN Equipment e on e.EquipmentID = ee.EquipmentID Where ExerciseID = " . $exercises['ExerciseID'] . ";");
    $exercises["ExerciseType"] = get('ExerciseTypes', $exercises["ExerciseTypeID"]);
    echo(json_encode($exercises));
  }
  else{    
    $exercises = custom("SELECT e.*, et.Name as ExerciseTypeName
                          FROM Exercises e
                            inner join ExerciseTypes et
                              on et.ExerciseTypeID = e.ExerciseTypeID
                          order by e.Name");
    foreach($exercises as $exerciseKey => $exercise){
      $exercises[$exerciseKey]["MuscleTypes"] = custom("SELECT emt.IsPrimary, mt.Name as MuscleName, mgt.Name as MuscleGroupName
                                          FROM ExerciseMuscleTypes emt
                                            inner join MuscleTypes mt
                                              on mt.MuscleTypeID = emt.MuscleTypeID
                                            inner join MuscleGroupTypes mgt
                                              on mgt.MuscleGroupTypeID = mt.MuscleGroupTypeID
                                          where
                                            emt.ExerciseID = " . $exercise['ExerciseID'] . "
                                              and IsWorked = 1
                                          order by IsPrimary desc, mgt.Name, mt.Name");
      $exercises[$exerciseKey]["Equipment"] = custom("SELECT ee.IsOptional, e.Name
                                                      FROM ExerciseEquipment ee
                                                        inner join Equipment e
                                                          on e.EquipmentID = ee.EquipmentID
                                                      where
                                                        ee.ExerciseID = " . $exercise['ExerciseID'] . "
                                                          and IsUsed = 1
                                                      order by ee.IsOptional, e.Name");
      foreach($exercises[$exerciseKey]["MuscleTypes"] as $mtkey => $mt){
        if($mt['IsPrimary'] === 1){
          $exercises[$exerciseKey]['PrimaryMuscleGroup'] = $mt['MuscleGroupName'];
          $exercises[$exerciseKey]['PrimaryMuscleType'] = $mt['MuscleName'];
        }
      };
    }
    echo(json_encode($exercises));
  }
}

if($method === "POST") {
  $payload = getPayload();
  $ExerciseID = upsert('Exercises', $payload);
  foreach($payload->Equipment as $equip){
    $equip->ExerciseID = $ExerciseID;
    upsert('ExerciseEquipment', $equip);
  }
  foreach($payload->MuscleTypes as $mt){
    $mt->ExerciseID = $ExerciseID;
    upsert('ExerciseMuscleTypes', $mt);
  }
  echo(json_encode(array('ExerciseID' => $ExerciseID)));
}