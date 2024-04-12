import { environment } from '../../environments/environment';

export function getUrl(path: string): string {
  return `${environment.api}${path}`;
}
