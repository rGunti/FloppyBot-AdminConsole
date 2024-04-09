import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FileHeader } from './entities';

@Injectable({
  providedIn: 'root',
})
export class FileApiService {
  getFilesForChannel(channelId: string): Observable<FileHeader[]> {
    console.log('Calling fake API', channelId);
    return of([
      {
        id: '1',
        channelId,
        fileName: 'File 1',
        fileSize: 1.2 * 1024 * 1024,
        mimeType: 'application/mpeg',
      },
      {
        id: '2',
        channelId,
        fileName: 'File 2',
        fileSize: 2.3 * 1024 * 1024,
        mimeType: 'application/pdf',
      },
      {
        id: '3',
        channelId,
        fileName: 'File 3',
        fileSize: 3.4 * 1024 * 1024,
        mimeType: 'image/jpeg',
      },
      {
        id: '4',
        channelId,
        fileName: 'File 4',
        fileSize: 4.5 * 1024 * 1024,
        mimeType: 'text/plain',
      },
    ]);
  }
}
