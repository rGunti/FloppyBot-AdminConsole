import { Sort } from '@angular/material/sort';

export function sortData<T>(data: T[], sort: Sort): T[] {
  if (!sort.active || sort.direction === '') {
    return data;
  }
  return data.sort(byProperty(sort.active, sort.direction === 'asc'));
}

function byProperty<T>(propName: string, sortAsc: boolean): (a: T, b: T) => number {
  return (a: T, b: T) => {
    const aValue = a[propName as keyof T];
    const bValue = b[propName as keyof T];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortString(aValue, bValue, sortAsc);
    }

    if (Array.isArray(aValue) && Array.isArray(bValue)) {
      return sortArray(aValue, bValue, sortAsc);
    }

    if (aValue < bValue) {
      return sortAsc ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortAsc ? 1 : -1;
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
