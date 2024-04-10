import { Pipe, PipeTransform } from '@angular/core';
import { IconType } from '@ng-icons/core';

@Pipe({
  name: 'fileIcon',
  standalone: true,
})
export class FileIconPipe implements PipeTransform {
  transform(value: string | null | undefined): IconType {
    if (!value) {
      return 'bootstrapFileEarmark';
    }

    const baseType = value.split('/')[0];
    const subType = value.split('/')[1];
    switch (baseType) {
      case 'audio':
        return 'bootstrapFileEarmarkMusic';
      case 'image':
        return 'bootstrapFileEarmarkImage';
      case 'application':
        switch (subType) {
          case 'zip':
            return 'bootstrapFileEarmarkZip';
          case 'pdf':
            return 'bootstrapFileEarmarkPdf';
          default:
            return 'bootstrapFileEarmark';
        }
      default:
        return 'bootstrapFileEarmark';
    }
  }
}
