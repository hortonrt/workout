<?php

function getDictionary(){
  return array(
    "BlockTypes" => array("ID" => "BlockTypeID", "ORDER" => "Name"),
    "Equipment" => array("ID" => "EquipmentID", "ORDER" => "Name"),
    "ExerciseEquipment" => array("ID" => "ExerciseEquipmentID", "ORDER" => "ExerciseEquipmentID"),
    "ExerciseMuscleTypes" => array("ID" => "ExerciseMuscleTypeID", "ORDER" => "ExerciseMuscleTypeID"),
    "Exercises" => array("ID" => "ExerciseID", "ORDER" => "Name"),
    "ExerciseTypes" => array("ID" => "ExerciseTypeID", "ORDER" => "Name"),
    "MuscleGroupTypes" => array("ID" => "MuscleGroupTypeID", "ORDER" => "Name"),
    "MuscleTypes" => array("ID" => "MuscleTypeID", "ORDER" => "Name"),
    "ProgramDays" => array("ID" => "ProgramDayID", "ORDER" => "DayNumber"),
    "ProgramPhases" => array("ID" => "ProgramPhaseID", "ORDER" => "PhaseOrder"),
    "ProgramRoutines" => array("ID" => "ProgramRoutineID", "ORDER" => "RoutineOrder"),
    "Programs" => array("ID" => "ProgramID", "ORDER" => "Name"),
    "RepTypes" => array("ID" => "RepTypeID", "ORDER" => "Name"),
    "RoutineBlocks" => array("ID" => "RoutineBlockID", "ORDER" => "BlockOrder"),
    "RoutineBlockSet" => array("ID" => "RoutineBlockSetID", "ORDER" => "SetNumber"),
    "RoutineBlockSetExercises" => array("ID" => "RoutineBlockSetExerciseID", "ORDER" => "ExerciseOrder"),
    "Routines" => array("ID" => "RoutineID", "ORDER" => "Name"),
    "SideTypes" => array("ID" => "SideTypeID", "ORDER" => "Name"),
    "UserMeasurementHistory" => array("ID" => "UserMeasurementHistoryID", "ORDER" => "DateCreated desc"),
    "Users" => array("ID" => "UserID", "ORDER" => "FirstName, LastName"),
    "UserWorkoutExerciseHistory" => array("ID" => "UserWorkoutExerciseHistoryID", "ORDER" => "ExerciseStart"),
    "UserWorkoutHistory" => array("ID" => "UserWorkoutHistoryID", "ORDER" => "StartTime desc"),
    "WeightTypes" => array("ID" => "WeightTypeID", "ORDER" => "Name")
  );
}