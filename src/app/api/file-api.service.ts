import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { getUrl } from '../utils/api';

import { FileHeader, FileStorageQuota } from './entities';

// const MIME_TYPES = ['audio/mpeg', 'image/jpg', 'image/png', 'image/gif', 'application/zip', 'application/pdf'];

@Injectable({
  providedIn: 'root',
})
export class FileApiService {
  private readonly http = inject(HttpClient);

  getFilesForChannel(channelId: string): Observable<FileHeader[]> {
    return this.http.get<FileHeader[]>(getUrl(`/api/v2/files/${channelId}`));
    // return of(
    //   Array.from({ length: 51 }, (_, i) => i + 1).map((i) => ({
    //     id: i.toString(),
    //     channelId,
    //     fileName: `File ${i}`,
    //     fileSize: getRandomNumber(512, 10_000) * 1024,
    //     mimeType: MIME_TYPES[getRandomNumber(0, MIME_TYPES.length - 1)],
    //   })),
    // );
  }

  getFileQuota(channelId: string): Observable<FileStorageQuota> {
    return this.http.get<FileStorageQuota>(getUrl(`/api/v2/files/${channelId}/quota`));
  }

  deleteFile(channelId: string, fileName: string): Observable<void> {
    return this.http.delete<void>(getUrl(`/api/v2/files/${channelId}/${fileName}`));
  }
}
