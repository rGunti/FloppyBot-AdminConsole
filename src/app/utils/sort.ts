import { Sort } from '@angular/material/sort';

export function sortData<T>(data: T[], sort: Sort): T[] {
  if (!sort.active || sort.direction === '') {
    return data;
  }
  return data.sort(byProperty(sort.active, sort.direction === 'asc'));
}

export declare type PropertyMapping<T> = Record<string, string | ((item: T) => unknown)>;

export function sortAliasedData<T>(data: T[], sort: Sort, mapping: PropertyMapping<T>): T[] {
  if (!sort.active || sort.direction === '') {
    return data;
  }

  if (mapping[sort.active]) {
    const prop = mapping[sort.active];
    if (typeof prop === 'string') {
      return data.sort(byProperty(prop, sort.direction === 'asc'));
    } else {
      return data.sort(byPropertyFunc(prop, sort.direction === 'asc'));
    }
  }

  return data.sort(byProperty(sort.active, sort.direction === 'asc'));
}

function byProperty<T>(propName: string, sortAsc: boolean): (a: T, b: T) => number {
  return byPropertyFunc<T>((item: T) => item[propName as keyof T], sortAsc);
}

function byPropertyFunc<T>(propFunc: (item: T) => unknown, sortAsc: boolean): (a: T, b: T) => number {
  return (a: T, b: T) => {
    const aValue = propFunc(a);
    const bValue = propFunc(b);

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortString(aValue, bValue, sortAsc);
    }

    if (Array.isArray(aValue) && Array.isArray(bValue)) {
      return sortArray(aValue, bValue, sortAsc);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortAsc ? aValue - bValue : bValue - aValue;
    }
    return 0;
  };
}

function sortString(a: string, b: string, sortAsc: boolean): number {
  const compareStrA = a.toLowerCase();
  const compareStrB = b.toLowerCase();
  if (compareStrA < compareStrB) {
    return sortAsc ? -1 : 1;
  }
  if (compareStrA > compareStrB) {
    return sortAsc ? 1 : -1;
  }
  return 0;
}

function sortArray(a: unknown[], b: unknown[], sortAsc: boolean): number {
  return sortString(a.join(','), b.join(','), sortAsc);
}
