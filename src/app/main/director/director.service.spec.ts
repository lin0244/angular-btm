import { TestBed, inject } from '@angular/core/testing';

import { DirectorService } from './director.service';

describe('DirectorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DirectorService]
    });
  });

  it('should ...', inject([DirectorService], (service: DirectorService) => {
    expect(service).toBeTruthy();
  }));
});
