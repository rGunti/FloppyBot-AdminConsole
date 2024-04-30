import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelAliasesComponent } from './channel-aliases.component';

describe('ChannelAliasesComponent', () => {
  let component: ChannelAliasesComponent;
  let fixture: ComponentFixture<ChannelAliasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelAliasesComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ChannelAliasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
