import { TestBed } from '@angular/core/testing';

import { FormErrorPipe } from './form-error.pipe';
import { FormErrorService } from './form-error.service';

describe('FormErrorPipe', () => {
  let pipe: FormErrorPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormErrorPipe, FormErrorService],
    });
    pipe = TestBed.inject(FormErrorPipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
