import { TestBed, inject } from '@angular/core/testing';

import { ParameterService } from './parameter.service';

describe('ParameterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParameterService]
    });
  });

  it('should ...', inject([ParameterService], (service: ParameterService) => {
    expect(service).toBeTruthy();
  }));
});
