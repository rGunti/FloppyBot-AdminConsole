import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, OperatorFunction } from 'rxjs';

import { getUrl } from '../utils/api';

import { FileHeader, FileStorageQuota } from './entities';

@Injectable({
  providedIn: 'root',
})
export class FileApiService {
  private readonly http = inject(HttpClient);

  getFilesForChannel(channelId: string): Observable<FileHeader[]> {
    return this.http.get<FileHeader[]>(getUrl(`/api/v2/files/${channelId}`));
  }

  getFileQuota(channelId: string): Observable<FileStorageQuota> {
    return this.http.get<FileStorageQuota>(getUrl(`/api/v2/files/${channelId}/quota`));
  }

  deleteFile(channelId: string, fileName: string): Observable<void> {
    return this.http.delete<void>(getUrl(`/api/v2/files/${channelId}/${fileName}`));
  }

  uploadFile(channelId: string, file: File): Observable<UploadStatusReport> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post<void>(getUrl(`/api/v2/files/${channelId}`), formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(uploadProgress());
  }

  downloadFile(channelId: string, filename: string): Observable<Blob> {
    return this.http
      .get(getUrl(`/api/v2/files/${channelId}/dl/${filename}`), {
        responseType: 'arraybuffer',
      })
      .pipe(map((data) => new Blob([data])));
  }
}

function uploadProgress(): OperatorFunction<HttpEvent<void>, UploadStatusReport> {
  return map((e: HttpEvent<void>) => {
    switch (e.type) {
      case HttpEventType.DownloadProgress:
      case HttpEventType.UploadProgress:
        return {
          percentage: Math.round((100 * e.loaded) / e.total!),
        };
      case HttpEventType.Sent:
        return {
          percentage: 1,
        };
      default:
        return {
          percentage: 0,
        };
    }
  });
}

export interface UploadStatusReport {
  percentage: number;
}
