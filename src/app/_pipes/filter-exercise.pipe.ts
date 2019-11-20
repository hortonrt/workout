import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterExercise'
})
export class FilterExercisePipe implements PipeTransform {
  transform(items: any[], searchText: string): any {
    if (!items) { return []; }
    if (!searchText) { return items; }
    searchText = searchText.toLowerCase();
    return items.filter(it => {
      console.log(it);
      return it.Name.toLowerCase().includes(searchText)
        || it.ExerciseTypeName.toLowerCase().includes(searchText)
        || it.PrimaryMuscleGroup.toLowerCase().includes(searchText)
        || it.PrimaryMuscleType.toLowerCase().includes(searchText)
        || it.Equipment.filter(x => x.Name.toLowerCase().includes(searchText)).length
        || it.MuscleTypes.filter(x => x.MuscleGroupName.toLowerCase().includes(searchText)).length
        || it.MuscleTypes.filter(x => x.MuscleName.toLowerCase().includes(searchText)).length;
    });
  }
}
