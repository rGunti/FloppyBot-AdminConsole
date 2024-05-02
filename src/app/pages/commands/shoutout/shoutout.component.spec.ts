import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoutoutComponent } from './shoutout.component';

describe('ShoutoutComponent', () => {
  let component: ShoutoutComponent;
  let fixture: ComponentFixture<ShoutoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShoutoutComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ShoutoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
