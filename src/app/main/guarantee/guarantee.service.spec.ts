import { TestBed, inject } from '@angular/core/testing';

import { GuaranteeService } from './guarantee.service';

describe('GuaranteeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuaranteeService]
    });
  });

  it('should ...', inject([GuaranteeService], (service: GuaranteeService) => {
    expect(service).toBeTruthy();
  }));
});
