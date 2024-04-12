import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileStorageQuotaComponent } from './file-storage-quota.component';

describe('FileStorageQuotaComponent', () => {
  let component: FileStorageQuotaComponent;
  let fixture: ComponentFixture<FileStorageQuotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileStorageQuotaComponent, provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(FileStorageQuotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
