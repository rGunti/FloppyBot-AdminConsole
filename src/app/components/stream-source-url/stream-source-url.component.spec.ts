import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { StreamSourceUrlComponent } from './stream-source-url.component';

describe('StreamSourceUrlComponent', () => {
  let component: StreamSourceUrlComponent;
  let fixture: ComponentFixture<StreamSourceUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StreamSourceUrlComponent, NoopAnimationsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(StreamSourceUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
