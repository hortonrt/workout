<?php
include_once __DIR__.'/_rest.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = new DBClass();

if($method === "GET"){  
  $groups = getAll("MuscleGroupTypes");
  foreach($groups as $groupKey => $group){
    $sql = "select e.*, et.Name as ExerciseTypeName
            from MuscleTypes mt
              inner join MuscleGroupTypes mgt
                on mgt.MuscleGroupTypeID = mt.MuscleGroupTypeID
              inner join ExerciseMuscleTypes emt
                on emt.MuscleTypeID = mt.MuscleTypeID
                    and emt.IsPrimary = 1
                    and emt.IsWorked = 1
              inner join Exercises e
                on e.ExerciseID = emt.ExerciseID
              inner join ExerciseTypes et
                on et.ExerciseTypeID = e.ExerciseTypeID
            WHERE mgt.MuscleGroupTypeID = " . $group['MuscleGroupTypeID'] . " Order by e.Name";
    $groups[$groupKey]['Exercises'] = custom($sql);
    foreach($groups[$groupKey]['Exercises'] as $exerciseKey => $exercise){
      $groups[$groupKey]['Exercises'][$exerciseKey]["MuscleTypes"] = custom("SELECT emt.IsPrimary, mt.Name as MuscleName, mgt.Name as MuscleGroupName
                                          FROM ExerciseMuscleTypes emt
                                            inner join MuscleTypes mt
                                              on mt.MuscleTypeID = emt.MuscleTypeID
                                            inner join MuscleGroupTypes mgt
                                              on mgt.MuscleGroupTypeID = mt.MuscleGroupTypeID
                                          where
                                            emt.ExerciseID = " . $exercise['ExerciseID'] . " 
                                              and IsWorked = 1
                                          order by IsPrimary desc, mgt.Name, mt.Name");
      $groups[$groupKey]['Exercises'][$exerciseKey]["Equipment"] = custom("SELECT ee.IsOptional, e.Name
                  FROM ExerciseEquipment ee
                    inner join Equipment e
                      on e.EquipmentID = ee.EquipmentID
                  where
                    ee.ExerciseID = " . $exercise['ExerciseID'] . "
                      and IsUsed = 1
                  order by ee.IsOptional, e.Name");
      foreach($groups[$groupKey]['Exercises'][$exerciseKey]["MuscleTypes"] as $mtkey => $mt){
        if($mt['IsPrimary'] === 1){
          $groups[$groupKey]['Exercises'][$exerciseKey]['PrimaryMuscleGroup'] = $mt['MuscleGroupName'];
          $groups[$groupKey]['Exercises'][$exerciseKey]['PrimaryMuscleType'] = $mt['MuscleName'];
        }
      };
    }
  }
  echo(json_encode($groups));
}