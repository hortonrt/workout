import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'repmax',
})
export class RepmaxPipe implements PipeTransform {
  lookups: any[] = [
    { P1RM: 1, R1RM: 1 },
    { P1RM: 0.95, R1RM: 2 },
    { P1RM: 0.925, R1RM: 3 },
    { P1RM: 0.9, R1RM: 4 },
    { P1RM: 0.875, R1RM: 5 },
    { P1RM: 0.85, R1RM: 6 },
    { P1RM: 0.825, R1RM: 7 },
    { P1RM: 0.8, R1RM: 8 },
    { P1RM: 0.75, R1RM: 9 },
    { P1RM: 0.73333333, R1RM: 10 },
    { P1RM: 0.71666666, R1RM: 11 },
    { P1RM: 0.7, R1RM: 12 },
    { P1RM: 0.6333333333, R1RM: 13 },
    { P1RM: 0.5666666666, R1RM: 14 },
    { P1RM: 0.5, R1RM: 15 },
  ];

  transform(value: number, currentreps: number, desiredreps: number): number {
    if (!value) {
      return null;
    }
    if (currentreps === desiredreps) {
      return value;
    }
    const RM1 = value * (1 + currentreps / 30);
    const trans = this.lookups.find(x => x.R1RM === desiredreps).P1RM;

    return Math.floor((trans * RM1) / 5) * 5;
  }
}
