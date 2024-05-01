import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ShowUrlComponent } from './show-url.component';

describe('ShowUrlComponent', () => {
  let component: ShowUrlComponent;
  let fixture: ComponentFixture<ShowUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowUrlComponent, NoopAnimationsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
