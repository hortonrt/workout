<?php

function getDictionary(){
  return array(
    "BlockTypes" => array("ID" => "BlockTypeID", "ORDER" => "Name", "AddUserID" => false),
    "Equipment" => array("ID" => "EquipmentID", "ORDER" => "Name", "AddUserID" => false),
    "ExerciseEquipment" => array("ID" => "ExerciseEquipmentID", "ORDER" => "ExerciseEquipmentID", "AddUserID" => false),
    "ExerciseMuscleTypes" => array("ID" => "ExerciseMuscleTypeID", "ORDER" => "ExerciseMuscleTypeID", "AddUserID" => false),
    "Exercises" => array("ID" => "ExerciseID", "ORDER" => "Name", "AddUserID" => false),
    "ExerciseTypes" => array("ID" => "ExerciseTypeID", "ORDER" => "Name", "AddUserID" => false),
    "MuscleGroupTypes" => array("ID" => "MuscleGroupTypeID", "ORDER" => "Name", "AddUserID" => false),
    "MuscleTypes" => array("ID" => "MuscleTypeID", "ORDER" => "Name", "AddUserID" => false),
    "ProgramDays" => array("ID" => "ProgramDayID", "ORDER" => "DayNumber", "AddUserID" => false),
    "ProgramPhases" => array("ID" => "ProgramPhaseID", "ORDER" => "PhaseOrder", "AddUserID" => false),
    "ProgramRoutines" => array("ID" => "ProgramRoutineID", "ORDER" => "RoutineOrder", "AddUserID" => false),
    "Programs" => array("ID" => "ProgramID", "ORDER" => "Name", "AddUserID" => true),
    "RepTypes" => array("ID" => "RepTypeID", "ORDER" => "Name", "AddUserID" => false),
    "RoutineBlocks" => array("ID" => "RoutineBlockID", "ORDER" => "BlockOrder", "AddUserID" => false),
    "RoutineBlockSet" => array("ID" => "RoutineBlockSetID", "ORDER" => "SetNumber", "AddUserID" => false),
    "RoutineBlockSetExercises" => array("ID" => "RoutineBlockSetExerciseID", "ORDER" => "ExerciseOrder", "AddUserID" => false),
    "Routines" => array("ID" => "RoutineID", "ORDER" => "Name", "AddUserID" => true),
    "SideTypes" => array("ID" => "SideTypeID", "ORDER" => "Name", "AddUserID" => false),
    "UserMeasurementHistory" => array("ID" => "UserMeasurementHistoryID", "ORDER" => "DateCreated desc", "AddUserID" => false),
    "Users" => array("ID" => "UserID", "ORDER" => "FirstName, LastName", "AddUserID" => false),
    "UserWorkoutExerciseHistory" => array("ID" => "UserWorkoutExerciseHistoryID", "ORDER" => "ExerciseStart", "AddUserID" => false),
    "UserWorkoutHistory" => array("ID" => "UserWorkoutHistoryID", "ORDER" => "StartTime desc", "AddUserID" => false),
    "WeightTypes" => array("ID" => "WeightTypeID", "ORDER" => "Name", "AddUserID" => false)
  );
}