import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FileHeader } from './entities';

const MIME_TYPES = ['audio/mpeg', 'image/jpg', 'image/png', 'image/gif', 'application/zip', 'application/pdf'];

function getRandomNumber(min: number = 0, max: number = 10): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

@Injectable({
  providedIn: 'root',
})
export class FileApiService {
  getFilesForChannel(channelId: string): Observable<FileHeader[]> {
    console.log('Calling fake API FileApiService.getFilesForChannel', channelId);

    return of(
      Array.from({ length: 51 }, (_, i) => i + 1).map((i) => ({
        id: i.toString(),
        channelId,
        fileName: `File ${i}`,
        fileSize: getRandomNumber(512, 10_000) * 1024,
        mimeType: MIME_TYPES[getRandomNumber(0, MIME_TYPES.length - 1)],
      })),
    );
  }
}
