import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondstimer',
})
export class SecondstimerPipe implements PipeTransform {
  transform(value: number, start: number, length: number): any {
    return new Date(value * 1000).toISOString().substr(start, length);
  }
}
