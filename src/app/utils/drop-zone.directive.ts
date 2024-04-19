import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[facDropZone]',
  standalone: true,
})
export class DropZoneDirective {
  @Output() filesDropped = new EventEmitter<FileList>();

  @HostBinding('class.drop-zone-active') dropZone = false;

  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dropZone = true;
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.dropZone = false;
  }

  @HostListener('drop', ['$event']) onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    console.log('DropZoneDirective', 'Drop', event);
    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) {
      console.error('DropZoneDirective', 'No files dropped');
      return;
    }

    this.filesDropped.emit(files);
    this.dropZone = false;
  }
}
