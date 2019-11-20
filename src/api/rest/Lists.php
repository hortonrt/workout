<?php
include_once __DIR__.'/_rest.php';

$method = $_SERVER['REQUEST_METHOD'];
$db = new DBClass();
$allowed = array('BlockTypes', 'ExerciseTypes', 'MuscleGroupTypes', 'MuscleTypes', 'RepTypes', 'SideTypes', 'WeightTypes', 'Equipment');

if($method === "GET"){ 
  if(isset($_GET['i']) && in_array($_GET['i'], $allowed)){
    echo(json_encode(getAll($_GET['i'])));
  }
  else{
     // get all
     $out = array();
     foreach($allowed as $type){
       $out[$type] = getAll($type);
     }
     echo(json_encode($out));
  }
}