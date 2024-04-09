import { Pipe, PipeTransform } from '@angular/core';

const UNITS = ['B', 'kB', 'MB'];

@Pipe({
  name: 'fileSize',
  standalone: true,
})
export class FileSizePipe implements PipeTransform {
  transform(value: number | null | undefined): string | null | undefined {
    if (value === null || value === undefined) {
      return value;
    }

    let val: number = value;
    let str = `${val}`;
    for (let i = 0; i < UNITS.length; i++) {
      str = `${(Math.round(val * 100) / 100).toLocaleString()} ${UNITS[i]}`;
      if (val < 1024) {
        return str;
      }
      if (i <= UNITS.length - 1) {
        val = val / 1024;
      }
    }

    return str;
  }
}
