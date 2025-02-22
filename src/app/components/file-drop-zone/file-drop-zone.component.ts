import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBar } from '@angular/material/progress-bar';
import { bootstrapFileEarmarkArrowUp } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

import { DropZoneDirective } from '../../utils/drop-zone.directive';

@Component({
  selector: 'fac-file-drop-zone',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, NgIconComponent, DropZoneDirective],
  providers: [
    provideIcons({
      bootstrapFileEarmarkArrowUp,
    }),
  ],
  templateUrl: './file-drop-zone.component.html',
  styleUrl: './file-drop-zone.component.scss',
})
export class FileDropZoneComponent {
  @ViewChild('fileInput') fileInput!: HTMLInputElement;

  @Output() filesSelected = new EventEmitter<FileList>();

  onFileSelected($event: Event) {
    const eventTarget = $event.target as HTMLInputElement;
    if (!eventTarget) {
      console.error('FileDropZone', 'No event target');
    }

    const files = eventTarget.files;
    if (!files) {
      console.error('FileDropZone', 'No files selected');
      return;
    }

    console.log('FileDropZone', 'Selected files', files);
    this.filesSelected.emit(files);
  }

  onFilesDropped(files: FileList) {
    console.log('FileDropZone', 'Dropped files', files);
    this.filesSelected.emit(files);
  }
}
