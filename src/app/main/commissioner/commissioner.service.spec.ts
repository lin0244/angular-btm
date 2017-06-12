import { TestBed, inject } from '@angular/core/testing';

import { CommissionerService } from './commissioner.service';

describe('CommissionerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommissionerService]
    });
  });

  it('should ...', inject([CommissionerService], (service: CommissionerService) => {
    expect(service).toBeTruthy();
  }));
});
