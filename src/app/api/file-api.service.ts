import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FileHeader } from './entities';

function getRandomNumber(min: number = 0, max: number = 10): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

@Injectable({
  providedIn: 'root',
})
export class FileApiService {
  getFilesForChannel(channelId: string): Observable<FileHeader[]> {
    console.log('Calling fake API FileApiService.getFilesForChannel', channelId);
    return of([
      {
        id: '1',
        channelId,
        fileName: 'File 1',
        fileSize: getRandomNumber(512, 10_000) * 1024,
        mimeType: 'application/mpeg',
      },
      {
        id: '2',
        channelId,
        fileName: 'File 2',
        fileSize: getRandomNumber(512, 10_000) * 1024,
        mimeType: 'application/pdf',
      },
      {
        id: '3',
        channelId,
        fileName: 'File 3',
        fileSize: getRandomNumber(512, 10_000) * 1024,
        mimeType: 'image/jpeg',
      },
      {
        id: '4',
        channelId,
        fileName: 'File 4',
        fileSize: getRandomNumber(512, 10_000) * 1024,
        mimeType: 'text/plain',
      },
    ]);
  }
}
