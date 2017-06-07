import { TestBed, inject } from '@angular/core/testing';

import { UserCenterService } from './user-center.service';

describe('UserCenterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserCenterService]
    });
  });

  it('should ...', inject([UserCenterService], (service: UserCenterService) => {
    expect(service).toBeTruthy();
  }));
});
