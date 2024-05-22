import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { getUrl } from '../utils/api';

import { LogRecord, LogRecordSearchParameters } from './entities';

const DEFAULT_PARAMS: LogRecordSearchParameters = {
  maxRecords: 1000,
};

@Injectable({
  providedIn: 'root',
})
export class LogApiService {
  private readonly http = inject(HttpClient);

  getLogs(params?: LogRecordSearchParameters): Observable<LogRecord[]> {
    return this.http.post<LogRecord[]>(getUrl('/api/v2/admin/log'), params || DEFAULT_PARAMS);
  }
}
